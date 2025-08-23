import React, { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Download,
  Shield,
  Server,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Terminal,
  Folder,
  Settings,
  Play,
  Copy,
  ChevronDown,
  ChevronRight,
  Clock,
  Users,
  HardDrive,
  Cpu,
  Monitor,
  Globe,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useScrollAnimation,
  getScrollAnimationClasses,
} from "@/hooks/use-scroll-animation";
import { api, authManager } from "@/lib/api-client";
import type { DownloadItem } from "@/lib/api-client";

// API Response interface
interface DownloadAssetsApiResponse {
  success: boolean;
  data: DownloadItem[];
  error?: string;
}

const systemRequirements = [
  {
    category: "Server Requirements",
    icon: <Server className="h-5 w-5" />,
    items: [
      "Any FiveM Server",
      "Linux or Windows Server OS",
      "Minimal resource usage",
      "Lightweight installation",
      "Plug and play setup",
    ],
  },
  {
    category: "Dependencies",
    icon: <Settings className="h-5 w-5" />,
    items: [
      "No dependencies required",
      "Zero external libraries needed",
      "Self-contained resource",
      "No additional setup required",
      "Works out of the box",
    ],
  },
  {
    category: "Compatibility",
    icon: <Globe className="h-5 w-5" />,
    items: [
      "Compatible with all frameworks",
      "Works with any FiveM setup",
      "Universal compatibility",
      "All database systems supported",
      "Multi-language ready",
    ],
  },
];

function InstallationStep({
  number,
  title,
  children,
  isLast = false,
  isParentVisible = false,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
  isParentVisible?: boolean;
}) {
  return (
    <div
      className={`flex gap-4 transition-transform group ${getScrollAnimationClasses(isParentVisible, "slide-in-left", "500", `${300 + number * 100}`)}`}
    >
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full text-primary-foreground text-sm font-semibold hover:scale-110 hover:animate-pulse transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:shadow-primary/50">
          {number}
        </div>
        {!isLast && (
          <div
            className={`w-px h-12 bg-border mt-2 group-hover:bg-primary/50 transition-colors ${getScrollAnimationClasses(isParentVisible, "fade-in", "1000", `${400 + number * 100}`)}`}
          />
        )}
      </div>
      <div className="flex-1 pb-8">
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({
  code,
  language = "bash",
}: {
  code: string;
  language?: string;
}) {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard",
    });
  };

  return (
    <div className="relative">
      <div className="bg-muted rounded-lg p-4 font-mono text-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {language}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-6 px-2 text-xs"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
        </div>
        <pre className="text-foreground whitespace-pre-wrap">{code}</pre>
      </div>
    </div>
  );
}

export function DownloadPage() {
  usePageTitle("Downloads");
  const [downloadItems, setDownloadItems] = useState<DownloadItem[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<DownloadItem | null>(
    null,
  );
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Scroll animation hooks for different sections
  const headerAnimation = useScrollAnimation({ threshold: 0.3 });
  const downloadSectionAnimation = useScrollAnimation({ threshold: 0.2 });
  const requirementsAnimation = useScrollAnimation({ threshold: 0.3 });
  const installationAnimation = useScrollAnimation({ threshold: 0.2 });
  const faqAnimation = useScrollAnimation({ threshold: 0.3 });
  const supportAnimation = useScrollAnimation({ threshold: 0.3 });

  // Fetch download assets data from API
  useEffect(() => {
    const fetchDownloadAssets = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await api.downloadAssets.fetchDownloadAssets();

        if (result.success && result.data) {
          setDownloadItems(result.data);
          // Set the recommended version as default, or first item
          const recommendedVersion =
            result.data.find((item) => item.recommended) || result.data[0];
          setSelectedVersion(recommendedVersion);
        } else {
          throw new Error(result.error || "Failed to load download assets");
        }
      } catch (error) {
        console.error("Error fetching download assets:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load download assets",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDownloadAssets();
  }, []);

  const handleDownload = async (
    downloadItem: DownloadItem,
    assetId?: number,
  ) => {
    if (!downloadItem.assets || downloadItem.assets.length === 0) {
      toast({
        title: "Download Error",
        description: "No download assets available for this version.",
        variant: "destructive",
      });
      return;
    }

    const primaryAsset =
      downloadItem.assets.find((asset) => asset.isPrimary) ||
      downloadItem.assets[0];

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/download-assets/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authManager.getToken()}`,
        },
        body: JSON.stringify({ assetId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // grab filename from server header if available
      let filename = `${downloadItem.title}-${downloadItem.version}.zip`;
      const disposition = response.headers.get("Content-Disposition");
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/['"]/g, "");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: `Downloading ${downloadItem.title} ${downloadItem.version}...`,
      });
    } catch (err: any) {
      toast({
        title: "Download Error",
        description: err.message || "Failed to start download",
        variant: "destructive",
      });
    }
  };

  const faqItems = [
    {
      id: "license",
      question: "Do I need a license to use AtomicShield?",
      answer:
        "Yes, AtomicShield requires a valid license key to function. You can purchase a license from our website or contact our sales team for enterprise solutions.",
    },
    {
      id: "support",
      question: "What support is included?",
      answer:
        "All licenses include access to our support portal, documentation, and community forums. Premium licenses include priority support and direct access to our development team.",
    },
    {
      id: "updates",
      question: "How do I update AtomicShield?",
      answer:
        "Updates can be downloaded from this page. Simply replace the old files with the new ones and restart your server. Always backup your configuration before updating.",
    },
    {
      id: "compatibility",
      question: "Is AtomicShield compatible with my framework?",
      answer:
        "AtomicShield is designed to work with all major FiveM frameworks including ESX, QBCore, and standalone servers. Check our compatibility guide for specific requirements.",
    },
  ];

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
                <BreadcrumbPage>Download</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Download AtomicShield
            </h1>
            <p className="text-muted-foreground text-lg">
              Get the latest version of AtomicShield anti-cheat protection for
              your FiveM server
            </p>
          </div>

          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Loading download assets...
              </p>
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
                <BreadcrumbPage>Download</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Download AtomicShield
            </h1>
            <p className="text-muted-foreground text-lg">
              Get the latest version of AtomicShield anti-cheat protection for
              your FiveM server
            </p>
          </div>

          <Alert variant="destructive" className="max-w-2xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error loading download assets:</strong> {error}
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
              <BreadcrumbPage>Download</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div
          ref={headerAnimation.elementRef}
          className={`text-center space-y-4 ${getScrollAnimationClasses(headerAnimation.isVisible, "fade-in", "700")}`}
        >
          <div
            className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl mx-auto hover:scale-110 hover:rotate-3 transition-all duration-300 group ${getScrollAnimationClasses(headerAnimation.isVisible, "zoom-in", "500", "200")}`}
          >
            <Shield className="h-8 w-8 text-primary animate-pulse group-hover:animate-bounce" />
          </div>
          <div
            className={getScrollAnimationClasses(
              headerAnimation.isVisible,
              "slide-in-bottom",
              "700",
              "300",
            )}
          >
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
              Download AtomicShield
            </h1>
            <p
              className={`text-muted-foreground text-lg mt-2 max-w-2xl mx-auto hover:text-foreground transition-colors duration-300 ${getScrollAnimationClasses(headerAnimation.isVisible, "fade-in", "700", "500")}`}
            >
              Get the latest version of AtomicShield anti-cheat protection for
              your FiveM server
            </p>
          </div>
        </div>

        {/* Download Section */}
        <div
          ref={downloadSectionAnimation.elementRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Version Selection */}
          <div
            className={`lg:col-span-1 ${getScrollAnimationClasses(downloadSectionAnimation.isVisible, "slide-in-left", "700")}`}
          >
            <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Available Versions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {downloadItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-right delay-${(index + 1) * 200} ${
                      selectedVersion?.id === item.id
                        ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/20"
                        : "border-border hover:border-primary/30 hover:bg-primary/5"
                    }`}
                    onClick={() => setSelectedVersion(item)}
                    style={{
                      animationDelay: `${700 + index * 100}ms`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.version}</span>
                          {item.recommended && (
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                              Recommended
                            </Badge>
                          )}
                          <Badge
                            variant={
                              item.stability === "stable"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              item.stability === "stable"
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                : item.stability === "beta"
                                  ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                  : "bg-red-500/10 text-red-600 border-red-500/20"
                            }
                          >
                            {item.stability}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.fileSizeMB} MB • {item.format} •{" "}
                          {new Date(item.releaseDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Download Details */}
          <div
            className={`lg:col-span-2 space-y-6 ${getScrollAnimationClasses(downloadSectionAnimation.isVisible, "slide-in-right", "700", "300")}`}
          >
            {/* Selected Version Info */}
            {selectedVersion && (
              <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">
                      {selectedVersion.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {selectedVersion.recommended && (
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                      <Badge
                        variant={
                          selectedVersion.stability === "stable"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          selectedVersion.stability === "stable"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : selectedVersion.stability === "beta"
                              ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                              : "bg-red-500/10 text-red-600 border-red-500/20"
                        }
                      >
                        {selectedVersion.stability}
                      </Badge>
                      <Badge variant="outline">
                        {selectedVersion.platform}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    {selectedVersion.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {selectedVersion.fileSizeMB}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        File Size
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {new Date(
                          selectedVersion.releaseDate,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Release Date
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {selectedVersion.platform}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Platform
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {selectedVersion.format}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Format
                      </div>
                    </div>
                  </div>

                  {/* Download Assets */}
                  <div className="space-y-3 mb-6">
                    {selectedVersion.assets &&
                    selectedVersion.assets.length > 0 ? (
                      selectedVersion.assets.map((asset, index) => (
                        <Button
                          key={asset.id}
                          onClick={() =>
                            handleDownload(selectedVersion, asset.id)
                          }
                          className={`${asset.isPrimary ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"} font-semibold shadow-lg w-full hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-200 group`}
                          size="lg"
                        >
                          <Download className="h-5 w-5 mr-2 group-hover:translate-y-[-1px] transition-transform duration-200" />
                          {asset.label}
                        </Button>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>No download assets available</p>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => (window.location.href = "/changelogs")}
                    className="hover:shadow-lg transition-all duration-300 group w-full"
                  >
                    <FileText className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                    View Changelog
                  </Button>

                  {selectedVersion.stability !== "stable" && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        This is a {selectedVersion.stability} version. Use with
                        caution on production servers. Always backup your server
                        before installing experimental versions.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* System Requirements */}
            <Card
              ref={requirementsAnimation.elementRef}
              className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${getScrollAnimationClasses(requirementsAnimation.isVisible, "slide-in-bottom", "700")}`}
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${getScrollAnimationClasses(requirementsAnimation.isVisible, "slide-in-left", "500", "200")}`}
                >
                  <Monitor className="h-5 w-5 text-primary animate-pulse" />
                  System Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {systemRequirements.map((category, index) => (
                    <div
                      key={index}
                      className={`space-y-3 transition-transform ${getScrollAnimationClasses(requirementsAnimation.isVisible, "fade-in", "500", `${300 + index * 100}`)}`}
                    >
                      <h3 className="font-semibold flex items-center gap-2 text-foreground">
                        {category.icon}
                        {category.category}
                      </h3>
                      <ul className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Installation Guide */}
        <Card
          ref={installationAnimation.elementRef}
          className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${getScrollAnimationClasses(installationAnimation.isVisible, "slide-in-bottom", "700")}`}
        >
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${getScrollAnimationClasses(installationAnimation.isVisible, "slide-in-left", "500", "200")}`}
            >
              <Terminal className="h-5 w-5 text-primary animate-pulse" />
              Installation Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <InstallationStep
                number={1}
                title="Place the AtomicShield folder in your /resources directory (not in a subfolder)"
                isParentVisible={installationAnimation.isVisible}
              >
                <p className="text-muted-foreground text-sm mb-4">
                  Extract the downloaded file and place it directly in your
                  resources folder
                </p>
                <div className="bg-slate-900/50 border border-primary/20 rounded-lg p-4">
                  <p className="font-mono text-sm text-primary">
                    📁 resources/
                    <br />
                    &nbsp;&nbsp;└── atomic-shield/{" "}
                    <span className="text-green-400">← Place here</span>
                  </p>
                </div>
              </InstallationStep>

              <InstallationStep
                number={2}
                title="Add the following to the TOP of your server.cfg file:"
                isParentVisible={installationAnimation.isVisible}
              >
                <CodeBlock code="ensure atomic-shield" language="cfg" />
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Make sure to add your server key to the server.key file in
                    the atomic-shield folder
                  </AlertDescription>
                </Alert>
              </InstallationStep>

              <InstallationStep
                number={3}
                title="Start your server and enjoy your protection!"
                isLast
                isParentVisible={installationAnimation.isVisible}
              >
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-green-400 font-medium">Success!</p>
                    <p className="text-sm text-muted-foreground">
                      You should see "Joined AtomicShield network successfully!"
                      in the console
                    </p>
                  </div>
                </div>
              </InstallationStep>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card
          ref={faqAnimation.elementRef}
          className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${getScrollAnimationClasses(faqAnimation.isVisible, "slide-in-bottom", "700")}`}
        >
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${getScrollAnimationClasses(faqAnimation.isVisible, "slide-in-left", "500", "200")}`}
            >
              <HelpCircle className="h-5 w-5 text-primary animate-pulse" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqItems.map((item, index) => (
              <Collapsible
                key={item.id}
                open={expandedFaq === item.id}
                onOpenChange={() =>
                  setExpandedFaq(expandedFaq === item.id ? null : item.id)
                }
                className={getScrollAnimationClasses(
                  faqAnimation.isVisible,
                  "slide-in-right",
                  "500",
                  `${300 + index * 100}`,
                )}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg border border-border hover:border-primary/30 transition-all duration-300 group">
                  <span className="font-medium text-left">{item.question}</span>
                  {expandedFaq === item.id ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-3 pb-3 pt-2">
                  <p className="text-muted-foreground">{item.answer}</p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card
          ref={supportAnimation.elementRef}
          className={`bg-gradient-to-br from-primary/5 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${getScrollAnimationClasses(supportAnimation.isVisible, "slide-in-bottom", "700")}`}
        >
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3
                className={`text-xl font-semibold hover:scale-110 transition-transform ${getScrollAnimationClasses(supportAnimation.isVisible, "zoom-in", "500", "200")}`}
              >
                Need Help?
              </h3>
              <p
                className={`text-muted-foreground max-w-2xl mx-auto ${getScrollAnimationClasses(supportAnimation.isVisible, "fade-in", "700", "300")}`}
              >
                If you encounter any issues during installation or have
                questions about AtomicShield, our support team is here to help.
              </p>
              <div
                className={`flex flex-col sm:flex-row gap-3 justify-center ${getScrollAnimationClasses(supportAnimation.isVisible, "slide-in-bottom", "500", "400")}`}
              >
                <Button
                  variant="outline"
                  className="hover:shadow-lg transition-all duration-300 group"
                >
                  <Users className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                  Join Discord
                </Button>
                <Button
                  variant="outline"
                  className="hover:shadow-lg transition-all duration-300 group"
                >
                  <FileText className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Documentation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
