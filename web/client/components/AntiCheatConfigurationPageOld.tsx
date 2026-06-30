import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Shield,
  Save,
  RotateCcw,
  Camera,
  RefreshCw,
  Scan,
  Clock,
  Upload,
  Download,
  Code,
  Info,
  Zap,
  AlertTriangle,
  Bell,
  ChevronDown,
  Loader2,
  WifiOff,
} from "lucide-react";
import {
  DynamicConfigurations as ConfigPageType,
  Category,
  Section,
  Configuration,
  ConfigurationType,
} from "../../shared/api";
import { FileUploadField } from "./FileUploadField";
import { FileDownloadField } from "./FileDownloadField";
import { DiscordEmbedEditor } from "./DiscordEmbedEditor";
import { cn } from "@/lib/utils";
import { configApi } from "@/lib/api-client";

// Icon mapping for configuration icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  settings: Settings,
  shield: Shield,
  camera: Camera,
  refresh: RefreshCw,
  scan: Scan,
  clock: Clock,
  upload: Upload,
  download: Download,
  code: Code,
  discord: Code,
  "file-import": Upload,
  "file-export": Download,
  "code-json": Code,
  zap: Zap,
  bell: Bell,
  "alert-triangle": AlertTriangle,
};

interface SidebarCategoryProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
}

function SidebarCategory({
  category,
  isActive,
  onClick,
}: SidebarCategoryProps) {
  const getIcon = () => {
    switch (category.id) {
      case "general_settings":
        return <Settings className="h-4 w-4" />;
      case "detection_settings":
        return <Shield className="h-4 w-4" />;
      case "punishment_settings":
        return <AlertTriangle className="h-4 w-4" />;
      case "hits_exceptions":
        return <Scan className="h-4 w-4" />;
      case "logging_notifications":
        return <Bell className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3",
        "hover:bg-primary/10 hover:border-primary/20 border border-transparent",
        "hover:shadow-lg hover:shadow-primary/10",
        isActive
          ? "bg-primary/15 text-primary border-primary/30"
          : "text-foreground hover:text-primary",
      )}
    >
      {getIcon()}
      <div className="flex-1">
        <div className="font-medium text-sm">{category.label}</div>
        <div className="text-xs text-muted-foreground">
          {category.description}
        </div>
      </div>
    </button>
  );
}

interface ConfigurationFieldProps {
  config: Configuration;
  value: boolean | number | string;
  onChange: (value: boolean | number | string) => void;
  allValues: Record<string, boolean | number | string>;
}

function ConfigurationField({
  config,
  value,
  onChange,
  allValues,
}: ConfigurationFieldProps) {
  const { title, subtitle, type, tip, id } = config;

  // Check if this is a built-in configuration (development mode only)
  const isBuiltIn =
    process.env.NODE_ENV === "development"
      ? defaultConfigData.categories.some((cat) =>
          cat.sections.some((sec) =>
            sec.configurations.some((cfg) => cfg.id === id),
          ),
        )
      : false;

  switch (type) {
    case "toggle":
      return (
        <div className="flex items-center justify-between py-3 px-4 bg-card/50 rounded-lg border border-border">
          <div className="flex-1">
            <Label className="text-foreground font-medium text-sm">
              {title}
            </Label>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {isBuiltIn && (
              <Badge
                variant="outline"
                className="mt-1 text-xs border-primary/30 text-primary"
              >
                Built-in
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {tip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Switch
              checked={Boolean(value)}
              onCheckedChange={onChange}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      );

    case "number":
      return (
        <div className="space-y-2 py-3 px-4 bg-card/50 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <Label className="text-foreground font-medium text-sm">
              {title}
            </Label>
            {tip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {isBuiltIn && (
              <Badge
                variant="outline"
                className="text-xs border-primary/30 text-primary"
              >
                Built-in
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="bg-background/50 border-border text-foreground focus:border-primary focus:ring-primary/20"
          />
        </div>
      );

    case "text":
      return (
        <div className="space-y-2 py-3 px-4 bg-card/50 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <Label className="text-foreground font-medium text-sm">
              {title}
            </Label>
            {tip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {isBuiltIn && (
              <Badge
                variant="outline"
                className="text-xs border-primary/30 text-primary"
              >
                Built-in
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          <Input
            type="text"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="bg-background/50 border-border text-foreground focus:border-primary focus:ring-primary/20"
          />
        </div>
      );

    case "dropdown":
      return (
        <div className="space-y-2 py-3 px-4 bg-card/50 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <Label className="text-foreground font-medium text-sm">
              {title}
            </Label>
            {tip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {isBuiltIn && (
              <Badge
                variant="outline"
                className="text-xs border-primary/30 text-primary"
              >
                Built-in
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          <Select value={String(value)} onValueChange={onChange}>
            <SelectTrigger className="bg-background/50 border-border text-foreground focus:border-primary focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {config.options?.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="text-popover-foreground focus:bg-primary/20 focus:text-primary"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case "file_upload":
      return (
        <div className="space-y-2 py-3 px-4 bg-card/50 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <Label className="text-foreground font-medium text-sm">
              {title}
            </Label>
            {tip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          <FileUploadField
            onFileSelect={(file) => onChange(file.name)}
            acceptedTypes={config.acceptedTypes}
            className="bg-background/50 border-border"
          />
        </div>
      );

    case "export_json":
      return (
        <div className="space-y-2 py-3 px-4 bg-card/50 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <Label className="text-foreground font-medium text-sm">
              {title}
            </Label>
            {tip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          <FileDownloadField
            data={allValues}
            filename={String(value)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          />
        </div>
      );

    case "embed_json":
      return (
        <div className="space-y-4 py-3 px-4 bg-card/50 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <Label className="text-foreground font-medium text-sm">
              {title}
            </Label>
            {tip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          <div className="space-y-3">
            <Input
              type="text"
              value={String(value)}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter Discord webhook URL"
              className="bg-background/50 border-border text-foreground focus:border-primary focus:ring-primary/20"
            />
            {String(value) && (
              <DiscordEmbedEditor
                webhookUrl={String(value)}
                onEmbedChange={(embed) => {
                  console.log("Discord embed updated:", embed);
                }}
                className="bg-background/50 border-border"
              />
            )}
          </div>
        </div>
      );

    default:
      return (
        <div className="py-3 px-4 bg-card/50 rounded-lg border border-border">
          <p className="text-gray-400 text-sm">
            Unsupported configuration type: {type}
          </p>
        </div>
      );
  }
}

interface ConfigurationSectionProps {
  section: Section;
  values: Record<string, boolean | number | string>;
  onValueChange: (id: string, value: boolean | number | string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

function ConfigurationSection({
  section,
  values,
  onValueChange,
  isCollapsed,
  onToggle,
}: ConfigurationSectionProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 shadow-lg">
      <CardHeader
        className="cursor-pointer hover:bg-slate-700/30 transition-colors"
        onClick={onToggle}
      >
        <CardTitle className="flex items-center justify-between text-gray-200">
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold">{section.title}</div>
            <Badge
              variant="outline"
              className="text-xs border-slate-600 text-gray-400"
            >
              {section.configurations.length} items
            </Badge>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-gray-400 transition-transform duration-200",
              isCollapsed && "rotate-180",
            )}
          />
        </CardTitle>
        {section.subtitle && (
          <p className="text-sm text-gray-400">{section.subtitle}</p>
        )}
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="space-y-4">
          {section.configurations.map((config) => (
            <ConfigurationField
              key={config.id}
              config={config}
              value={values[config.id] ?? config.defaultValue ?? false}
              onChange={(value) => onValueChange(config.id, value)}
              allValues={values}
            />
          ))}
        </CardContent>
      )}
    </Card>
  );
}

// Enhanced mock data with more comprehensive configuration options
const defaultConfigData: ConfigPageType = {
  categories: [
    {
      id: "general_settings",
      label: "General Settings",
      description: "Basic configuration options",
      sections: [
        {
          id: "general",
          title: "General Settings",
          subtitle: "Configure basic shield behavior",
          configurations: [
            {
              id: "enable_shield",
              title: "Enable Shield",
              subtitle: "Turn the shield protection on or off",
              type: "toggle",
              defaultValue: true,
              tip: "When enabled, the shield will actively protect your server",
            },
            {
              id: "protection_level",
              title: "Protection Level",
              subtitle: "Set the overall protection intensity",
              type: "dropdown",
              defaultValue: "medium",
              options: ["low", "medium", "high", "maximum"],
              tip: "Higher levels provide better protection but may impact performance",
            },
            {
              id: "server_name",
              title: "Server Name",
              subtitle: "Display name for your server",
              type: "text",
              defaultValue: "FiveCity RP Demo Server",
              tip: "This name will appear in logs and notifications",
            },
          ],
        },
      ],
    },
    {
      id: "detection_settings",
      label: "Detection Settings",
      description: "Advanced detection algorithms",
      sections: [
        {
          id: "detection",
          title: "Detection Settings",
          subtitle: "Fine-tune detection algorithms",
          configurations: [
            {
              id: "aimbot_detection",
              title: "Aimbot Detection",
              subtitle: "Detect automated aiming assistance",
              type: "toggle",
              defaultValue: true,
              tip: "Enables detection of aimbot and auto-aim cheats",
            },
            {
              id: "wallhack_detection",
              title: "Wallhack Detection",
              subtitle: "Detect wall penetration cheats",
              type: "toggle",
              defaultValue: true,
              tip: "Identifies players using ESP and wallhack cheats",
            },
            {
              id: "detection_sensitivity",
              title: "Detection Sensitivity",
              subtitle: "Adjust the sensitivity of cheat detection",
              type: "number",
              defaultValue: 75,
              tip: "Higher values = more sensitive detection (1-100)",
            },
          ],
        },
      ],
    },
    {
      id: "punishment_settings",
      label: "Punishment Settings",
      description: "Configure punishment actions",
      sections: [
        {
          id: "punishments",
          title: "Punishment Settings",
          subtitle: "Define actions taken against cheaters",
          configurations: [
            {
              id: "auto_ban",
              title: "Automatic Ban",
              subtitle: "Automatically ban detected cheaters",
              type: "toggle",
              defaultValue: true,
              tip: "When enabled, detected cheaters will be banned automatically",
            },
            {
              id: "ban_duration",
              title: "Ban Duration (hours)",
              subtitle: "Default ban length in hours (0 = permanent)",
              type: "number",
              defaultValue: 0,
              tip: "Set to 0 for permanent bans, or specify hours for temporary bans",
            },
          ],
        },
      ],
    },
    {
      id: "hits_exceptions",
      label: "Hits & Exceptions",
      description: "Manage detection hits and exceptions",
      sections: [
        {
          id: "exceptions",
          title: "Exception Management",
          subtitle: "Configure detection exceptions",
          configurations: [
            {
              id: "admin_immunity",
              title: "Admin Immunity",
              subtitle: "Exclude admins from detection",
              type: "toggle",
              defaultValue: true,
              tip: "Administrators will not trigger cheat detection",
            },
            {
              id: "whitelist_enabled",
              title: "Whitelist Mode",
              subtitle: "Only scan non-whitelisted players",
              type: "toggle",
              defaultValue: false,
              tip: "When enabled, only non-whitelisted players will be scanned",
            },
          ],
        },
      ],
    },
    {
      id: "logging_notifications",
      label: "Logging & Notifications",
      description: "Configure logging and Discord webhooks",
      sections: [
        {
          id: "notifications",
          title: "Discord Notifications",
          subtitle: "Configure Discord webhook notifications",
          configurations: [
            {
              id: "discord_webhook",
              title: "Discord Webhook",
              subtitle: "Configure Discord notifications",
              type: "embed_json",
              defaultValue: "",
              tip: "Enter your Discord webhook URL to receive notifications",
            },
            {
              id: "log_all_detections",
              title: "Log All Detections",
              subtitle: "Log every detection event",
              type: "toggle",
              defaultValue: true,
              tip: "Logs all detection events for review and analysis",
            },
            {
              id: "export_config",
              title: "Export Configuration",
              subtitle: "Download current configuration as JSON",
              type: "export_json",
              defaultValue: "atomicshield_config.json",
              tip: "Download your current configuration for backup or sharing",
            },
          ],
        },
      ],
    },
  ],
};

interface AntiCheatConfigurationPageProps {
  serverId: string;
}

export function AntiCheatConfigurationPage({
  serverId,
}: AntiCheatConfigurationPageProps) {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] =
    useState<string>("general_settings");
  const [values, setValues] = useState<
    Record<string, boolean | number | string>
  >({});
  const [originalValues, setOriginalValues] = useState<
    Record<string, boolean | number | string>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [configData, setConfigData] = useState<ConfigPageType | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  // Merge API data with built-in default data (built-in configs always preserved)
  const mergedConfigData = useMemo(() => {
    if (!configData) return defaultConfigData;

    const merged: ConfigPageType = {
      categories: defaultConfigData.categories.map((builtInCategory) => {
        const apiCategory = configData.categories?.find(
          (cat) => cat.id === builtInCategory.id,
        );

        if (!apiCategory) return builtInCategory;

        return {
          ...builtInCategory,
          sections: builtInCategory.sections.map((builtInSection) => {
            const apiSection = apiCategory.sections?.find(
              (sec) => sec.id === builtInSection.id,
            );

            if (!apiSection) return builtInSection;

            // Merge configurations: built-in configs are always preserved, API configs are added
            const mergedConfigurations = [
              ...builtInSection.configurations,
              ...(apiSection.configurations?.filter(
                (apiConfig) =>
                  !builtInSection.configurations.some(
                    (builtInConfig) => builtInConfig.id === apiConfig.id,
                  ),
              ) || []),
            ];

            return {
              ...builtInSection,
              ...apiSection,
              configurations: mergedConfigurations,
            };
          }),
        };
      }),
    };

    // Add any additional categories from API that aren't in built-in data
    const additionalCategories =
      configData.categories?.filter(
        (apiCat) =>
          !defaultConfigData.categories.some(
            (builtInCat) => builtInCat.id === apiCat.id,
          ),
      ) || [];

    merged.categories.push(...additionalCategories);

    return merged;
  }, [configData]);

  // Initialize default values from merged configuration
  useEffect(() => {
    if (!mergedConfigData) return;

    const defaultValues: Record<string, boolean | number | string> = {};
    mergedConfigData.categories.forEach((category) => {
      category.sections.forEach((section) => {
        section.configurations.forEach((config) => {
          if (config.defaultValue !== undefined) {
            defaultValues[config.id] = config.defaultValue;
          }
        });
      });
    });

    setValues(defaultValues);
    setOriginalValues(defaultValues);
  }, [mergedConfigData]);

  // Load configuration data from API
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setIsLoading(true);
        setApiError(null);

        // Simulate API call - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // For now, use default data
        setConfigData(defaultConfigData);
      } catch (error) {
        console.error("Failed to load configuration:", error);
        setApiError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    loadConfiguration();
  }, [serverId]);

  const handleValueChange = (id: string, value: boolean | number | string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Simulate API save - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setOriginalValues(values);
      toast({
        title: "Configuration Saved",
        description: "Your settings have been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setValues(originalValues);
    toast({
      title: "Changes Discarded",
      description: "All unsaved changes have been discarded.",
    });
  };

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const hasChanges = JSON.stringify(values) !== JSON.stringify(originalValues);
  const activeData = mergedConfigData?.categories.find(
    (cat) => cat.id === activeCategory,
  );

  if (isLoading && !mergedConfigData) {
    return (
      <TooltipProvider>
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded"></div>
                ))}
              </div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          <div className="max-w-none">
            {/* API Error Alert */}
            {apiError && (
              <Alert
                variant="destructive"
                className="mb-4 bg-red-900/20 border-red-500/30"
              >
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>Failed to load configuration: {apiError}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.reload()}
                      className="ml-4 border-slate-600 text-gray-300 hover:bg-slate-700"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-2">
                  Anticheat Configuration
                  {apiError && (
                    <Badge variant="destructive" className="text-xs">
                      Offline Mode
                    </Badge>
                  )}
                </h1>
                <p className="text-gray-400 text-base mt-2">
                  Configure your AtomicShield settings and preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex h-[calc(100vh-140px)]">
          {/* Sidebar */}
          <div className="w-80 bg-slate-800/30 border-r border-slate-700 overflow-y-auto">
            <div className="p-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-200 mb-4">
                  Configuration
                </h2>
                {mergedConfigData?.categories.map((category) => (
                  <SidebarCategory
                    key={category.id}
                    category={category}
                    isActive={activeCategory === category.id}
                    onClick={() => setActiveCategory(category.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-8">
              {activeData && (
                <div className="space-y-6 max-w-4xl">
                  {activeData.sections.map((section) => (
                    <ConfigurationSection
                      key={section.id}
                      section={section}
                      values={values}
                      onValueChange={handleValueChange}
                      isCollapsed={collapsedSections[section.id] || false}
                      onToggle={() => toggleSection(section.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Save Bar */}
            <div
              className={cn(
                "border-t border-slate-700 bg-slate-800/95 backdrop-blur-sm transition-all duration-300 ease-in-out",
                hasChanges
                  ? "opacity-100 transform translate-y-0 p-6"
                  : "opacity-0 transform translate-y-4 p-0 h-0 overflow-hidden",
              )}
            >
              {hasChanges && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        You have unsaved changes
                      </p>
                      <p className="text-xs text-gray-400">
                        Save your configuration to apply changes
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-gray-200"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export function ExampleAntiCheatConfiguration() {
  const { serverId } = useParams<{ serverId: string }>();

  if (!serverId) {
    return <div>Error: Server ID not found</div>;
  }

  return <AntiCheatConfigurationPage serverId={serverId} />;
}
