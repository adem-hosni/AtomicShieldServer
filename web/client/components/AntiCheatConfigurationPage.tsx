import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Category, AntiCheatConfigurations, Section } from "@shared/api";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import * as LucideIcons from "lucide-react";
import { useParams } from "react-router-dom";
import { usePageTitle } from "@/hooks/use-page-title";
import api from "@/lib/api-client";
import { useConfigurationManager } from "@/lib/configuration-manager";

// Enhanced loading screen component
function ConfigurationLoadingScreen() {
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingMessages] = useState([
    "Connecting to AtomicShield...",
    "Loading security configurations...",
    "Initializing protection modules...",
    "Applying server settings...",
    "Finalizing configuration...",
  ]);

  const progressStages = [15, 35, 60, 85, 100];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStage((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  return (
    <div className="space-y-8 py-8">
      {/* Enhanced loading header */}
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 blur-3xl animate-pulse" />
          <LucideIcons.Shield className="relative h-16 w-16 mx-auto text-primary animate-pulse" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            AtomicShield Configuration Center
          </h3>
          <p className="text-sm font-medium text-primary animate-pulse">
            {loadingMessages[loadingStage]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="max-w-md mx-auto space-y-2">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${progressStages[loadingStage]}%` }}
            >
              <div
                className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "progress-shimmer 2s infinite",
                }}
              />
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            {progressStages[loadingStage]}% Complete
          </div>
        </div>
      </div>

      {/* Enhanced skeleton cards with stage indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* Sidebar skeleton */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="space-y-3">
            <div className="h-6 bg-muted rounded animate-pulse" />
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className={`p-4 bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 transition-all duration-700 transform ${
                  loadingStage >= i
                    ? "opacity-100 scale-100"
                    : loadingStage === i - 1
                      ? "opacity-75 scale-95"
                      : "opacity-50 scale-90"
                }`}
                style={{
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted/70 rounded w-3/4 animate-pulse" />
                  </div>
                  {loadingStage > i && (
                    <LucideIcons.CheckCircle className="h-4 w-4 text-green-500 animate-pulse" />
                  )}
                </div>
                {loadingStage === i && (
                  <div className="mt-3 flex items-center space-x-2">
                    <div className="text-xs font-medium text-primary">
                      Loading configuration...
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, dot) => (
                        <div
                          key={dot}
                          className="w-1 h-1 rounded-full bg-primary/60 animate-pulse"
                          style={{
                            animationDelay: `${dot * 200}ms`,
                            animationDuration: "1s",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Tabs skeleton */}
          <div className="space-y-4">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded-md transition-all duration-500 ${
                    loadingStage > 2 ? "bg-primary/20" : "bg-muted"
                  } animate-pulse`}
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Configuration cards skeleton */}
          <div className="space-y-6">
            {[...Array(3)].map((_, cardIndex) => (
              <Card
                key={cardIndex}
                className={`transition-all duration-700 ${
                  loadingStage >= cardIndex + 2
                    ? "opacity-100 scale-100"
                    : "opacity-50 scale-95"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-primary/20 rounded animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-5 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted/70 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(4)].map((_, fieldIndex) => (
                    <div key={fieldIndex} className="space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                      <div className="h-10 bg-muted/50 rounded animate-pulse" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Loading footer */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <LucideIcons.Zap className="h-4 w-4 text-primary animate-pulse" />
          <span>Securing your gaming environment...</span>
        </div>
      </div>
    </div>
  );
}

interface ConfigSidebarItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  isActive?: boolean;
  onClick: () => void;
}

function ConfigSidebarItem({
  icon,
  label,
  description,
  isActive,
  onClick,
}: ConfigSidebarItemProps) {
  const IconComponent = LucideIcons[icon as keyof typeof LucideIcons];
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3",
        "hover:bg-cyan-500/10 hover:border-cyan-500/20 border border-transparent",
        isActive
          ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
          : "text-gray-300 hover:text-cyan-300",
      )}
    >
      {IconComponent && <IconComponent className="w-5 h-5" />}
      <div className="flex-1">
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-gray-400">{description}</div>
      </div>
    </button>
  );
}

// function ConfigSidebarItem({
//   icon,
//   label,
//   isActive,
//   onClick,
// }: ConfigSidebarItemProps) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all w-full text-left ${
//         isActive
//           ? "bg-accent text-accent-foreground"
//           : "hover:bg-accent hover:text-accent-foreground"
//       }`}
//     >
//       {icon}
//       <span>{label}</span>
//     </button>
//   );
// }

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
    <Card className="shadow-sm border-border/50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {icon}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    {tooltip && (
                      <Tooltip>
                        <TooltipTrigger>
                          <LucideIcons.Info className="h-4 w-4 text-muted-foreground" />
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
                  <LucideIcons.ChevronDown className="h-4 w-4" />
                ) : (
                  <LucideIcons.ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

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
              <LucideIcons.Info className="h-3 w-3 text-muted-foreground" />
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

interface ProfessionalWebhookInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  eventType: string;
  color: string;
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
    <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card/30">
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
                <LucideIcons.Info className="h-3 w-3 text-muted-foreground" />
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

const configCategories = [
  {
    id: "general",
    label: "General Settings",
    icon: <LucideIcons.Settings className="h-4 w-4" />,
  },
  {
    id: "detection",
    label: "Detection Settings",
    icon: <LucideIcons.Search className="h-4 w-4" />,
  },
  {
    id: "punishment",
    label: "Punishment Settings",
    icon: <LucideIcons.Shield className="h-4 w-4" />,
  },
  {
    id: "whitelist",
    label: "Whitelists & Exceptions",
    icon: <LucideIcons.Users className="h-4 w-4" />,
  },
  {
    id: "logging",
    label: "Logging & Notifications",
    icon: <LucideIcons.FileText className="h-4 w-4" />,
  },
];

// Modern Color Picker Component
interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

function ColorPicker({ value, onChange }: ColorPickerProps) {
  const presetColors = [
    "#ff0000",
    "#ff8800",
    "#ffff00",
    "#88ff00",
    "#00ff00",
    "#00ff88",
    "#00ffff",
    "#0088ff",
    "#0000ff",
    "#8800ff",
    "#ff00ff",
    "#ff0088",
    "#000000",
    "#444444",
    "#888888",
    "#cccccc",
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
          style={{ backgroundColor: value }}
        />
        <div className="flex-1 space-y-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="font-mono text-sm"
            placeholder="#ff0000"
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-8 rounded border border-border cursor-pointer"
          />
        </div>
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
        {presetColors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

export function AntiCheatConfigurationPage() {
  const { serverId } = useParams<{ serverId: string }>();
  usePageTitle("Configuration");
  const [activeCategory, setActiveCategory] = useState("27");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [serverImage, setServerImage] = useState<File | null>(null);
  const [serverImagePreview, setServerImagePreview] = useState<string | null>(
    null,
  );
  const removeServerImage = () => {
    setServerImage(null);
    setServerImagePreview("");
    setHasChanges(true);
  };
  // const [configData, setConfigData] = useState<AntiCheatConfigurations>();
  const {
    configData,
    updateConfig,
    updateStaticConfig,
    updateDynamicConfig,
    updateConfigurationValue,
    getChangedValues,
    resetChanges,
  } = useConfigurationManager({
    static: {
      serverName: "",
      serverIp: "",
      imageUrl: "",
      webhookUrls: {
        ban: "",
        kick: "",
        unban: "",
        warning: "",
        screenshot: "",
      },
      embedSettings: {
        // Ensure embedSettings has all required fields
        title: "AtomicShield Alert",
        description:
          "Player {player_name} has been banned by {admin} for: {reason}",
        color: "#ff0000",
        thumbnail: "",
        footer: {
          text: "AtomicShield Security System",
          icon: "https://i.imgur.com/AtomicShield.png",
        },
        fields: [
          { name: "Date", value: "{date}", inline: true },
          { name: "Server", value: "{server_name}", inline: true },
        ],
        templates: {
          ban: "Ban Template",
          kick: "Kick Template",
          warning: "Warning Template",
        },
      },
    },
    dynamic: {
      categories: [],
    },
  });

  const testWebhook = async (eventType: string = selectedEventType) => {
    try {
      const webhookUrl =
        configData.static.webhookUrls?.[
          eventType as keyof typeof configData.static.webhookUrls
        ];

      if (!webhookUrl) {
        toast({
          title: "No Webhook URL",
          description: `Please configure a webhook URL for ${eventType} events first.`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Testing Webhook...",
        description: `Sending test ${eventType} embed to Discord`,
      });

      // Get the current embed template for this event type
      const currentTemplate =
        embedTemplates[eventType as keyof typeof embedTemplates];

      // Call the real API
      const response = await api.config.testWebhook(
        webhookUrl,
        eventType,
        currentTemplate,
      );

      if (response.success) {
        toast({
          title: "Webhook Test Successful",
          description:
            response.message ||
            `Test ${eventType} embed sent successfully to Discord!`,
        });
      } else {
        toast({
          title: "Webhook Test Failed",
          description:
            response.message ||
            "Failed to send test embed. Check your webhook URL.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Webhook test error:", error);
      toast({
        title: "Webhook Test Failed",
        description:
          "Failed to send test embed. Check your webhook URL and network connection.",
        variant: "destructive",
      });
    }
  };

  function ProfessionalWebhookInput({
    value,
    onChange,
    placeholder = "https://discord.com/api/webhooks/...",
    eventType,
    color,
  }: ProfessionalWebhookInputProps) {
    const [isValid, setIsValid] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    const validateWebhookUrl = (url: string) => {
      if (!url) return true; // Empty is valid (optional)
      const webhookRegex =
        /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
      return webhookRegex.test(url);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      setIsValid(validateWebhookUrl(newValue));
    };

    const handleCopyUrl = async () => {
      if (value) {
        try {
          await navigator.clipboard.writeText(value);
          toast({
            title: "Copied to clipboard",
            description: `${eventType} webhook URL copied successfully`,
          });
        } catch (err) {
          toast({
            title: "Copy failed",
            description: "Failed to copy webhook URL",
            variant: "destructive",
          });
        }
      }
    };

    const getStatusColor = () => {
      if (!value) return "text-gray-400";
      if (!isValid) return "text-red-400";
      return `text-${color}-400`;
    };

    const getStatusIcon = () => {
      if (!value) return <LucideIcons.Globe className="h-4 w-4" />;
      if (!isValid) return <LucideIcons.AlertCircle className="h-4 w-4" />;
      return <LucideIcons.CheckCircle className="h-4 w-4" />;
    };

    return (
      <div className="relative group">
        <div
          className={`
        relative flex items-center rounded-lg border transition-all duration-200
        ${
          isFocused
            ? `border-${color}-400 ring-2 ring-${color}-400/20 shadow-lg shadow-${color}-500/10`
            : `border-border hover:border-${color}-400/50`
        }
        ${!isValid && value ? "border-red-400 ring-2 ring-red-400/20" : ""}
        bg-gradient-to-r from-background to-muted/20
      `}
        >
          {/* Status Icon */}
          <div
            className={`
          flex items-center justify-center w-10 h-10 rounded-l-lg border-r
          ${isFocused ? `bg-${color}-500/10 border-${color}-400/30` : "bg-muted/30 border-border"}
          ${getStatusColor()}
        `}
          >
            {getStatusIcon()}
          </div>

          {/* Input Field */}
          <Input
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`
            flex-1 border-0 bg-transparent font-mono text-xs px-3 py-2
            focus-visible:ring-0 focus-visible:ring-offset-0
            placeholder:text-muted-foreground/60
          `}
          />

          {/* Action Buttons */}
          <div className="flex items-center pr-2 gap-1">
            {value && (
              <>
                {/* Copy Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="h-6 w-6 p-0 hover:bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <LucideIcons.Copy className="h-3 w-3" />
                </Button>

                {/* Clear Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange("")}
                  className="h-6 w-6 p-0 hover:bg-red-500/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <LucideIcons.X className="h-3 w-3" />
                </Button>
              </>
            )}

            {/* Test Button */}
            {value && isValid && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => testWebhook(eventType)}
                className={`
                h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity
                hover:bg-${color}-500/10 hover:text-${color}-400
              `}
              >
                Test
              </Button>
            )}
          </div>
        </div>

        {/* Validation Message */}
        {!isValid && value && (
          <div className="flex items-center gap-1 mt-1 text-xs text-red-400">
            <LucideIcons.AlertTriangle className="h-3 w-3" />
            <span>Invalid Discord webhook URL format</span>
          </div>
        )}

        {/* URL Preview */}
        {value && isValid && (
          <div className="mt-1 text-xs text-muted-foreground truncate">
            <span className="font-mono bg-muted/30 px-1 rounded">
              {value.length > 60 ? `${value.substring(0, 60)}...` : value}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Function to apply template based on event type
  // Save current embed settings back to embedTemplates for the current event type
  const saveCurrentTemplateChanges = () => {
    const currentSettings = configData.static.embedSettings;
    console.log(selectedEventType);
    setEmbedTemplates((prev) => ({
      ...prev,
      [selectedEventType]: {
        title: currentSettings.title || "",
        description: currentSettings.description || "",
        color: currentSettings.color || "#dc2626",
        thumbnail: currentSettings.thumbnail || "",
        footer: currentSettings.footer || {
          text: "AtomicShield Security System",
          icon: "https://i.imgur.com/AtomicShield.png",
        },
        fields: currentSettings.fields || [],
      },
    }));
    console.log(embedTemplates);
  };

  const applyTemplate = (eventType: string) => {
    // First save current changes before switching
    saveCurrentTemplateChanges();

    const template = embedTemplates[eventType as keyof typeof embedTemplates];
    if (template) {
      updateStaticConfig((prev) => ({
        ...prev,
        embedSettings: {
          ...prev.embedSettings,
          title: template.title,
          description: template.description,
          color: template.color,
          thumbnail: template.thumbnail,
          footer: template.footer,
          fields: template.fields,
        },
      }));
      setHasChanges(true);
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `Variable ${text} copied successfully`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // Function to insert variable into description textarea
  const insertVariable = (variable: string) => {
    const textarea = descriptionTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = configData.static.embedSettings.description;

    // Insert the variable at the cursor position
    const newValue =
      currentValue.substring(0, start) + variable + currentValue.substring(end);

    // Update the configuration
    updateStaticConfig((prev) => ({
      ...prev,
      embedSettings: {
        ...prev.embedSettings,
        description: newValue,
      },
    }));
    setHasChanges(true);

    // Set cursor position after the inserted variable
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + variable.length,
        start + variable.length,
      );
    }, 0);

    toast({
      title: "Variable inserted",
      description: `${variable} added to description`,
    });
  };

  const [webhookUrls, setWebhookUrls] = useState({
    ban: "https://discord.com/api/webhooks/1234567890/abcdef...",
    kick: "https://discord.com/api/webhooks/1234567890/abcdef...",
    unban: "https://discord.com/api/webhooks/1234567890/abcdef...",
    warning: "https://discord.com/api/webhooks/1234567890/abcdef...",
    screenshot: "https://discord.com/api/webhooks/1234567890/abcdef...",
  });
  const [screenshotOnBan, setScreenshotOnBan] = useState(true);

  // Discord Embed Editor states
  const [embedEnabled, setEmbedEnabled] = useState(true);
  const [embedTitle, setEmbedTitle] = useState("AtomicShield Alert");
  const [embedDescription, setEmbedDescription] = useState(
    "Player {player_name} has been banned by {admin} for: {reason}",
  );
  const [embedColor, setEmbedColor] = useState("#ff0000");
  const [embedThumbnail, setEmbedThumbnail] = useState("");
  const [embedFooterText, setEmbedFooterText] = useState(
    "AtomicShield Security System",
  );
  const [embedFooterIcon, setEmbedFooterIcon] = useState(
    "https://i.imgur.com/AtomicShield.png",
  );
  const [embedFields, setEmbedFields] = useState([
    { name: "Date", value: "{date}", inline: true },
    { name: "Server", value: "{server_name}", inline: true },
  ]);
  const [selectedEventType, setSelectedEventType] = useState("ban");
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [embedTemplates, setEmbedTemplates] = useState({
    ban: {
      title: "🚫 Player Banned",
      description:
        "Player **{player_name}** has been banned by {admin}\n\n**Reason:** {reason}\n**Duration:** {duration}",
      color: "#dc2626", // Red
      thumbnail: "",
      footer: {
        text: "AtomicShield Security System",
        icon: "https://i.imgur.com/AtomicShield.png",
      },
      fields: [
        { name: "��� Player", value: "{player_name}", inline: true },
        { name: "👮 Admin", value: "{admin}", inline: true },
        { name: "📅 Date", value: "{date}", inline: true },
        { name: "🌐 Server", value: "{server_name}", inline: true },
        { name: "⏰ Duration", value: "{duration}", inline: true },
        { name: "🆔 Player ID", value: "{player_id}", inline: true },
      ],
    },
    kick: {
      title: "⚠️ Player Kicked",
      description:
        "Player **{player_name}** has been kicked by {admin}\n\n**Reason:** {reason}",
      color: "#f59e0b", // Orange
      thumbnail: "",
      footer: {
        text: "AtomicShield Security System",
        icon: "https://i.imgur.com/AtomicShield.png",
      },
      fields: [
        { name: "🎮 Player", value: "{player_name}", inline: true },
        { name: "👮 Admin", value: "{admin}", inline: true },
        { name: "📅 Date", value: "{date}", inline: true },
        { name: "🌐 Server", value: "{server_name}", inline: true },
        { name: "🆔 Player ID", value: "{player_id}", inline: true },
      ],
    },
    unban: {
      title: "✅ Player Unbanned",
      description: "Player **{player_name}** has been unbanned by {admin}",
      color: "#16a34a", // Green
      thumbnail: "",
      footer: {
        text: "AtomicShield Security System",
        icon: "https://i.imgur.com/AtomicShield.png",
      },
      fields: [
        { name: "🎮 Player", value: "{player_name}", inline: true },
        { name: "👮 Admin", value: "{admin}", inline: true },
        { name: "���� Date", value: "{date}", inline: true },
        { name: "🌐 Server", value: "{server_name}", inline: true },
        { name: "🆔 Player ID", value: "{player_id}", inline: true },
      ],
    },
    warning: {
      title: "⚠️ Warning Issued",
      description:
        "Player **{player_name}** has been warned by {admin}\n\n**Reason:** {reason}",
      color: "#eab308", // Yellow
      thumbnail: "",
      footer: {
        text: "AtomicShield Security System",
        icon: "https://i.imgur.com/AtomicShield.png",
      },
      fields: [
        { name: "🎮 Player", value: "{player_name}", inline: true },
        { name: "👮 Admin", value: "{admin}", inline: true },
        { name: "📅 Date", value: "{date}", inline: true },
        { name: "🌐 Server", value: "{server_name}", inline: true },
        { name: "🆔 Player ID", value: "{player_id}", inline: true },
      ],
    },
    screenshot: {
      title: "📸 Screenshot Taken",
      description: "Screenshot taken of player **{player_name}** by {admin}",
      color: "#3b82f6", // Blue
      thumbnail: "{screenshot_url}",
      footer: {
        text: "AtomicShield Security System",
        icon: "https://i.imgur.com/AtomicShield.png",
      },
      fields: [
        { name: "🎮 Player", value: "{player_name}", inline: true },
        { name: "👮 Admin", value: "{admin}", inline: true },
        { name: "��� Date", value: "{date}", inline: true },
        { name: "🌐 Server", value: "{server_name}", inline: true },
        { name: "🆔 Player ID", value: "{player_id}", inline: true },
      ],
    },
  });

  const fetchConfigurations = async () => {
    if (!serverId) {
      setError("Server ID is required");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log("🔍 Fetching configurations for server:", serverId);
      const response = await api.config.getServerConfiguration(serverId);

      if (response.success && response.data) {
        const loadedConfigs = response.data?.configs || {};
        const loadedStatic = loadedConfigs?.static || {};
        const loadedDynamic = loadedConfigs?.dynamic || {};

        updateConfig((prev) => ({
          static: {
            ...prev.static,
            ...(loadedStatic.serverName && {
              serverName: loadedStatic.serverName,
            }),
            ...(loadedStatic.serverIp && {
              serverIp: loadedStatic.serverIp,
            }),
            ...(loadedStatic.imageUrl && { imageUrl: loadedStatic.imageUrl }),
            ...(loadedStatic.webhookUrls && {
              webhookUrls: loadedStatic.webhookUrls,
            }),
            ...(loadedStatic.embedTemplates && {
              embedTemplates: loadedStatic.embedTemplates,
            }),
          },
          dynamic: {
            ...prev.dynamic,
            ...loadedDynamic,
          },
        }));
        if (loadedConfigs) {
          console.log("setting image url");
          setServerImagePreview(loadedConfigs.static.imageUrl);
        }
      } else {
        // Handle API response failure - show the response message
        const errorMessage =
          response.message ||
          response.error ||
          "Failed to load server configuration";
        setError(errorMessage);

        updateConfig(() => ({
          static: {
            serverName: "",
            serverIp: "",
            imageUrl: "",
            embedSettings: {},
            webhookUrls: {
              ban: "",
              kick: "",
              unban: "",
              warning: "",
              screenshot: "",
            },
          },
          dynamic: { categories: [] },
        }));
      }
    } catch (err) {
      console.error("Error fetching configurations:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load server configuration";
      setError(errorMessage);

      updateConfig(() => ({
        static: {
          serverName: "",
          serverIp: "",
          imageUrl: "",
          embedSettings: {},
          webhookUrls: {
            ban: "",
            kick: "",
            unban: "",
            warning: "",
            screenshot: "",
          },
        },
        dynamic: { categories: [] },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, [serverId]);

  // Load embedTemplates from server data if available
  useEffect(() => {
    if (configData?.static?.embedTemplates) {
      setEmbedTemplates((prev) => ({
        ...prev,
        ...configData.static.embedTemplates,
      }));
    }
  }, [configData]);

  const handleServerImageUpload = async (file: File) => {
    if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPG, or JPEG image",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert image to Base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      setHasChanges(true);
      setServerImage(file);
      setServerImagePreview(base64Image);

      // Update config with Base64 image
      updateStaticConfig((prev) => ({
        ...prev,
        imageUrl: base64Image,
      }));
    } catch (error) {
      console.error("Image conversion error:", error);
      toast({
        title: "Image Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Save current template changes before saving
      saveCurrentTemplateChanges();

      // Get only changed values
      const { static: staticChanges, dynamic: dynamicChanges } =
        getChangedValues();
      const payload: any = {};

      if (staticChanges) {
        payload.static = staticChanges;
      }

      if (dynamicChanges) {
        payload.dynamic = dynamicChanges;
      }

      // Always include embedTemplates in the save payload
      payload.static = {
        ...(payload.static || {}),
        embedTemplates: embedTemplates,
      };

      if (serverImage) {
        const base64Image = await convertFileToBase64(serverImage);
        payload.static = {
          ...(payload.static || {}),
          serverImage: base64Image,
        };
      }

      if (!payload.static && !payload.dynamic) {
        toast({
          title: "No Changes",
          description: "No configuration changes detected",
        });
        return;
      }

      // Send only changed values to server
      const response = await api.config.updateServerConfiguration(
        serverId,
        payload,
      );

      if (response.success) {
        setHasChanges(false);
        resetChanges();
        setServerImage(null); // Clear uploaded file after save
        toast({
          title: "Configuration Saved",
          description: "Your settings have been saved successfully.",
        });
        await fetchConfigurations();
      } else {
        throw new Error(response.error || "Failed to save configuration");
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast({
        title: "Save Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setHasChanges(false);
    resetChanges();
    toast({
      title: "Changes Discarded",
      description: "All unsaved changes have been reverted.",
      variant: "destructive",
    });
    useEffect(() => {
      fetchConfigurations();
    }, [serverId]);
  };

  const handleInputChange = (
    value: string,
    setter: (value: string) => void,
  ) => {
    setter(value);
    setHasChanges(true);
  };

  const handleSwitchChange = (
    value: boolean,
    setter: (value: boolean) => void,
  ) => {
    setter(value);
    setHasChanges(true);
  };

  const addEmbedField = () => {
    setEmbedFields([...embedFields, { name: "", value: "", inline: false }]);
    setHasChanges(true);
  };

  const removeEmbedField = (index: number) => {
    setEmbedFields(embedFields.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const updateEmbedField = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    const updatedFields = [...embedFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setEmbedFields(updatedFields);
    setHasChanges(true);
  };

  const resetEmbedToDefault = () => {
    setEmbedTitle("AtomicShield Alert");
    setEmbedDescription(
      "Player {player_name} has been banned by {admin} for: {reason}",
    );
    setEmbedColor("#ff0000");
    setEmbedThumbnail("");
    setEmbedFooterText("AtomicShield Security System");
    setEmbedFooterIcon("https://i.imgur.com/AtomicShield.png");
    setEmbedFields([
      { name: "Date", value: "{date}", inline: true },
      { name: "Server", value: "{server_name}", inline: true },
    ]);
    setHasChanges(true);
    toast({
      title: "Embed Reset",
      description: "Embed settings have been reset to default values.",
    });
  };

  const exportConfig = () => {
    const config = {
      configData,
      webhookUrls,
      screenshotOnBan,
      embed: {
        enabled: embedEnabled,
        title: embedTitle,
        description: embedDescription,
        color: embedColor,
        thumbnail: embedThumbnail,
        footer: { text: embedFooterText, icon: embedFooterIcon },
        fields: embedFields,
      },
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "atomicshield-config.json";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Configuration Exported",
      description: "Configuration file downloaded successfully.",
    });
  };

  const getPreviewDescription = () => {
    return embedDescription
      .replace(/{player_name}/g, "ExamplePlayer")
      .replace(/{admin}/g, "AdminJohn")
      .replace(/{reason}/g, "Aimbot detection")
      .replace(/{date}/g, new Date().toLocaleString())
      .replace(/{server_name}/g, "FiveCity RP");
  };

  const getPreviewFields = () => {
    return embedFields.map((field) => ({
      ...field,
      name: field.name
        .replace(/{server_name}/g, "FiveCity RP")
        .replace(/{date}/g, new Date().toLocaleString()),
      value: field.value
        .replace(/{server_name}/g, "FiveCity RP")
        .replace(/{date}/g, new Date().toLocaleString()),
    }));
  };

  const renderCategoryStaticSections = (category: Category) => {
    const embedSettings = configData.static.embedSettings || {
      enabled: true,
      title: "AtomicShield Alert",
      description:
        "Player {player_name} has been banned by {admin} for: {reason}",
      color: "#ff0000",
      thumbnail: "",
      footer: {
        text: "AtomicShield Security System",
        icon: "https://i.imgur.com/AtomicShield.png",
      },
      fields: [
        { name: "Date", value: "{date}", inline: true },
        { name: "Server", value: "{server_name}", inline: true },
      ],
    };

    switch (category.label) {
      case "General Settings":
        return (
          <div className="space-y-6">
            <ModuleCard
              title="Server Information"
              description="Basic server configuration and identity"
              icon={<LucideIcons.Settings className="h-5 w-5 text-primary" />}
              tooltip="Configure your server's basic information and settings"
            >
              <div className="space-y-4">
                <FormField
                  label="Server Name"
                  description="Display name for your server in logs and notifications"
                  tooltip="This name will appear in Discord embeds and log messages"
                >
                  <Input
                    value={configData.static.serverName}
                    onChange={(e) => {
                      updateStaticConfig((prev) => ({
                        ...prev,
                        serverName: e.target.value,
                      }));
                      setHasChanges(true);
                    }}
                    className="bg-card border-border"
                  />
                </FormField>
                <FormField
                  label="Server IP Address"
                  description="Display your server's IP address"
                  tooltip="This IP will used for quick access and identification"
                >
                  <Input
                    value={configData.static.serverIp}
                    onChange={(e) => {
                      updateStaticConfig((prev) => ({
                        ...prev,
                        serverIp: e.target.value,
                      }));
                      setHasChanges(true);
                    }}
                    className="bg-card border-border"
                  />
                </FormField>
                <FormField
                  label="Server Image"
                  description="Upload an image to represent your server"
                  tooltip="This image will be displayed in the quick server access section"
                >
                  <div className="space-y-4">
                    {serverImagePreview ? (
                      <div className="relative">
                        <div className="border rounded-lg p-4 bg-background/50 border-primary/20">
                          <div className="flex items-center gap-4">
                            <img
                              src={serverImagePreview}
                              alt="Server preview"
                              className="w-16 h-16 rounded-lg object-cover border border-primary/20"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                Server Image
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {serverImage?.name} (
                                {(serverImage?.size || 0 / 1024 / 1024).toFixed(
                                  2,
                                )}{" "}
                                MB)
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={removeServerImage}
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              <LucideIcons.X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/60 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4">
                          <LucideIcons.ImageIcon className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, JPEG up to 5MB
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 border-primary/20 hover:bg-primary/10"
                          onClick={() =>
                            document.getElementById("serverImageInput")?.click()
                          }
                        >
                          <LucideIcons.Upload className="h-4 w-4 mr-2" />
                          Choose Image
                        </Button>
                      </div>
                    )}
                    <input
                      id="serverImageInput"
                      type="file"
                      accept="image/png,image/jpg,image/jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setHasChanges(true);
                          handleServerImageUpload(file);
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </FormField>
              </div>
            </ModuleCard>

            <ModuleCard
              title="System Behavior"
              description="Configure how AtomicShield operates"
              icon={<LucideIcons.Shield className="h-5 w-5 text-green-500" />}
            >
              <div className="space-y-4">
                <SwitchField
                  label="Enable Screenshot on Ban"
                  description="Take a screenshot when a player is banned for evidence"
                  checked={screenshotOnBan}
                  onCheckedChange={(checked) => {
                    setScreenshotOnBan(checked);
                    setHasChanges(true);
                  }}
                  tooltip="Screenshots are stored locally and can be used as evidence"
                />
              </div>
            </ModuleCard>

            <ModuleCard
              title="Import & Export"
              description="Backup and restore your configuration"
              icon={<LucideIcons.Upload className="h-5 w-5 text-blue-500" />}
            >
              <div className="flex gap-3">
                <Button variant="outline" onClick={exportConfig}>
                  <LucideIcons.Download className="h-4 w-4 mr-2" />
                  Export Config
                </Button>
                <Button variant="outline">
                  <LucideIcons.Upload className="h-4 w-4 mr-2" />
                  Import Config
                </Button>
              </div>
            </ModuleCard>
          </div>
        );

      case "Logging & Notifications":
        return (
          <div className="space-y-6">
            <ModuleCard
              title="Discord Integration"
              description="Configure webhook endpoints for seamless Discord notifications"
              icon={<LucideIcons.Link className="h-5 w-5 text-blue-500" />}
            >
              <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg border border-blue-500/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <LucideIcons.Globe className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">
                        Event-Based Routing
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Route different events to specific Discord channels
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const url = configData.static.webhookUrls?.ban || "";
                        if (url) {
                          updateStaticConfig((prev) => ({
                            ...prev,
                            webhookUrls: {
                              ban: url,
                              kick: url,
                              unban: url,
                              warning: url,
                              screenshot: url,
                            },
                          }));
                          setHasChanges(true);
                        }
                      }}
                      className="text-xs"
                    >
                      <LucideIcons.Copy className="h-3 w-3 mr-1" />
                      Copy All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        updateStaticConfig((prev) => ({
                          ...prev,
                          webhookUrls: {
                            ban: "",
                            kick: "",
                            unban: "",
                            warning: "",
                            screenshot: "",
                          },
                        }));
                        setHasChanges(true);
                      }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      <LucideIcons.Trash2 className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Webhook Configuration Table */}
                <div className="border border-border/50 rounded-lg overflow-hidden">
                  <div className="bg-muted/30 px-4 py-3 border-b border-border/50 hidden sm:block">
                    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      <div className="col-span-3">Event Type</div>
                      <div className="col-span-7">Webhook URL</div>
                      <div className="col-span-2 text-center">Status</div>
                    </div>
                  </div>

                  <div className="divide-y divide-border/30">
                    {/* Ban Webhook */}
                    <div className="p-4 hover:bg-muted/20 transition-colors">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start sm:items-center">
                        <div className="sm:col-span-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm font-medium">
                              Ban Events
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Player ban notifications
                          </p>
                        </div>
                        <div className="sm:col-span-7">
                          <div className="sm:hidden text-xs font-medium text-muted-foreground mb-2">
                            Webhook URL:
                          </div>
                          <ProfessionalWebhookInput
                            value={configData.static.webhookUrls?.ban || ""}
                            onChange={(value) => {
                              updateStaticConfig((prev) => ({
                                ...prev,
                                webhookUrls: {
                                  ...prev.webhookUrls,
                                  ban: value,
                                },
                              }));
                              setHasChanges(true);
                            }}
                            eventType="ban"
                            color="red"
                          />
                        </div>
                        <div className="sm:col-span-2 flex sm:justify-center">
                          <div className="sm:hidden text-xs font-medium text-muted-foreground mr-2">
                            Status:
                          </div>
                          {configData.static.webhookUrls?.ban ? (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-green-500/10 text-green-400 border-green-500/20"
                            >
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs text-muted-foreground"
                            >
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Kick Webhook */}
                    {/* <div className="p-4 hover:bg-muted/20 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm font-medium">
                              Kick Events
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Player kick notifications
                          </p>
                        </div>
                        <div className="col-span-7">
                          <ProfessionalWebhookInput
                            value={configData.static.webhookUrls?.kick || ""}
                            onChange={(value) => {
                              updateStaticConfig((prev) => ({
                                ...prev,
                                webhookUrls: {
                                  ...prev.webhookUrls,
                                  kick: value,
                                },
                              }));
                              setHasChanges(true);
                            }}
                            eventType="kick"
                            color="orange"
                          />
                        </div>
                        <div className="col-span-2 text-center">
                          {configData.static.webhookUrls?.kick ? (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-green-500/10 text-green-400 border-green-500/20"
                            >
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs text-muted-foreground"
                            >
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div> */}

                    {/* Unban Webhook */}
                    {/* <div className="p-4 hover:bg-muted/20 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">
                              Unban Events
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Player unban notifications
                          </p>
                        </div>
                        <div className="col-span-7">
                          <ProfessionalWebhookInput
                            value={configData.static.webhookUrls?.unban || ""}
                            onChange={(value) => {
                              updateStaticConfig((prev) => ({
                                ...prev,
                                webhookUrls: {
                                  ...prev.webhookUrls,
                                  unban: value,
                                },
                              }));
                              setHasChanges(true);
                            }}
                            eventType="unban"
                            color="green"
                          />
                        </div>
                        <div className="col-span-2 text-center">
                          {configData.static.webhookUrls?.unban ? (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-green-500/10 text-green-400 border-green-500/20"
                            >
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs text-muted-foreground"
                            >
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div> */}

                    {/* Screenshot Webhook */}
                    {/* <div className="p-4 hover:bg-muted/20 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium">
                              Screenshot Events
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Screenshot notifications
                          </p>
                        </div>
                        <div className="col-span-7">
                          <ProfessionalWebhookInput
                            value={
                              configData.static.webhookUrls?.screenshot || ""
                            }
                            onChange={(value) => {
                              updateStaticConfig((prev) => ({
                                ...prev,
                                webhookUrls: {
                                  ...prev.webhookUrls,
                                  screenshot: value,
                                },
                              }));
                              setHasChanges(true);
                            }}
                            eventType="screenshot"
                            color="blue"
                          />
                        </div>
                        <div className="col-span-2 text-center">
                          {configData.static.webhookUrls?.screenshot ? (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-green-500/10 text-green-400 border-green-500/20"
                            >
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs text-muted-foreground"
                            >
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-dashed border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <LucideIcons.Info className="h-3 w-3" />
                    <span>
                      Webhooks enable real-time Discord notifications for
                      moderation events
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {
                      Object.values(configData.static.webhookUrls || {}).filter(
                        Boolean,
                      ).length
                    }{" "}
                    / 5 configured
                  </div>
                </div>
              </div>
            </ModuleCard>

            <ModuleCard
              title="Discord Embed Editor"
              description="Customize how log messages appear in Discord"
              icon={<LucideIcons.Palette className="h-5 w-5 text-primary" />}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        testWebhook(selectedEventType);
                      }}
                    >
                      <LucideIcons.TestTube2 className="h-4 w-4 mr-1" />
                      Test{" "}
                      {selectedEventType.charAt(0).toUpperCase() +
                        selectedEventType.slice(1)}{" "}
                      Webhook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateStaticConfig((prev) => ({
                          ...prev,
                          embedSettings: {
                            ...prev.embedSettings,
                            title: "AtomicShield Alert",
                            description:
                              "Player {player_name} has been banned by {admin} for: {reason}",
                            color: "#ff0000",
                            thumbnail: "",
                            footer: {
                              text: "AtomicShield Security System",
                              icon: "https://i.imgur.com/AtomicShield.png",
                            },
                            fields: [
                              { name: "Date", value: "{date}", inline: true },
                              {
                                name: "Server",
                                value: "{server_name}",
                                inline: true,
                              },
                            ],
                          },
                        }));
                        setHasChanges(true);
                        toast({
                          title: "Embed Reset",
                          description:
                            "Embed settings have been reset to default values.",
                        });
                      }}
                    >
                      <LucideIcons.RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Editor Panel */}
                  <div className="space-y-6">
                    {/* Event Type Selection */}
                    <div className="space-y-4">
                      <FormField label="Event Type">
                        <Select
                          value={selectedEventType}
                          onValueChange={(value) => {
                            setSelectedEventType(value);
                            applyTemplate(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ban">Player Ban</SelectItem>
                            {/* {<SelectItem value="kick">Player Kick</SelectItem>
                            <SelectItem value="unban">Player Unban</SelectItem>
                            <SelectItem value="warning">
                              Warning Issued
                            </SelectItem>
                            <SelectItem value="screenshot">
                              Screenshot Taken
                            </SelectItem>} */}
                          </SelectContent>
                        </Select>
                      </FormField>
                    </div>

                    {/* Title & Thumbnail */}
                    <Collapsible defaultOpen={true}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/20 rounded-lg border border-dashed border-border/50 hover:bg-muted/30 transition-colors group">
                        <div className="flex items-center gap-2">
                          <LucideIcons.Type className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-sm">
                            Title & Thumbnail
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Header
                          </Badge>
                        </div>
                        <LucideIcons.ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-4 pt-4">
                        <FormField label="Embed Title">
                          <Input
                            value={configData.static.embedSettings.title}
                            onChange={(e) => {
                              updateStaticConfig((prev) => ({
                                ...prev,
                                embedSettings: {
                                  ...prev.embedSettings,
                                  title: e.target.value,
                                },
                              }));
                              setHasChanges(true);
                            }}
                            placeholder="Enter embed title"
                          />
                        </FormField>

                        <FormField label="Thumbnail URL">
                          <Input
                            value={configData.static.embedSettings.thumbnail}
                            onChange={(e) => {
                              updateStaticConfig((prev) => ({
                                ...prev,
                                embedSettings: {
                                  ...prev.embedSettings,
                                  thumbnail: e.target.value,
                                },
                              }));
                              setHasChanges(true);
                            }}
                            placeholder="https://example.com/image.png"
                          />
                        </FormField>

                        <FormField label="Embed Color">
                          <ColorPicker
                            value={configData.static.embedSettings.color}
                            onChange={(color) => {
                              updateStaticConfig((prev) => ({
                                ...prev,
                                embedSettings: {
                                  ...prev.embedSettings,
                                  color: color,
                                },
                              }));
                              setHasChanges(true);
                            }}
                          />
                        </FormField>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Description & Custom Fields */}
                    <Collapsible defaultOpen={true}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/20 rounded-lg border border-dashed border-border/50 hover:bg-muted/30 transition-colors group">
                        <div className="flex items-center gap-2">
                          <LucideIcons.FileText className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-sm">
                            Description & Custom Fields
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Content
                          </Badge>
                        </div>
                        <LucideIcons.ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-4 pt-4">
                        <FormField label="Description">
                          <Textarea
                            ref={descriptionTextareaRef}
                            value={configData.static.embedSettings.description}
                            onChange={(e) => {
                              updateStaticConfig((prev) => ({
                                ...prev,
                                embedSettings: {
                                  ...prev.embedSettings,
                                  description: e.target.value,
                                },
                              }));
                              setHasChanges(true);
                            }}
                            placeholder="Enter description with variables..."
                            className="min-h-[80px]"
                          />
                        </FormField>

                        {/* Variables Help */}
                        <div className="text-xs text-muted-foreground bg-muted/20 rounded-md p-3 border border-dashed border-muted-foreground/30">
                          <div className="flex items-center gap-2 mb-2">
                            <LucideIcons.MousePointer className="h-3 w-3" />
                            <span className="font-medium">
                              Click to insert variables:
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              <button
                                onClick={() => insertVariable("{player_name}")}
                                className="inline-flex items-center gap-1 hover:text-foreground hover:bg-blue-500/10 transition-colors px-2 py-1 rounded-md group"
                              >
                                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono group-hover:bg-blue-500/20">
                                  {"{player_name}"}
                                </code>
                                <span>player name</span>
                              </button>
                              <button
                                onClick={() => insertVariable("{admin}")}
                                className="inline-flex items-center gap-1 hover:text-foreground hover:bg-green-500/10 transition-colors px-2 py-1 rounded-md group"
                              >
                                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono group-hover:bg-green-500/20">
                                  {"{admin}"}
                                </code>
                                <span>admin name</span>
                              </button>
                              <button
                                onClick={() => insertVariable("{reason}")}
                                className="inline-flex items-center gap-1 hover:text-foreground hover:bg-orange-500/10 transition-colors px-2 py-1 rounded-md group"
                              >
                                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono group-hover:bg-orange-500/20">
                                  {"{reason}"}
                                </code>
                                <span>action reason</span>
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              <button
                                onClick={() => insertVariable("{date}")}
                                className="inline-flex items-center gap-1 hover:text-foreground hover:bg-purple-500/10 transition-colors px-2 py-1 rounded-md group"
                              >
                                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono group-hover:bg-purple-500/20">
                                  {"{date}"}
                                </code>
                                <span>current date</span>
                              </button>
                              <button
                                onClick={() => insertVariable("{server_name}")}
                                className="inline-flex items-center gap-1 hover:text-foreground hover:bg-cyan-500/10 transition-colors px-2 py-1 rounded-md group"
                              >
                                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono group-hover:bg-cyan-500/20">
                                  {"{server_name}"}
                                </code>
                                <span>server name</span>
                              </button>
                              <button
                                onClick={() => insertVariable("{player_id}")}
                                className="inline-flex items-center gap-1 hover:text-foreground hover:bg-indigo-500/10 transition-colors px-2 py-1 rounded-md group"
                              >
                                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono group-hover:bg-indigo-500/20">
                                  {"{player_id}"}
                                </code>
                                <span>player ID</span>
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              <button
                                onClick={() => insertVariable("{duration}")}
                                className="inline-flex items-center gap-1 hover:text-foreground hover:bg-yellow-500/10 transition-colors px-2 py-1 rounded-md group"
                              >
                                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono group-hover:bg-yellow-500/20">
                                  {"{duration}"}
                                </code>
                                <span>ban duration</span>
                              </button>
                              <button
                                onClick={() =>
                                  insertVariable("{screenshot_url}")
                                }
                                className="inline-flex items-center gap-1 hover:text-foreground hover:bg-pink-500/10 transition-colors px-2 py-1 rounded-md group"
                              >
                                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono group-hover:bg-pink-500/20">
                                  {"{screenshot_url}"}
                                </code>
                                <span>screenshot URL</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Custom Fields */}
                        <div className="space-y-4 border-t border-border/50 pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">
                                Additional Fields
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">
                                Add custom fields to display additional
                                information
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                updateStaticConfig((prev) => ({
                                  ...prev,
                                  embedSettings: {
                                    ...prev.embedSettings,
                                    fields: [
                                      ...prev.embedSettings.fields,
                                      { name: "", value: "", inline: false },
                                    ],
                                  },
                                }));
                                setHasChanges(true);
                              }}
                            >
                              <LucideIcons.Plus className="h-4 w-4 mr-1" />
                              Add Field
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {configData.static.embedSettings.fields.map(
                              (field, index) => (
                                <div
                                  key={index}
                                  className="p-3 border rounded-lg space-y-2 bg-card/30"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                      Field {index + 1}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        updateStaticConfig((prev) => ({
                                          ...prev,
                                          embedSettings: {
                                            ...prev.embedSettings,
                                            fields:
                                              prev.embedSettings.fields.filter(
                                                (_, i) => i !== index,
                                              ),
                                          },
                                        }));
                                        setHasChanges(true);
                                      }}
                                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                    >
                                      <LucideIcons.Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <Input
                                      placeholder="Field name"
                                      value={field.name}
                                      onChange={(e) => {
                                        const newFields = [
                                          ...configData.static.embedSettings
                                            .fields,
                                        ];
                                        newFields[index] = {
                                          ...newFields[index],
                                          name: e.target.value,
                                        };
                                        updateStaticConfig((prev) => ({
                                          ...prev,
                                          embedSettings: {
                                            ...prev.embedSettings,
                                            fields: newFields,
                                          },
                                        }));
                                        setHasChanges(true);
                                      }}
                                    />
                                    <Input
                                      placeholder="Field value"
                                      value={field.value}
                                      onChange={(e) => {
                                        const newFields = [
                                          ...configData.static.embedSettings
                                            .fields,
                                        ];
                                        newFields[index] = {
                                          ...newFields[index],
                                          value: e.target.value,
                                        };
                                        updateStaticConfig((prev) => ({
                                          ...prev,
                                          embedSettings: {
                                            ...prev.embedSettings,
                                            fields: newFields,
                                          },
                                        }));
                                        setHasChanges(true);
                                      }}
                                    />
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={field.inline}
                                      onCheckedChange={(checked) => {
                                        const newFields = [
                                          ...configData.static.embedSettings
                                            .fields,
                                        ];
                                        newFields[index] = {
                                          ...newFields[index],
                                          inline: checked,
                                        };
                                        updateStaticConfig((prev) => ({
                                          ...prev,
                                          embedSettings: {
                                            ...prev.embedSettings,
                                            fields: newFields,
                                          },
                                        }));
                                        setHasChanges(true);
                                      }}
                                      className="scale-75"
                                    />
                                    <Label className="text-xs">Inline</Label>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Footer & Metadata */}
                    <Collapsible defaultOpen={false}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/20 rounded-lg border border-dashed border-border/50 hover:bg-muted/30 transition-colors group">
                        <div className="flex items-center gap-2">
                          <LucideIcons.Clock className="h-4 w-4 text-purple-500" />
                          <span className="font-medium text-sm">
                            Footer & Metadata
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Footer
                          </Badge>
                        </div>
                        <LucideIcons.ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Footer Settings
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Configure footer text and icon displayed at the
                            bottom of the embed
                          </p>
                        </div>

                        <FormField label="Footer Text">
                          <Input
                            placeholder="Footer text (e.g., AtomicShield Security System)"
                            value={configData.static.embedSettings.footer.text}
                            onChange={(e) => {
                              updateStaticConfig((prev) => ({
                                ...prev,
                                embedSettings: {
                                  ...prev.embedSettings,
                                  footer: {
                                    ...prev.embedSettings.footer,
                                    text: e.target.value,
                                  },
                                },
                              }));
                              setHasChanges(true);
                            }}
                          />
                        </FormField>

                        <FormField label="Footer Icon URL">
                          <Input
                            placeholder="https://example.com/icon.png"
                            value={configData.static.embedSettings.footer.icon}
                            onChange={(e) => {
                              updateStaticConfig((prev) => ({
                                ...prev,
                                embedSettings: {
                                  ...prev.embedSettings,
                                  footer: {
                                    ...prev.embedSettings.footer,
                                    icon: e.target.value,
                                  },
                                },
                              }));
                              setHasChanges(true);
                            }}
                          />
                        </FormField>

                        <div className="flex items-center p-3 bg-muted/20 rounded-lg border border-dashed border-border/50">
                          <LucideIcons.Info className="h-4 w-4 text-blue-400 mr-2" />
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Timestamp:</span>{" "}
                            Discord automatically adds the current timestamp to
                            embeds when sent.
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* Preview Panel */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <LucideIcons.Eye className="h-4 w-4" />
                      <h4 className="font-medium">Live Preview</h4>
                    </div>

                    <div className="border-2 border-dashed border-border rounded-lg p-4 bg-[#36393f] text-white min-h-[500px]">
                      <div className="bg-[#2f3136] rounded p-4">
                        {/* Discord Embed Preview */}
                        <div
                          className="border-l-4 pl-4 space-y-3"
                          style={{
                            borderColor: configData.static.embedSettings.color,
                          }}
                        >
                          {configData.static.embedSettings.title && (
                            <h5 className="font-semibold text-white">
                              {configData.static.embedSettings.title}
                            </h5>
                          )}

                          {configData.static.embedSettings.description && (
                            <p className="text-sm text-gray-300 whitespace-pre-wrap">
                              {configData.static.embedSettings.description
                                .replace(/{player_name}/g, "ExamplePlayer")
                                .replace(/{admin}/g, "AdminJohn")
                                .replace(/{reason}/g, "Aimbot detection")
                                .replace(/{date}/g, new Date().toLocaleString())
                                .replace(/{server_name}/g, "FiveCity RP")}
                            </p>
                          )}

                          {configData.static.embedSettings.thumbnail && (
                            <div className="flex justify-end">
                              <div className="relative w-16 h-16">
                                <img
                                  src={configData.static.embedSettings.thumbnail.replace(
                                    /{screenshot_url}/g,
                                    "https://via.placeholder.com/64x64/4f46e5/ffffff?text=IMG",
                                  )}
                                  alt="Thumbnail"
                                  className="w-16 h-16 rounded object-cover border border-gray-600"
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = "none";
                                    const fallback =
                                      target.nextElementSibling as HTMLElement;
                                    if (fallback)
                                      fallback.style.display = "flex";
                                  }}
                                />
                                <div
                                  className="hidden w-16 h-16 rounded border border-gray-600 bg-gray-700 items-center justify-center text-xs text-gray-400"
                                  style={{ display: "none" }}
                                >
                                  <LucideIcons.ImageOff className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          )}

                          {configData.static.embedSettings.fields.length > 0 &&
                            (() => {
                              // Group fields by inline status for proper Discord-style rendering
                              const fields =
                                configData.static.embedSettings.fields;
                              const groupedFields: any[][] = [];
                              let currentGroup: any[] = [];

                              fields.forEach((field, index) => {
                                if (field.inline && currentGroup.length < 3) {
                                  currentGroup.push(field);
                                } else {
                                  if (currentGroup.length > 0) {
                                    groupedFields.push([...currentGroup]);
                                    currentGroup = [];
                                  }
                                  if (field.inline) {
                                    currentGroup.push(field);
                                  } else {
                                    groupedFields.push([field]);
                                  }
                                }
                              });

                              if (currentGroup.length > 0) {
                                groupedFields.push(currentGroup);
                              }

                              return (
                                <div className="space-y-2">
                                  {groupedFields.map((group, groupIndex) => (
                                    <div
                                      key={groupIndex}
                                      className={
                                        group.length > 1 && group[0].inline
                                          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                          : "space-y-2"
                                      }
                                    >
                                      {group.map((field, fieldIndex) => (
                                        <div
                                          key={`${groupIndex}-${fieldIndex}`}
                                          className="space-y-1"
                                        >
                                          {field.name && (
                                            <div className="text-xs font-semibold text-gray-400 uppercase">
                                              {field.name
                                                .replace(
                                                  /{player_name}/g,
                                                  "ExamplePlayer",
                                                )
                                                .replace(
                                                  /{admin}/g,
                                                  "AdminJohn",
                                                )
                                                .replace(
                                                  /{reason}/g,
                                                  "Aimbot detection",
                                                )
                                                .replace(
                                                  /{server_name}/g,
                                                  "FiveCity RP",
                                                )
                                                .replace(
                                                  /{date}/g,
                                                  new Date().toLocaleString(),
                                                )
                                                .replace(
                                                  /{player_id}/g,
                                                  "123456",
                                                )
                                                .replace(
                                                  /{duration}/g,
                                                  "Permanent",
                                                )
                                                .replace(
                                                  /{screenshot_url}/g,
                                                  "screenshot.png",
                                                )}
                                            </div>
                                          )}
                                          {field.value && (
                                            <div className="text-sm text-gray-300">
                                              {field.value
                                                .replace(
                                                  /{player_name}/g,
                                                  "ExamplePlayer",
                                                )
                                                .replace(
                                                  /{admin}/g,
                                                  "AdminJohn",
                                                )
                                                .replace(
                                                  /{reason}/g,
                                                  "Aimbot detection",
                                                )
                                                .replace(
                                                  /{server_name}/g,
                                                  "FiveCity RP",
                                                )
                                                .replace(
                                                  /{date}/g,
                                                  new Date().toLocaleString(),
                                                )
                                                .replace(
                                                  /{player_id}/g,
                                                  "123456",
                                                )
                                                .replace(
                                                  /{duration}/g,
                                                  "Permanent",
                                                )
                                                .replace(
                                                  /{screenshot_url}/g,
                                                  "screenshot.png",
                                                )}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}

                          {(configData.static.embedSettings.footer.text ||
                            configData.static.embedSettings.footer.icon) && (
                            <div className="flex items-center gap-2 pt-2 text-xs text-gray-400">
                              {configData.static.embedSettings.footer.icon && (
                                <div className="relative">
                                  <img
                                    src={
                                      configData.static.embedSettings.footer
                                        .icon
                                    }
                                    alt="Footer icon"
                                    className="w-4 h-4 rounded"
                                    onError={(e) => {
                                      const target = e.currentTarget;
                                      target.style.display = "none";
                                      const fallback =
                                        target.nextElementSibling as HTMLElement;
                                      if (fallback)
                                        fallback.style.display = "block";
                                    }}
                                  />
                                  <div
                                    className="hidden w-4 h-4 rounded bg-gray-600 flex items-center justify-center"
                                    style={{ display: "none" }}
                                  >
                                    <LucideIcons.ImageOff className="w-2 h-2" />
                                  </div>
                                </div>
                              )}
                              {configData.static.embedSettings.footer.text && (
                                <span>
                                  {configData.static.embedSettings.footer.text}
                                </span>
                              )}
                              <span>• {new Date().toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModuleCard>
          </div>
        );
    }
  };

  const renderMainContent = () => {
    if (!configData || !configData?.dynamic.categories) {
      return <div>Loading sections...</div>;
    }

    const targetCategory = configData?.dynamic.categories?.find(
      (category) => category.id === activeCategory,
    );

    if (!targetCategory) {
      return <div>Loading sections...</div>;
    }

    const staticSections = renderCategoryStaticSections(targetCategory);
    if (staticSections) {
      return staticSections;
    }

    return (
      <div className="space-y-6">
        {targetCategory.sections.map((section, index) => (
          <ModuleCard
            key={section.id ?? index}
            title={section.title}
            description={section.subtitle ?? section.description}
            icon={<LucideIcons.Settings className="h-5 w-5 text-primary" />}
            tooltip={section.tooltip}
          >
            <div className="space-y-4">
              {section.configurations.map((configuration, cidx) => {
                const key = configuration.id ?? configuration.title ?? cidx;

                if (configuration.type === "boolean") {
                  return (
                    <SwitchField
                      key={key}
                      label={configuration.title}
                      description={configuration.subtitle}
                      checked={configuration.value as boolean}
                      onCheckedChange={(checked) => {
                        updateConfigurationValue(
                          activeCategory,
                          section.id,
                          configuration.id,
                          checked,
                        );
                        setHasChanges(true);
                      }}
                      tooltip={configuration.tip}
                    />
                  );
                }

                if (configuration.type === "string") {
                  return (
                    <FormField
                      key={key}
                      label={configuration.title}
                      description={configuration.subtitle}
                      tooltip={configuration.tip}
                    >
                      <Input
                        value={configuration.value}
                        onChange={(e) => {
                          updateConfigurationValue(
                            activeCategory,
                            section.id,
                            configuration.id,
                            e.target.value,
                          );
                          setHasChanges(true);
                        }}
                        className="bg-card border-border"
                      />
                    </FormField>
                  );
                }

                if (configuration.type === "select") {
                  return (
                    <FormField
                      key={key}
                      label={configuration.title}
                      description={configuration.subtitle}
                      tooltip={configuration.tip}
                    >
                      <Select
                        // value={selectedEventType}
                        onValueChange={setSelectedEventType}
                        value={configuration.value as string}
                        onChange={(e) => {
                          console.log(e);
                          updateConfigurationValue(
                            activeCategory,
                            section.id,
                            configuration.id,
                            e.target.value,
                          );
                          setHasChanges(true);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {configuration.extra?.choices?.map(
                            (choice, choiceIdx) => (
                              <SelectItem key={choiceIdx} value={choice}>
                                {choice}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormField>
                  );
                }

                return null;
              })}
            </div>
          </ModuleCard>
        ))}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Configuration</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Anticheat Configuration
            </h1>
            <p className="text-muted-foreground">
              Configure your AtomicShield settings and preferences
            </p>
          </div>

          {/* Enhanced Loading State */}
          {isLoading && <ConfigurationLoadingScreen />}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4 max-w-md">
                <LucideIcons.AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-destructive">
                    Configuration Access Error
                  </h3>
                  <p className="text-muted-foreground mt-2">{error}</p>
                </div>
                <Button
                  onClick={() => {
                    setError(null);
                    fetchConfigurations();
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  <LucideIcons.RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Main Content */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
              {/* Config Sidebar */}
              <div className="lg:col-span-3">
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">
                      Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 sm:space-y-2 p-3 sm:p-6">
                    {configData?.dynamic.categories?.map((category) => (
                      <ConfigSidebarItem
                        key={category.id}
                        icon={category.icon}
                        label={category.label}
                        description={category.description}
                        isActive={activeCategory === category.id}
                        onClick={() => setActiveCategory(category.id)}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Content Area */}
              <div className="lg:col-span-9">{renderMainContent()}</div>
            </div>
          )}
        </div>

        {/* Sticky Save Bar */}
        {hasChanges && (
          <div className="fixed bottom-0 right-0 left-0 lg:left-64 z-50">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-t border-amber-500/20 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 lg:px-8 py-4 gap-4 sm:gap-0">
                <div className="flex items-center gap-3">
                  <LucideIcons.AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">
                      You have unsaved changes
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Save your configuration to apply changes
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleDiscard}
                    className="flex-1 sm:flex-none"
                  >
                    <LucideIcons.X className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Discard</span>
                    <span className="sm:hidden">Cancel</span>
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#2970ff] hover:bg-[#1e5eff] text-white font-semibold shadow-lg flex-1 sm:flex-none"
                  >
                    <LucideIcons.Save className="h-4 w-4 mr-2" />
                    {isSaving ? (
                      <>
                        <LucideIcons.Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <LucideIcons.Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
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
