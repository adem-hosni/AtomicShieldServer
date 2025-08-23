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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
} from "lucide-react";
import {
  ConfigurationPage as ConfigPageType,
  Category,
  Section,
  Configuration,
  ConfigurationType,
} from "../../shared/configuration";

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
  discord: Code, // Using Code as placeholder for discord
  "file-import": Upload,
  "file-export": Download,
  "code-json": FileText,
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
          <div className="flex items-start space-x-3 p-4 rounded-lg border border-primary/20 bg-background/50 hover:bg-primary/5 transition-colors">
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
              className="bg-background/50 border-primary/20 focus:border-primary/40"
            />
            {config.subtitle && (
              <p className="text-xs text-muted-foreground">{config.subtitle}</p>
            )}
            {config.tip && (
              <p className="text-xs text-muted-foreground/80">{config.tip}</p>
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
              className="bg-background/50 border-primary/20 focus:border-primary/40"
            />
            {config.subtitle && (
              <p className="text-xs text-muted-foreground">{config.subtitle}</p>
            )}
            {config.tip && (
              <p className="text-xs text-muted-foreground/80">{config.tip}</p>
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
              <SelectTrigger>
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
            {config.tip && (
              <p className="text-xs text-muted-foreground/80">{config.tip}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return renderField();
}

interface SectionCardProps {
  section: Section;
  configurations: Configuration[];
  values: Record<string, boolean | number | string>;
  onValueChange: (configId: string, value: boolean | number | string) => void;
}

function SectionCard({
  section,
  configurations,
  values,
  onValueChange,
}: SectionCardProps) {
  const IconComponent = section.icon ? iconMap[section.icon] : Settings;

  return (
    <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/30 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <CardTitle className="text-lg">{section.title}</CardTitle>
            {section.subtitle && (
              <p className="text-sm text-muted-foreground">
                {section.subtitle}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {configurations.map((config) => (
          <ConfigurationField
            key={config.id}
            config={config}
            value={values[config.id] ?? config.value}
            onChange={(value) => onValueChange(config.id, value)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

interface DynamicConfigurationPageProps {
  configData: ConfigPageType;
}

export function DynamicConfigurationPage({
  configData,
}: DynamicConfigurationPageProps) {
  const { toast } = useToast();

  // Initialize state with default values from config
  const [values, setValues] = useState<
    Record<string, boolean | number | string>
  >(() => {
    const initialValues: Record<string, boolean | number | string> = {};
    configData.categories.forEach((category) => {
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
    configData.categories.forEach((category) => {
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
      <div className="flex-1 overflow-y-auto relative">
        {/* Animated background */}
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.05)_75%,rgba(59,130,246,0.05)_76%,transparent_77%)] bg-[length:60px_60px] animate-pulse" />
        </div>

        <div
          className={`p-3 lg:p-6 space-y-4 lg:space-y-6 relative ${hasChanges ? "pb-24 lg:pb-20" : ""}`}
        >
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Dynamic Configuration
            </h1>
            <p className="text-muted-foreground text-lg">
              Configure your settings dynamically from the provided schema
            </p>
          </div>

          {/* Configuration Content */}
          {configData.categories.length > 1 ? (
            // Use tabs for multiple categories
            <Tabs
              defaultValue={configData.categories[0]?.id}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 h-auto p-1">
                {configData.categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="text-xs sm:text-sm py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {category.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {configData.categories.map((category) => (
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
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            // Use accordion for single category or simple layout
            <div className="space-y-6">
              {configData.categories.map((category) => (
                <div key={category.id} className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary">
                      {category.title}
                    </h2>
                  </div>
                  <div className="grid gap-6">
                    {category.sections.map((section) => (
                      <SectionCard
                        key={section.id}
                        section={section}
                        configurations={section.configurations}
                        values={values}
                        onValueChange={handleValueChange}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Bar */}
        {hasChanges && (
          <div className="fixed bottom-0 right-0 left-0 z-50">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-t border-amber-500/20 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 lg:px-8 py-4 gap-4">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-amber-500 flex-shrink-0" />
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
                    className="flex-1 sm:flex-none"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-[#2970ff] hover:bg-[#1e5eff] text-white font-semibold shadow-lg flex-1 sm:flex-none"
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

// Example usage component with the provided data
export function ExampleDynamicConfiguration() {
  const exampleConfigData: ConfigPageType = {
    categories: [
      {
        id: "general_settings",
        title: "General Settings",
        sections: [
          {
            id: "server_image_upload",
            title: "Server Image Upload",
            subtitle: "Upload and preview the server logo or banner",
            icon: "image",
            configurations: [
              {
                id: "server_image",
                type: "string",
                title: "Server Image",
                subtitle: "URL or uploaded image for server display",
                tip: "",
                icon: "upload",
                value: "",
              },
            ],
          },
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
                tip: "",
                icon: "camera",
                value: true,
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
                type: "string",
                title: "Import JSON",
                subtitle: "Paste configuration JSON here to import",
                tip: "",
                icon: "file-import",
                value: "",
              },
              {
                id: "export_json",
                type: "string",
                title: "Export JSON",
                subtitle: "Copy this JSON to backup your configuration",
                tip: "",
                icon: "file-export",
                value: "",
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
      {
        id: "logging_notifications",
        title: "Logging & Notifications",
        sections: [
          {
            id: "discord_embed_editor",
            title: "Discord Embed Editor",
            subtitle: "Edit and preview rich Discord embed messages",
            icon: "discord",
            configurations: [
              {
                id: "embed_json",
                type: "string",
                title: "Embed JSON",
                subtitle: "Paste or edit the embed JSON",
                tip: "",
                icon: "code-json",
                value: "",
              },
            ],
          },
        ],
      },
    ],
  };

  return <DynamicConfigurationPage configData={exampleConfigData} />;
}
