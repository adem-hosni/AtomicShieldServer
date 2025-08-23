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
  History,
  Calendar,
  Download,
  Plus,
  Minus,
  Wrench,
  Bug,
  Shield,
  Zap,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Equal,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Loader2,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useScrollAnimation,
  getScrollAnimationClasses,
} from "@/hooks/use-scroll-animation";
import { api } from "@/lib/api-client";
import type { PatchNote } from "@/lib/api-client";

// API Response interface
interface PatchNotesApiResponse {
  success: boolean;
  data: PatchNote[];
  error?: string;
}

function decodeHTMLEntities(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

const releaseTypeColors = {
  Major: "bg-red-500/10 text-red-600 border-red-500/20",
  Minor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Patch: "bg-green-500/10 text-green-600 border-green-500/20",
  Hotfix: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const statusTagColors = {
  Stable: "bg-green-500/10 text-green-600 border-green-500/20",
  Recommended: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Beta: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Alpha: "bg-red-500/10 text-red-600 border-red-500/20",
  Deprecated: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getVersionIcon(type: string) {
  switch (type) {
    case "Major":
      return <ArrowUp className="h-4 w-4" />;
    case "Minor":
      return <ArrowUp className="h-3 w-3" />;
    case "Patch":
      return <Equal className="h-3 w-3" />;
    case "Hotfix":
      return <Zap className="h-3 w-3" />;
    default:
      return <History className="h-3 w-3" />;
  }
}

export function ChangelogsPage() {
  usePageTitle("Changelogs");
  const [selectedVersion, setSelectedVersion] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChangelog, setExpandedChangelog] = useState<string | null>(
    null,
  );
  const [patchNotes, setPatchNotes] = useState<PatchNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll animation hooks for different sections
  const headerAnimation = useScrollAnimation({ threshold: 0.3 });
  const filtersAnimation = useScrollAnimation({ threshold: 0.2 });
  const changelogsAnimation = useScrollAnimation({ threshold: 0.2 });

  // Fetch patch notes data from API
  useEffect(() => {
    const fetchPatchNotes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await api.patchNotes.fetchPatchNotes();

        if (result.success && result.data) {
          console.log("Patch Notes Data:", result.data);
          setPatchNotes(result.data);
        } else {
          throw new Error(result.error || "Failed to load patch notes");
        }
      } catch (error) {
        console.error("Error fetching patch notes:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load patch notes",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatchNotes();
  }, []);

  const filteredChangelogs = patchNotes.filter((patchNote) => {
    const matchesVersion =
      selectedVersion === "all" || patchNote.version === selectedVersion;
    const matchesType =
      selectedType === "all" || patchNote.releaseType === selectedType;
    const matchesSearch =
      patchNote.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patchNote.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patchNote.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patchNote.highlights.some((h) =>
        h.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesVersion && matchesType && matchesSearch;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto relative">
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.05)_75%,rgba(59,130,246,0.05)_76%,transparent_77%)] bg-[length:60px_60px] animate-pulse" />
        </div>

        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 relative">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Changelogs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Release Changelogs
            </h1>
            <p className="text-muted-foreground text-lg">
              Track all changes, improvements, and fixes across AtomicShield
              versions
            </p>
          </div>

          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading patch notes...</p>
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

        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 relative">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Changelogs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Release Changelogs
            </h1>
            <p className="text-muted-foreground text-lg">
              Track all changes, improvements, and fixes across AtomicShield
              versions
            </p>
          </div>

          <Alert variant="destructive" className="max-w-2xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error loading patch notes:</strong> {error}
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

      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 relative">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Changelogs</BreadcrumbPage>
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
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Release Changelogs
            </h1>
            <p className="text-muted-foreground text-lg">
              Track all changes, improvements, and fixes across AtomicShield
              versions
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
                  placeholder="Search changelogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-primary/20 focus:border-primary/40"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48 bg-background/50 border-primary/20">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Major">Major Releases</SelectItem>
                <SelectItem value="Minor">Minor Releases</SelectItem>
                <SelectItem value="Patch">Patches</SelectItem>
                <SelectItem value="Hotfix">Hotfixes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger className="w-full sm:w-48 bg-background/50 border-primary/20">
                <History className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Versions</SelectItem>
                {patchNotes.map((patchNote) => (
                  <SelectItem key={patchNote.id} value={patchNote.version}>
                    {patchNote.version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Patch Notes */}
        <div ref={changelogsAnimation.elementRef} className="space-y-6">
          {filteredChangelogs.map((patchNote, index) => (
            <Card
              key={patchNote.id}
              className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${getScrollAnimationClasses(changelogsAnimation.isVisible, "slide-in-bottom", "500", `${index * 200}`)}`}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-foreground">
                        {patchNote.title || "No Title"}
                      </h2>
                      <Badge
                        variant="secondary"
                        className="bg-muted/50 text-muted-foreground border-muted"
                      >
                        {patchNote.version}
                      </Badge>
                      <Badge
                        className={`${releaseTypeColors[patchNote.releaseType as keyof typeof releaseTypeColors]} border`}
                      >
                        {getVersionIcon(patchNote.releaseType)}
                        <span className="ml-1 capitalize">
                          {patchNote.releaseType}
                        </span>
                      </Badge>
                      {patchNote.statusTags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          className={`${statusTagColors[tag as keyof typeof statusTagColors]} border`}
                        >
                          <span className="capitalize">{tag}</span>
                        </Badge>
                      ))}
                      {!patchNote.seen && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-500/10 text-blue-600 border-blue-500/20"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(patchNote.publishedAt)}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedChangelog(
                          expandedChangelog === patchNote.id
                            ? null
                            : patchNote.id,
                        )
                      }
                    >
                      {expandedChangelog === patchNote.id
                        ? "Collapse"
                        : "Expand"}
                    </Button>
                  </div>
                </div>

                {/* Highlights */}
                {patchNote.highlights &&
                  patchNote.highlights.length > 0 &&
                  patchNote.highlights.some(
                    (highlight) => highlight.trim() !== "",
                  ) && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Key Highlights
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {patchNote.highlights
                          .filter((highlight) => highlight.trim() !== "")
                          .map((highlight, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">
                                {highlight}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={patchNote.author.avatar || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {patchNote.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {patchNote.author.name}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {patchNote.author.role}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {expandedChangelog === patchNote.id && (
                <CardContent className="pt-0">
                  <Separator className="mb-6" />

                  {/* Description */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Release Description
                    </h3>
                    <div
                      className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: decodeHTMLEntities(patchNote.description),
                      }}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredChangelogs.length === 0 && (
          <div className="text-center py-12">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No patch notes found
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
