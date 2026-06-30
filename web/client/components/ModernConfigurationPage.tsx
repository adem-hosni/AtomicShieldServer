import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Search,
  Shield,
  Info,
  Save,
  RotateCcw,
  Camera,
  RefreshCw,
  Scan,
  Clock,
  Image,
  Upload,
  Code,
  FileText,
  Download,
  ChevronDown,
  Sparkles,
  Zap,
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

// Icon mapping for configuration icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  settings: Settings,
  search: Search,
  shield: Shield,
  camera: Camera,
  refresh: RefreshCw,
  scan: Scan,
  clock: Clock,
  image: Image,
  upload: Upload,
  code: Code,
  discord: Code,
  "file-import": Upload,
  "file-export": Download,
  "code-json": FileText,
  sparkles: Sparkles,
  zap: Zap,
};

interface ConfigurationFieldProps {
  config: Configuration;
  value: boolean | number | string;
  onChange: (value: boolean | number | string) => void;
}

function ConfigurationField({
  config,
  value,
  onChange,
}: ConfigurationFieldProps) {
  const handleChange = (newValue: boolean | number | string) => {
    onChange(newValue);
    console.log(`Configuration '${config.id}' changed to:`, newValue);
  };

  const renderField = () => {
    switch (config.type) {
      case "boolean":
        return (
          <div className="flex items-start space-x-3 p-4 rounded-lg border border-primary/20 bg-gradient-to-r from-background/80 to-primary/5 hover:from-background/60 hover:to-primary/10 transition-all duration-300">
            <Switch
              checked={value as boolean}
              onCheckedChange={handleChange}
              className="mt-1"
            />
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">{config.title}</Label>
                {config.tip && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{config.tip}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              {config.subtitle && (
                <p className="text-xs text-muted-foreground">
                  {config.subtitle}
                </p>
              )}
            </div>
          </div>
        );

      case "number":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">{config.title}</Label>
              {config.tip && (
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{config.tip}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Input
              type="number"
              value={value as number}
              onChange={(e) => handleChange(parseInt(e.target.value) || 0)}
              className="bg-gradient-to-r from-background/80 to-primary/5 border-primary/20 focus:border-primary/40 transition-all duration-300"
            />
            {config.subtitle && (
              <p className="text-xs text-muted-foreground">{config.subtitle}</p>
            )}
          </div>
        );

      case "string":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">{config.title}</Label>
              {config.tip && (
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{config.tip}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Input
              type="text"
              value={value as string}
              onChange={(e) => handleChange(e.target.value)}
              className="bg-gradient-to-r from-background/80 to-primary/5 border-primary/20 focus:border-primary/40 transition-all duration-300"
            />
            {config.subtitle && (
              <p className="text-xs text-muted-foreground">{config.subtitle}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">{config.title}</Label>
              {config.tip && (
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{config.tip}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Select value={value as string} onValueChange={handleChange}>
              <SelectTrigger className="bg-gradient-to-r from-background/80 to-primary/5 border-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
            {config.subtitle && (
              <p className="text-xs text-muted-foreground">{config.subtitle}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return renderField();
}

interface SpecialFieldProps {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  value: string;
  allValues: Record<string, boolean | number | string>;
  onChange: (value: string) => void;
}

function SpecialField({
  id,
  type,
  title,
  subtitle,
  value,
  allValues,
  onChange,
}: SpecialFieldProps) {
  switch (id) {
    case "server_image":
      return (
        <FileUploadField
          id={id}
          title={title}
          subtitle={subtitle}
          accept="image/*"
          maxSize={5}
          preview={true}
          value={value}
          onChange={onChange}
        />
      );

    case "import_json":
      return (
        <FileUploadField
          id={id}
          title="Import Configuration File"
          subtitle="Upload a JSON file to import configuration"
          accept=".json,application/json"
          maxSize={1}
          value={value}
          onChange={(fileContent) => {
            onChange(fileContent);
            // Here you would typically parse and apply the imported configuration
            console.log("Configuration import initiated:", fileContent);
          }}
        />
      );

    case "export_json":
      return (
        <FileDownloadField
          id={id}
          title="Export Configuration File"
          subtitle="Download current configuration as JSON file"
          data={allValues}
          filename="atomicshield-config.json"
        />
      );

    case "embed_json":
      return (
        <DiscordEmbedEditor
          value={value}
          onChange={onChange}
          title={title}
          subtitle={subtitle}
        />
      );

    default:
      return null;
  }
}

interface SectionCardProps {
  section: Section;
  configurations: Configuration[];
  values: Record<string, boolean | number | string>;
  onValueChange: (configId: string, value: boolean | number | string) => void;
  isBuiltIn?: boolean;
}

function SectionCard({
  section,
  configurations,
  values,
  onValueChange,
  isBuiltIn = false,
}: SectionCardProps) {
  const IconComponent = section.icon ? iconMap[section.icon] : Settings;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="group bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors duration-200 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                  <IconComponent className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    {isBuiltIn && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        Built-in
                      </Badge>
                    )}
                  </div>
                  {section.subtitle && (
                    <p className="text-sm text-muted-foreground">
                      {section.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {configurations.map((config) => {
              const specialFieldIds = [
                "server_image",
                "import_json",
                "export_json",
                "embed_json",
              ];

              if (specialFieldIds.includes(config.id)) {
                return (
                  <SpecialField
                    key={config.id}
                    id={config.id}
                    type={config.type}
                    title={config.title}
                    subtitle={config.subtitle || ""}
                    value={
                      (values[config.id] as string) || (config.value as string)
                    }
                    allValues={values}
                    onChange={(value) => onValueChange(config.id, value)}
                  />
                );
              }

              return (
                <ConfigurationField
                  key={config.id}
                  config={config}
                  value={values[config.id] ?? config.value}
                  onChange={(value) => onValueChange(config.id, value)}
                />
              );
            })}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

interface ModernConfigurationPageProps {
  configData?: ConfigPageType;
}

export function ModernConfigurationPage({
  configData,
}: ModernConfigurationPageProps) {
  const { toast } = useToast();

  // Built-in sections that are always present
  const builtInSections = {
    general_settings: [
      {
        id: "server_image_upload",
        title: "Server Image Upload",
        subtitle: "Upload and preview the server logo or banner",
        icon: "image",
        configurations: [
          {
            id: "server_image",
            type: "string" as ConfigurationType,
            title: "Server Image",
            subtitle: "Upload and preview the server logo or banner",
            tip: "",
            icon: "upload",
            value: "",
          },
        ],
      },
      {
        id: "import_export",
        title: "Import / Export Configuration",
        subtitle: "Backup or restore configuration as JSON",
        icon: "code",
        configurations: [
          {
            id: "import_json",
            type: "string" as ConfigurationType,
            title: "Import Configuration File",
            subtitle: "Upload a JSON file to import configuration",
            tip: "",
            icon: "file-import",
            value: "",
          },
          {
            id: "export_json",
            type: "string" as ConfigurationType,
            title: "Export Configuration File",
            subtitle: "Download current configuration as JSON file",
            tip: "",
            icon: "file-export",
            value: "",
          },
        ],
      },
    ],
    logging_notifications: [
      {
        id: "discord_embed_editor",
        title: "Discord Embed Editor",
        subtitle: "Edit and preview rich Discord embed messages",
        icon: "discord",
        configurations: [
          {
            id: "embed_json",
            type: "string" as ConfigurationType,
            title: "Discord Embed Editor",
            subtitle: "Edit and preview rich Discord embed messages",
            tip: "",
            icon: "code-json",
            value: "",
          },
        ],
      },
    ],
  };

  // Merge provided config data with built-in sections
  const mergedConfigData: ConfigPageType = React.useMemo(() => {
    const categories: Category[] = [];

    // General Settings category
    const generalSections = [...builtInSections.general_settings];
    if (configData) {
      const generalCategory = configData.categories.find(
        (cat) => cat.id === "general_settings",
      );
      if (generalCategory) {
        // Add user-defined sections (except built-ins) before the import/export section
        const userSections = generalCategory.sections.filter(
          (section) =>
            !["server_image_upload", "import_export"].includes(section.id),
        );
        generalSections.splice(-1, 0, ...userSections); // Insert before import/export
      }
    }

    categories.push({
      id: "general_settings",
      title: "General Settings",
      sections: generalSections,
    });

    // Detection Settings category (only if present in original data)
    if (configData) {
      const detectionCategory = configData.categories.find(
        (cat) => cat.id === "detection_settings",
      );
      if (detectionCategory) {
        categories.push(detectionCategory);
      }
    }

    // Logging & Notifications category
    const loggingSections = [...builtInSections.logging_notifications];
    if (configData) {
      const loggingCategory = configData.categories.find(
        (cat) => cat.id === "logging_notifications",
      );
      if (loggingCategory) {
        const userSections = loggingCategory.sections.filter(
          (section) => !["discord_embed_editor"].includes(section.id),
        );
        loggingSections.push(...userSections);
      }
    }

    categories.push({
      id: "logging_notifications",
      title: "Logging & Notifications",
      sections: loggingSections,
    });

    return { categories };
  }, [configData]);

  // Initialize state with default values from merged config
  const [values, setValues] = useState<
    Record<string, boolean | number | string>
  >(() => {
    const initialValues: Record<string, boolean | number | string> = {};
    mergedConfigData.categories.forEach((category) => {
      category.sections.forEach((section) => {
        section.configurations.forEach((config) => {
          initialValues[config.id] = config.value;
        });
      });
    });
    return initialValues;
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleValueChange = (
    configId: string,
    value: boolean | number | string,
  ) => {
    setValues((prev) => ({ ...prev, [configId]: value }));
    setHasChanges(true);
    console.log(`Configuration changed: ${configId} = ${value}`);
  };

  const handleSave = () => {
    console.log("Saving configuration:", values);
    setHasChanges(false);
    toast({
      title: "Configuration Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const handleReset = () => {
    const resetValues: Record<string, boolean | number | string> = {};
    mergedConfigData.categories.forEach((category) => {
      category.sections.forEach((section) => {
        section.configurations.forEach((config) => {
          resetValues[config.id] = config.value;
        });
      });
    });
    setValues(resetValues);
    setHasChanges(false);
    toast({
      title: "Configuration Reset",
      description: "All settings have been reset to their default values.",
    });
  };

  return (
    <TooltipProvider>
      <div className="flex-1 overflow-y-auto relative min-h-screen">
        {/* Animated background */}
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.05)_75%,rgba(59,130,246,0.05)_76%,transparent_77%)] bg-[length:60px_60px] animate-pulse" />
        </div>

        <div
          className={`p-3 lg:p-6 space-y-4 lg:space-y-6 relative ${hasChanges ? "pb-24 lg:pb-20" : ""}`}
        >
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Configuration Center
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Customize your AtomicShield settings with an intuitive interface.
              Upload images, configure detection parameters, and set up Discord
              integrations.
            </p>
          </div>

          {/* Configuration Content */}
          <Tabs
            defaultValue={mergedConfigData.categories[0]?.id}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 h-auto p-1 bg-gradient-to-r from-background/80 to-primary/10">
              {mergedConfigData.categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs sm:text-sm py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:bg-primary/10"
                >
                  <div className="flex items-center gap-2">
                    {category.id === "general_settings" && (
                      <Settings className="h-4 w-4" />
                    )}
                    {category.id === "detection_settings" && (
                      <Shield className="h-4 w-4" />
                    )}
                    {category.id === "logging_notifications" && (
                      <Zap className="h-4 w-4" />
                    )}
                    {category.title}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {mergedConfigData.categories.map((category) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="space-y-6"
              >
                <div className="grid gap-6">
                  {category.sections.map((section) => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      configurations={section.configurations}
                      values={values}
                      onValueChange={handleValueChange}
                      isBuiltIn={[
                        "server_image_upload",
                        "import_export",
                        "discord_embed_editor",
                      ].includes(section.id)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Save Bar */}
        {hasChanges && (
          <div className="fixed bottom-0 right-0 left-0 z-50">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-t border-amber-500/20 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 lg:px-8 py-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-500/20">
                    <Info className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      You have unsaved changes
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Save your configuration to apply changes
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1 sm:flex-none hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex-1 sm:flex-none"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

// Example usage with sample data
export function ExampleModernConfiguration() {
  const sampleConfigData: ConfigPageType = {
    categories: [
      {
        id: "general_settings",
        title: "General Settings",
        sections: [
          {
            id: "system_behavior",
            title: "System Behavior",
            subtitle: "Configure how AtomicShield operates",
            icon: "settings",
            configurations: [
              {
                id: "screenshot_on_ban",
                type: "boolean",
                title: "Enable Screenshot on Ban",
                subtitle:
                  "Take a screenshot when a player is banned for evidence",
                tip: "Helps with appeals and verification",
                icon: "camera",
                value: true,
              },
            ],
          },
        ],
      },
      {
        id: "detection_settings",
        title: "Detection Settings",
        sections: [
          {
            id: "memory_scanner",
            title: "Memory Scanner",
            subtitle: "Adjust behavior of memory-based cheat detection",
            icon: "scan",
            configurations: [
              {
                id: "scan_interval",
                type: "number",
                title: "Scan Interval",
                subtitle: "How frequently the memory scanner runs (ms)",
                tip: "Lower values may impact performance",
                icon: "clock",
                value: 1000,
              },
            ],
          },
        ],
      },
    ],
  };

  return <ModernConfigurationPage configData={sampleConfigData} />;
}
