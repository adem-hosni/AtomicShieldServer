import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ChevronDown,
  ChevronRight,
  Info,
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
};

interface FormFieldProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  tooltip?: string;
}

function FormField({ label, description, children, tooltip }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">{label}</Label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3 w-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {children}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

interface SwitchFieldProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  tooltip?: string;
}

function SwitchField({
  label,
  description,
  checked,
  onCheckedChange,
  tooltip,
}: SwitchFieldProps) {
  return (
    <div className="flex items-start space-x-3 p-4 rounded-lg border border-primary/20">
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-1"
      />
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">{label}</Label>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface ModuleCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  tooltip?: string;
}

function ModuleCard({
  title,
  description,
  icon,
  children,
  defaultOpen = true,
  tooltip,
}: ModuleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="border-primary/20 hover:border-primary/30 transition-all duration-300">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">{icon}</div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    {tooltip && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
              <div className="flex items-center">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-primary" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-primary" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

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

  switch (config.type) {
    case "boolean":
      return (
        <SwitchField
          label={config.title}
          description={config.subtitle || ""}
          checked={value as boolean}
          onCheckedChange={handleChange}
          tooltip={config.tip}
        />
      );

    case "number":
      return (
        <FormField
          label={config.title}
          description={config.subtitle}
          tooltip={config.tip}
        >
          <Input
            type="number"
            value={value as number}
            onChange={(e) => handleChange(parseInt(e.target.value) || 0)}
            className="border-primary/20 focus:border-primary/40"
          />
        </FormField>
      );

    case "string":
      return (
        <FormField
          label={config.title}
          description={config.subtitle}
          tooltip={config.tip}
        >
          <Input
            type="text"
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
            className="border-primary/20 focus:border-primary/40"
          />
        </FormField>
      );

    case "select":
      return (
        <FormField
          label={config.title}
          description={config.subtitle}
          tooltip={config.tip}
        >
          <Select value={value as string} onValueChange={handleChange}>
            <SelectTrigger className="border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      );

    default:
      return null;
  }
}

interface SpecialFieldProps {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  allValues: Record<string, boolean | number | string>;
  onChange: (value: string) => void;
}

function SpecialField({
  id,
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

interface CleanConfigurationPageProps {
  configData?: ConfigPageType;
}

export function CleanConfigurationPage({
  configData,
}: CleanConfigurationPageProps) {
  const { toast } = useToast();

  // Built-in sections that are always present
  const builtInSections = {
    general_settings: [
      {
        id: "server_image_upload",
        title: "Server Image Upload",
        subtitle: "Upload and preview the server logo or banner",
        icon: "upload",
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
        const userSections = generalCategory.sections.filter(
          (section) =>
            !["server_image_upload", "import_export"].includes(section.id),
        );
        generalSections.splice(-1, 0, ...userSections);
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
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
          <p className="text-muted-foreground">
            Configure your AtomicShield settings and preferences.
          </p>
        </div>

        {/* Configuration Content */}
        <Tabs
          defaultValue={mergedConfigData.categories[0]?.id}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            {mergedConfigData.categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-2"
              >
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
              </TabsTrigger>
            ))}
          </TabsList>

          {mergedConfigData.categories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="space-y-6"
            >
              {category.sections.map((section) => {
                const IconComponent = section.icon
                  ? iconMap[section.icon]
                  : Settings;

                return (
                  <ModuleCard
                    key={section.id}
                    title={section.title}
                    description={section.subtitle || ""}
                    icon={<IconComponent className="h-5 w-5 text-primary" />}
                  >
                    {section.configurations.map((config) => {
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
                            title={config.title}
                            subtitle={config.subtitle || ""}
                            value={
                              (values[config.id] as string) ||
                              (config.value as string)
                            }
                            allValues={values}
                            onChange={(value) =>
                              handleValueChange(config.id, value)
                            }
                          />
                        );
                      }

                      return (
                        <ConfigurationField
                          key={config.id}
                          config={config}
                          value={values[config.id] ?? config.value}
                          onChange={(value) =>
                            handleValueChange(config.id, value)
                          }
                        />
                      );
                    })}
                  </ModuleCard>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>

        {/* Save Bar */}
        {hasChanges && (
          <div className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-lg">
            <div>
              <p className="text-sm font-medium">You have unsaved changes</p>
              <p className="text-xs text-muted-foreground">
                Save your configuration to apply changes
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

// Example usage with sample data
export function ExampleCleanConfiguration() {
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

  return <CleanConfigurationPage configData={sampleConfigData} />;
}
