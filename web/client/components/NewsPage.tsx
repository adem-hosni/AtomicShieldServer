import React, { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Newspaper,
  Calendar,
  User,
  Pin,
  Bell,
  Clock,
  Filter,
  Search,
  ArrowRight,
  Eye,
  MessageSquare,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useScrollAnimation,
  getScrollAnimationClasses,
} from "@/hooks/use-scroll-animation";
import { api } from "@/lib/api-client";

interface NewsPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  category: "announcement" | "security" | "update" | "maintenance" | "feature";
  isPinned?: boolean;
  isImportant?: boolean;
  readTime: string;
  views: number;
  comments: number;
}

// API Response interfaces
interface NewsApiResponse {
  success: boolean;
  data: NewsPost[];
  error?: string;
}

const categoryColors = {
  announcement: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  security: "bg-red-500/10 text-red-600 border-red-500/20",
  update: "bg-green-500/10 text-green-600 border-green-500/20",
  maintenance: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  feature: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

const categoryIcons = {
  announcement: <Bell className="h-3 w-3" />,
  security: <Newspaper className="h-3 w-3" />,
  update: <ArrowRight className="h-3 w-3" />,
  maintenance: <Clock className="h-3 w-3" />,
  feature: <MessageSquare className="h-3 w-3" />,
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function decodeHTMLEntities(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function formatContent(content: string, category?: string) {
  // For announcement posts, render HTML content directly
  if (category === "announcement") {
    const decodedContent = decodeHTMLEntities(content);
    return <div dangerouslySetInnerHTML={{ __html: decodedContent }} />;
  }

  // Simple markdown-like formatting for other categories
  return content.split("\n").map((line, index) => {
    if (line.startsWith("## ")) {
      return (
        <h2
          key={index}
          className="text-xl font-semibold text-foreground mt-6 mb-3"
        >
          {line.substring(3)}
        </h2>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h3
          key={index}
          className="text-lg font-medium text-foreground mt-4 mb-2"
        >
          {line.substring(4)}
        </h3>
      );
    }
    if (line.startsWith("- **")) {
      const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
      if (match) {
        return (
          <li key={index} className="ml-4 mb-1">
            <span className="font-medium text-foreground">{match[1]}</span>:{" "}
            {match[2]}
          </li>
        );
      }
    }
    if (
      line.startsWith("⚠️ **") ||
      line.startsWith("📋 **") ||
      line.startsWith("🔄 **")
    ) {
      const match = line.match(/^(⚠️|📋|🔄) \*\*(.*?)\*\*: (.*)/);
      if (match) {
        return (
          <div
            key={index}
            className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-2"
          >
            <span className="text-lg">{match[1]}</span>
            <div>
              <span className="font-medium text-yellow-600">{match[2]}</span>:{" "}
              {match[3]}
            </div>
          </div>
        );
      }
    }
    if (line.trim() === "") {
      return <br key={index} />;
    }
    return (
      <p key={index} className="mb-2 text-muted-foreground leading-relaxed">
        {line}
      </p>
    );
  });
}

export function NewsPage() {
  usePageTitle("News");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [newsData, setNewsData] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll animation hooks for different sections
  const headerAnimation = useScrollAnimation({ threshold: 0.3 });
  const filtersAnimation = useScrollAnimation({ threshold: 0.2 });
  const pinnedAnimation = useScrollAnimation({ threshold: 0.3 });
  const recentAnimation = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await api.news.fetchNews();

        if (result.success && result.data) {
          setNewsData(result.data); // ⬅ data is already the array
        } else {
          throw new Error(result.error || "Failed to load news data");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load news",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = newsData.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pinnedPosts = filteredNews.filter((post) => post.isPinned);
  const regularPosts = filteredNews.filter((post) => !post.isPinned);

  if (selectedPost) {
    return (
      <div className="flex-1 overflow-y-auto relative">
        {/* Animated background */}
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.05)_75%,rgba(59,130,246,0.05)_76%,transparent_77%)] bg-[length:60px_60px] animate-pulse" />
        </div>

        <div className="p-3 lg:p-6 space-y-4 lg:space-y-6 relative">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/news"
                  onClick={() => setSelectedPost(null)}
                >
                  News
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{selectedPost.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => setSelectedPost(null)}
            className="mb-6"
          >
            ← Back to News
          </Button>

          {/* Article */}
          <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  className={`${categoryColors[selectedPost.category]} border`}
                >
                  {categoryIcons[selectedPost.category]}
                  <span className="ml-1 capitalize">
                    {selectedPost.category}
                  </span>
                </Badge>
                {selectedPost.isPinned && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                  >
                    <Pin className="h-3 w-3 mr-1" />
                    Pinned
                  </Badge>
                )}
                {selectedPost.isImportant && (
                  <Badge
                    variant="destructive"
                    className="bg-red-500/10 text-red-600 border-red-500/20"
                  >
                    Important
                  </Badge>
                )}
              </div>

              <CardTitle className="text-3xl font-bold leading-tight">
                {selectedPost.title}
              </CardTitle>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedPost.author.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {selectedPost.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {selectedPost.author.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedPost.author.role}
                      </p>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(selectedPost.publishedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {selectedPost.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {selectedPost.comments} comments
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="prose prose-lg max-w-none">
                {formatContent(selectedPost.content, selectedPost.category)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto relative">
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.05)_75%,rgba(59,130,246,0.05)_76%,transparent_77%)] bg-[length:60px_60px] animate-pulse" />
        </div>

        <div className="p-3 lg:p-6 space-y-4 lg:space-y-6 relative">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>News</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              News
            </h1>
            <p className="text-muted-foreground text-lg">
              Stay updated with the latest AtomicShield news and updates
            </p>
          </div>

          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading news...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 overflow-y-auto relative">
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.05)_75%,rgba(59,130,246,0.05)_76%,transparent_77%)] bg-[length:60px_60px] animate-pulse" />
        </div>

        <div className="p-3 lg:p-6 space-y-4 lg:space-y-6 relative">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>News</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              News
            </h1>
            <p className="text-muted-foreground text-lg">
              Stay updated with the latest AtomicShield news and updates
            </p>
          </div>

          <Alert variant="destructive" className="max-w-2xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error loading news:</strong> {error}
              <Button
                variant="outline"
                size="sm"
                className="mt-2 ml-2"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.05)_75%,rgba(59,130,246,0.05)_76%,transparent_77%)] bg-[length:60px_60px] animate-pulse" />
      </div>

      <div className="p-3 lg:p-6 space-y-4 lg:space-y-6 relative">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>News</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div ref={headerAnimation.elementRef} className="space-y-4">
          <div
            className={getScrollAnimationClasses(
              headerAnimation.isVisible,
              "slide-in-bottom",
              "700",
            )}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              News
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              Stay updated with the latest AtomicShield news and updates
            </p>
          </div>

          {/* Filters */}
          <div
            ref={filtersAnimation.elementRef}
            className={`flex flex-col sm:flex-row gap-4 ${getScrollAnimationClasses(filtersAnimation.isVisible, "slide-in-bottom", "500", "200")}`}
          >
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-primary/20 focus:border-primary/40"
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-48 bg-background/50 border-primary/20">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="announcement">News</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="update">Updates</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="feature">Features</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pinned Posts */}
        {pinnedPosts.length > 0 && (
          <div ref={pinnedAnimation.elementRef} className="space-y-4">
            <h2
              className={`text-xl font-semibold flex items-center gap-2 ${getScrollAnimationClasses(pinnedAnimation.isVisible, "slide-in-left", "500")}`}
            >
              <Pin className="h-5 w-5 text-yellow-500" />
              Pinned News
            </h2>
            <div className="space-y-4">
              {pinnedPosts.map((post, index) => (
                <Card
                  key={post.id}
                  className={`bg-gradient-to-br from-yellow-500/5 to-background/50 backdrop-blur-xl border-yellow-500/20 hover:border-yellow-500/30 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-yellow-500/10 ${getScrollAnimationClasses(pinnedAnimation.isVisible, "zoom-in", "500", `${200 + index * 100}`)}`}
                  onClick={() => setSelectedPost(post)}
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${categoryColors[post.category]} border`}
                      >
                        {categoryIcons[post.category]}
                        <span className="ml-1 capitalize">{post.category}</span>
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                      >
                        <Pin className="h-3 w-3 mr-1" />
                        Pinned
                      </Badge>
                      {post.isImportant && (
                        <Badge
                          variant="destructive"
                          className="bg-red-500/10 text-red-600 border-red-500/20"
                        >
                          Important
                        </Badge>
                      )}
                    </div>

                    <CardTitle className="text-xl hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>

                    <div className="text-muted-foreground line-clamp-2">
                      {post.category === "announcement" ? (
                        <div className="flex flex-col">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: decodeHTMLEntities(
                                post.content,
                              ).substring(0, 150),
                            }}
                          />
                          <span className="text-primary/70 text-sm font-medium mt-1 hover:text-primary transition-colors">
                            Read more →
                          </span>
                        </div>
                      ) : (
                        <p>
                          {post.content
                            .split("\n")
                            .find(
                              (line) => !line.startsWith("#") && line.trim(),
                            )
                            ?.substring(0, 150)}
                          <span className="text-primary/70 text-sm font-medium ml-1 hover:text-primary transition-colors">
                            Read more →
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {post.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium text-foreground">
                            {post.author.name}
                          </p>
                          <p className="text-muted-foreground">
                            {post.author.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.publishedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        <div ref={recentAnimation.elementRef} className="space-y-4">
          {pinnedPosts.length > 0 && (
            <h2
              className={`text-xl font-semibold ${getScrollAnimationClasses(recentAnimation.isVisible, "slide-in-left", "500")}`}
            >
              Recent News
            </h2>
          )}
          <div className="space-y-4">
            {regularPosts.map((post, index) => (
              <Card
                key={post.id}
                className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/10 ${getScrollAnimationClasses(recentAnimation.isVisible, "slide-in-right", "500", `${200 + index * 100}`)}`}
                onClick={() => setSelectedPost(post)}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${categoryColors[post.category]} border`}
                    >
                      {categoryIcons[post.category]}
                      <span className="ml-1 capitalize">{post.category}</span>
                    </Badge>
                    {post.isImportant && (
                      <Badge
                        variant="destructive"
                        className="bg-red-500/10 text-red-600 border-red-500/20"
                      >
                        Important
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="text-xl hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>

                  <div className="text-muted-foreground line-clamp-2">
                    {post.category === "announcement" ? (
                      <div className="flex flex-col">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: decodeHTMLEntities(post.content).substring(
                              0,
                              150,
                            ),
                          }}
                        />
                        <span className="text-primary/70 text-sm font-medium mt-1 hover:text-primary transition-colors">
                          Read more →
                        </span>
                      </div>
                    ) : (
                      <p>
                        {post.content
                          .split("\n")
                          .find((line) => !line.startsWith("#") && line.trim())
                          ?.substring(0, 150)}
                        <span className="text-primary/70 text-sm font-medium ml-1 hover:text-primary transition-colors">
                          Read more →
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {post.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium text-foreground">
                          {post.author.name}
                        </p>
                        <p className="text-muted-foreground">
                          {post.author.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No news found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
