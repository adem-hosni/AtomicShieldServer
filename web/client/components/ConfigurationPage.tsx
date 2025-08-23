import React, { useState } from "react";
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
import { useLanguage } from "@/hooks/use-language";
import {
  useScrollAnimation,
  getScrollAnimationClasses,
} from "@/hooks/use-scroll-animation";
import { api } from "@/lib/api-client";
import { useParams } from "react-router-dom";
import {
  Settings,
  Search,
  Shield,
  Users,
  FileText,
  Save,
  Plus,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronRight,
  Info,
  TestTube2,
  Upload,
  Download,
  X,
  Check,
  AlertTriangle,
  Palette,
  Hash,
  Image as ImageIcon,
  RefreshCw,
  Server,
  Key,
} from "lucide-react";

interface ConfigSidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

function ConfigSidebarItem({
  icon,
  label,
  isActive,
  onClick,
}: ConfigSidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all w-full text-left ${
        isActive
          ? "bg-primary/20 text-primary border border-primary/30"
          : "hover:bg-primary/10 hover:text-primary"
      }`}
    >
      <div className={`${isActive ? "text-primary" : "text-muted-foreground"}`}>
        {icon}
      </div>
      <span>{label}</span>
    </button>
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
    <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/30 transition-all duration-300">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                  {icon}
                </div>
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
    <div className="flex items-start space-x-3 p-3 rounded-lg border border-primary/20 bg-background/50 hover:bg-primary/5 transition-colors">
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

const configSections = [
  {
    id: "general",
    label: "General Settings",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    id: "detection",
    label: "Detection Settings",
    icon: <Search className="h-4 w-4" />,
  },
  {
    id: "punishment",
    label: "Punishment Settings",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: "whitelist",
    label: "Whitelists & Exceptions",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "logging",
    label: "Logging & Notifications",
    icon: <FileText className="h-4 w-4" />,
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
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
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

export function ConfigurationPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { serverId } = useParams<{ serverId: string }>();
  const navigate = useNavigate();
  const [isRefreshingKey, setIsRefreshingKey] = useState(false);

  // Scroll animation hooks for different sections
  const headerAnimation = useScrollAnimation({ threshold: 0.3 });
  const sidebarAnimation = useScrollAnimation({ threshold: 0.2 });
  const contentAnimation = useScrollAnimation({ threshold: 0.2 });

  // Default values for reset functionality
  const defaultValues = {
    serverName: "FiveCity RP Demo Server",
    serverImage: null as File | null,
    serverImagePreview: null as string | null,
    webhookUrl: "https://discord.com/api/webhooks/1234567890/abcdef...",
    screenshotOnBan: true,
    memoryScanning: true,
    processInjection: true,
    blacklistedDll: true,
    speedHacks: true,
    logBans: true,
    logKicks: true,
    logJails: false,
    logConfigChanges: true,
    logLoginAttempts: true,
    logIpChanges: false,
    logWhitelistEdits: true,
    embedEnabled: true,
    embedTitle: "Platform Alert",
    embedDescription:
      "Player {player_name} has been banned by {admin} for: {reason}",
    embedColor: "#ff0000",
    embedThumbnail: "",
    embedFooterText: "Enhancement Platform System",
    embedFooterIcon: "https://i.imgur.com/AtomicShield.png",
    embedFields: [
      { name: "Date", value: "{date}", inline: true },
      { name: "Server", value: "{server_name}", inline: true },
    ],
    selectedEventType: "ban",
    embedTemplates: {
      ban: "Ban Template",
      kick: "Kick Template",
      warning: "Warning Template",
    },
  };

  // Form states
  const [serverName, setServerName] = useState(defaultValues.serverName);
  const [serverImage, setServerImage] = useState(defaultValues.serverImage);
  const [serverImagePreview, setServerImagePreview] = useState(
    defaultValues.serverImagePreview,
  );
  const [webhookUrl, setWebhookUrl] = useState(defaultValues.webhookUrl);
  const [screenshotOnBan, setScreenshotOnBan] = useState(
    defaultValues.screenshotOnBan,
  );

  // Detection settings
  const [memoryScanning, setMemoryScanning] = useState(
    defaultValues.memoryScanning,
  );
  const [processInjection, setProcessInjection] = useState(
    defaultValues.processInjection,
  );
  const [blacklistedDll, setBlacklistedDll] = useState(
    defaultValues.blacklistedDll,
  );
  const [speedHacks, setSpeedHacks] = useState(defaultValues.speedHacks);

  // Punishment settings
  const [logBans, setLogBans] = useState(defaultValues.logBans);
  const [logKicks, setLogKicks] = useState(defaultValues.logKicks);
  const [logJails, setLogJails] = useState(defaultValues.logJails);

  // Admin action settings
  const [logConfigChanges, setLogConfigChanges] = useState(
    defaultValues.logConfigChanges,
  );
  const [logLoginAttempts, setLogLoginAttempts] = useState(
    defaultValues.logLoginAttempts,
  );
  const [logIpChanges, setLogIpChanges] = useState(defaultValues.logIpChanges);
  const [logWhitelistEdits, setLogWhitelistEdits] = useState(
    defaultValues.logWhitelistEdits,
  );

  // Discord Embed Editor states
  const [embedEnabled, setEmbedEnabled] = useState(defaultValues.embedEnabled);
  const [embedTitle, setEmbedTitle] = useState(defaultValues.embedTitle);
  const [embedDescription, setEmbedDescription] = useState(
    defaultValues.embedDescription,
  );
  const [embedColor, setEmbedColor] = useState(defaultValues.embedColor);
  const [embedThumbnail, setEmbedThumbnail] = useState(
    defaultValues.embedThumbnail,
  );
  const [embedFooterText, setEmbedFooterText] = useState(
    defaultValues.embedFooterText,
  );
  const [embedFooterIcon, setEmbedFooterIcon] = useState(
    defaultValues.embedFooterIcon,
  );
  const [embedFields, setEmbedFields] = useState(defaultValues.embedFields);
  const [selectedEventType, setSelectedEventType] = useState(
    defaultValues.selectedEventType,
  );
  const [embedTemplates, setEmbedTemplates] = useState(
    defaultValues.embedTemplates,
  );

  const handleSave = () => {
    console.log("Saving configuration...");
    setHasChanges(false);
    toast({
      title: "Configuration Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const handleDiscard = () => {
    // Reset all form values to their defaults
    setServerName(defaultValues.serverName);
    setServerImage(defaultValues.serverImage);
    setServerImagePreview(defaultValues.serverImagePreview);
    setWebhookUrl(defaultValues.webhookUrl);
    setScreenshotOnBan(defaultValues.screenshotOnBan);

    // Reset detection settings
    setMemoryScanning(defaultValues.memoryScanning);
    setProcessInjection(defaultValues.processInjection);
    setBlacklistedDll(defaultValues.blacklistedDll);
    setSpeedHacks(defaultValues.speedHacks);

    // Reset punishment settings
    setLogBans(defaultValues.logBans);
    setLogKicks(defaultValues.logKicks);
    setLogJails(defaultValues.logJails);

    // Reset admin action settings
    setLogConfigChanges(defaultValues.logConfigChanges);
    setLogLoginAttempts(defaultValues.logLoginAttempts);
    setLogIpChanges(defaultValues.logIpChanges);
    setLogWhitelistEdits(defaultValues.logWhitelistEdits);

    // Reset Discord embed settings
    setEmbedEnabled(defaultValues.embedEnabled);
    setEmbedTitle(defaultValues.embedTitle);
    setEmbedDescription(defaultValues.embedDescription);
    setEmbedColor(defaultValues.embedColor);
    setEmbedThumbnail(defaultValues.embedThumbnail);
    setEmbedFooterText(defaultValues.embedFooterText);
    setEmbedFooterIcon(defaultValues.embedFooterIcon);
    setEmbedFields([...defaultValues.embedFields]); // Create new array to avoid reference issues
    setSelectedEventType(defaultValues.selectedEventType);
    setEmbedTemplates({ ...defaultValues.embedTemplates }); // Create new object to avoid reference issues

    setHasChanges(false);
    toast({
      title: "Changes Discarded",
      description: "All unsaved changes have been reverted.",
      variant: "destructive",
    });
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

  const handleServerImageUpload = (file: File) => {
    if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPG, or JPEG image",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast({
        title: "File too large",
        description: "Image must be smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setServerImage(file);
    setHasChanges(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setServerImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    toast({
      title: "Image uploaded",
      description: "Server image updated successfully",
    });
  };

  const removeServerImage = () => {
    setServerImage(null);
    setServerImagePreview(null);
    setHasChanges(true);
    toast({
      title: "Image removed",
      description: "Server image has been removed",
    });
  };

  const resetEmbedToDefault = () => {
    setEmbedTitle("Platform Alert");
    setEmbedDescription(
      "Player {player_name} has been banned by {admin} for: {reason}",
    );
    setEmbedColor("#ff0000");
    setEmbedThumbnail("");
    setEmbedFooterText("Enhancement Platform System");
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

  const testWebhook = async () => {
    try {
      // Simulate webhook test
      toast({
        title: "Testing Webhook...",
        description: "Sending test embed to Discord",
      });

      // Simulate API call delay
      setTimeout(() => {
        toast({
          title: "Webhook Test Successful",
          description: "Test embed sent successfully to Discord!",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Webhook Test Failed",
        description: "Failed to send test embed. Check your webhook URL.",
        variant: "destructive",
      });
    }
  };

  const handleRefreshKey = async () => {
    if (!serverId) {
      toast({
        title: "Error",
        description: "No server ID available",
        variant: "destructive",
      });
      return;
    }

    setIsRefreshingKey(true);
    try {
      const response = await api.servers.refreshServerKey(serverId);

      if (response.success && response.data) {
        toast({
          title: "License Key Refreshed",
          description: "A new license key has been generated for your server.",
        });
      } else {
        throw new Error(response.error || "Failed to refresh license key");
      }
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to refresh license key",
        variant: "destructive",
      });
    } finally {
      setIsRefreshingKey(false);
    }
  };

  const exportConfig = () => {
    const config = {
      serverName,
      webhookUrl,
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
    a.download = "platform-config.json";
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

  const renderSectionContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-6">
            <ModuleCard
              title="Server Information"
              description="Basic server configuration and identity"
              icon={<Settings className="h-5 w-5 text-primary" />}
              tooltip="Configure your server's basic information and settings"
            >
              <div className="space-y-4">
                <FormField
                  label="Server Name"
                  description="Display name for your server in logs and notifications"
                  tooltip="This name will appear in Discord embeds and log messages"
                >
                  <Input
                    value={serverName}
                    onChange={(e) =>
                      handleInputChange(e.target.value, setServerName)
                    }
                    className="bg-background/50 border-primary/20 focus:border-primary/40"
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
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/60 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4">
                          <ImageIcon className="h-6 w-6 text-primary" />
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
                          <Upload className="h-4 w-4 mr-2" />
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
                        if (file) handleServerImageUpload(file);
                      }}
                      className="hidden"
                    />
                  </div>
                </FormField>

                <FormField
                  label="Server Management"
                  description="Administrative actions for this server"
                  tooltip="Manage server license keys and server deletion"
                >
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        onClick={handleRefreshKey}
                        disabled={isRefreshingKey}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-600 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-200"
                      >
                        {isRefreshingKey ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Refreshing...
                          </>
                        ) : (
                          <>
                            <Key className="h-4 w-4 mr-2" />
                            Refresh License Key
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="flex items-center gap-2">
                        <Key className="h-3 w-3 text-blue-500" />
                        Refresh License Key: Generate a new license key for your
                        server
                      </p>
                    </div>
                  </div>
                </FormField>
              </div>
            </ModuleCard>

            <ModuleCard
              title="System Behavior"
              description="Configure how the enhancement platform operates"
              icon={<Shield className="h-5 w-5 text-primary" />}
            >
              <div className="space-y-4">
                <SwitchField
                  label="Enable Screenshot on Ban"
                  description="Take a screenshot when a player is banned for evidence"
                  checked={screenshotOnBan}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, setScreenshotOnBan)
                  }
                  tooltip="Screenshots are stored locally and can be used as evidence"
                />
              </div>
            </ModuleCard>

            <ModuleCard
              title="Import & Export"
              description="Backup and restore your configuration"
              icon={<Upload className="h-5 w-5 text-primary" />}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={exportConfig}
                  className="w-full sm:w-auto"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Config
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Config
                </Button>
              </div>
            </ModuleCard>
          </div>
        );

      case "detection":
        return (
          <div className="space-y-6">
            <ModuleCard
              title="Detection Events"
              description="Choose which detection types trigger logging"
              icon={<Search className="h-5 w-5 text-primary" />}
            >
              <div className="space-y-4">
                <SwitchField
                  label="Memory Scanning Detection"
                  description="Log when memory scanning tools are detected"
                  checked={memoryScanning}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, setMemoryScanning)
                  }
                />
                <SwitchField
                  label="Process Injection Detection"
                  description="Log when process injection attempts are detected"
                  checked={processInjection}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, setProcessInjection)
                  }
                />
                <SwitchField
                  label="Blacklisted DLL Detection"
                  description="Log when blacklisted DLLs are detected"
                  checked={blacklistedDll}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, setBlacklistedDll)
                  }
                />
                <SwitchField
                  label="Speed Hack Detection"
                  description="Log when speed modifications are detected"
                  checked={speedHacks}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, setSpeedHacks)
                  }
                />
              </div>
            </ModuleCard>
          </div>
        );

      case "punishment":
        return (
          <div className="space-y-6">
            <ModuleCard
              title="Punishment Events"
              description="Choose which punishment actions to log"
              icon={<Shield className="h-5 w-5 text-primary" />}
            >
              <div className="space-y-4">
                <SwitchField
                  label="Log Player Bans"
                  description="Record all player ban events"
                  checked={logBans}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, setLogBans)
                  }
                />
                <SwitchField
                  label="Log Player Kicks"
                  description="Record all player kick events"
                  checked={logKicks}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, setLogKicks)
                  }
                />
                <SwitchField
                  label="Log Jail Actions"
                  description="Record when players are jailed"
                  checked={logJails}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, setLogJails)
                  }
                />
              </div>
            </ModuleCard>
          </div>
        );

      case "whitelist":
        return (
          <div className="space-y-6">
            <ModuleCard
              title="Admin Actions"
              description="Log administrative activities and changes"
              icon={<Users className="h-5 w-5 text-purple-500" />}
            >
              <div className="space-y-4">
                <SwitchField
                  label="Log Configuration Changes"
                  description="Record when configuration settings are modified"
                  checked={logConfigChanges}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, setLogConfigChanges)
                  }
                />
                <SwitchField
                  label="Log Login Attempts"
                  description="Record all admin login attempts"
                  checked={logLoginAttempts}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, setLogLoginAttempts)
                  }
                />
                <SwitchField
                  label="Log IP Address Changes"
                  description="Record when admin IP addresses change"
                  checked={logIpChanges}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, setLogIpChanges)
                  }
                />
                <SwitchField
                  label="Log Whitelist Edits"
                  description="Record changes to player whitelists"
                  checked={logWhitelistEdits}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, setLogWhitelistEdits)
                  }
                />
              </div>
            </ModuleCard>
          </div>
        );

      case "logging":
        return (
          <div className="space-y-6">
            <ModuleCard
              title="Webhook Configuration"
              description="Configure Discord webhook for notifications"
              icon={<FileText className="h-5 w-5 text-primary" />}
            >
              <FormField
                label="Discord Webhook URL"
                description="All logs and events will be sent to this webhook"
                tooltip="Create a webhook in your Discord channel settings"
              >
                <Textarea
                  value={webhookUrl}
                  onChange={(e) =>
                    handleInputChange(e.target.value, setWebhookUrl)
                  }
                  className="bg-card border-border min-h-[40px] resize-none"
                />
              </FormField>
            </ModuleCard>

            <ModuleCard
              title="Discord Embed Editor"
              description="Customize how log messages appear in Discord"
              icon={<Palette className="h-5 w-5 text-primary" />}
              defaultOpen={embedEnabled}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={embedEnabled}
                      onCheckedChange={(checked) => {
                        setEmbedEnabled(checked);
                        setHasChanges(true);
                      }}
                    />
                    <Label className="text-sm font-medium">Enable Embeds</Label>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={testWebhook}
                      className="w-full sm:w-auto"
                    >
                      <TestTube2 className="h-4 w-4 mr-1" />
                      Test Webhook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetEmbedToDefault}
                      className="w-full sm:w-auto"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>

                {embedEnabled && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Editor Panel */}
                    <div className="space-y-6 order-2 xl:order-1">
                      <div className="space-y-4">
                        <FormField label="Event Type">
                          <Select
                            value={selectedEventType}
                            onValueChange={setSelectedEventType}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ban">Player Ban</SelectItem>
                              <SelectItem value="kick">Player Kick</SelectItem>
                              <SelectItem value="unban">
                                Player Unban
                              </SelectItem>
                              <SelectItem value="warning">
                                Warning Issued
                              </SelectItem>
                              <SelectItem value="screenshot">
                                Screenshot Taken
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>

                        <FormField label="Embed Title">
                          <Input
                            value={embedTitle}
                            onChange={(e) => {
                              setEmbedTitle(e.target.value);
                              setHasChanges(true);
                            }}
                            placeholder="Enter embed title"
                          />
                        </FormField>

                        <FormField label="Description">
                          <Textarea
                            value={embedDescription}
                            onChange={(e) => {
                              setEmbedDescription(e.target.value);
                              setHasChanges(true);
                            }}
                            placeholder="Enter description with variables..."
                            className="min-h-[80px]"
                          />
                          <div className="flex flex-wrap gap-1 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {"{player_name}"}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {"{admin}"}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {"{reason}"}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {"{date}"}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {"{server_name}"}
                            </Badge>
                          </div>
                        </FormField>

                        <FormField label="Embed Color">
                          <ColorPicker
                            value={embedColor}
                            onChange={(color) => {
                              setEmbedColor(color);
                              setHasChanges(true);
                            }}
                          />
                        </FormField>

                        <FormField label="Thumbnail URL">
                          <Input
                            value={embedThumbnail}
                            onChange={(e) => {
                              setEmbedThumbnail(e.target.value);
                              setHasChanges(true);
                            }}
                            placeholder="https://example.com/image.png"
                          />
                        </FormField>
                      </div>

                      {/* Fields */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            Custom Fields
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={addEmbedField}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Field
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {embedFields.map((field, index) => (
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
                                  onClick={() => removeEmbedField(index)}
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  placeholder="Field name"
                                  value={field.name}
                                  onChange={(e) =>
                                    updateEmbedField(
                                      index,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                />
                                <Input
                                  placeholder="Field value"
                                  value={field.value}
                                  onChange={(e) =>
                                    updateEmbedField(
                                      index,
                                      "value",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>

                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={field.inline}
                                  onCheckedChange={(checked) =>
                                    updateEmbedField(index, "inline", checked)
                                  }
                                  className="scale-75"
                                />
                                <Label className="text-xs">Inline</Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Footer</Label>
                        <div className="space-y-2">
                          <Input
                            placeholder="Footer text"
                            value={embedFooterText}
                            onChange={(e) => {
                              setEmbedFooterText(e.target.value);
                              setHasChanges(true);
                            }}
                          />
                          <Input
                            placeholder="Footer icon URL"
                            value={embedFooterIcon}
                            onChange={(e) => {
                              setEmbedFooterIcon(e.target.value);
                              setHasChanges(true);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="space-y-4 order-1 xl:order-2">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <h4 className="font-medium">Live Preview</h4>
                      </div>

                      <div className="border-2 border-dashed border-border rounded-lg p-4 bg-[#36393f] text-white min-h-[300px] xl:min-h-[500px]">
                        <div className="bg-[#2f3136] rounded p-4">
                          {/* Discord Embed Preview */}
                          <div
                            className="border-l-4 pl-4 space-y-3"
                            style={{ borderColor: embedColor }}
                          >
                            {embedTitle && (
                              <h5 className="font-semibold text-white">
                                {embedTitle}
                              </h5>
                            )}

                            {embedDescription && (
                              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                                {getPreviewDescription()}
                              </p>
                            )}

                            {embedThumbnail && (
                              <div className="flex justify-end">
                                <img
                                  src={embedThumbnail}
                                  alt="Thumbnail"
                                  className="w-16 h-16 rounded object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            )}

                            {embedFields.length > 0 && (
                              <div className="grid gap-2">
                                {getPreviewFields().map((field, index) => (
                                  <div
                                    key={index}
                                    className={
                                      field.inline ? "inline-block mr-4" : ""
                                    }
                                  >
                                    {field.name && (
                                      <div className="text-xs font-semibold text-gray-400 uppercase">
                                        {field.name}
                                      </div>
                                    )}
                                    {field.value && (
                                      <div className="text-sm text-gray-300">
                                        {field.value}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {(embedFooterText || embedFooterIcon) && (
                              <div className="flex items-center gap-2 pt-2 text-xs text-gray-400">
                                {embedFooterIcon && (
                                  <img
                                    src={embedFooterIcon}
                                    alt="Footer icon"
                                    className="w-4 h-4 rounded"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                )}
                                {embedFooterText && (
                                  <span>{embedFooterText}</span>
                                )}
                                <span>• {new Date().toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ModuleCard>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">
                {configSections.find((s) => s.id === activeSection)?.label}
              </h2>
              <p className="text-muted-foreground">
                This section is coming soon
              </p>
            </div>
          </div>
        );
    }
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
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("configuration")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div
            ref={headerAnimation.elementRef}
            className={getScrollAnimationClasses(
              headerAnimation.isVisible,
              "slide-in-bottom",
              "700",
            )}
          >
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {t("anticheatConfiguration")}
            </h1>
            <p className="text-muted-foreground text-lg">
              Configure your enhancement platform settings and preferences
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Config Sidebar */}
            <div
              ref={sidebarAnimation.elementRef}
              className={`lg:col-span-3 ${getScrollAnimationClasses(sidebarAnimation.isVisible, "slide-in-left", "700")}`}
            >
              <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {configSections.map((section) => (
                    <ConfigSidebarItem
                      key={section.id}
                      icon={section.icon}
                      label={section.label}
                      isActive={activeSection === section.id}
                      onClick={() => setActiveSection(section.id)}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Content Area */}
            <div
              ref={contentAnimation.elementRef}
              className={`lg:col-span-9 ${getScrollAnimationClasses(contentAnimation.isVisible, "slide-in-right", "700", "200")}`}
            >
              {renderSectionContent()}
            </div>
          </div>
        </div>

        {/* Sticky Save Bar */}
        {hasChanges && (
          <div className="fixed bottom-0 right-0 left-0 lg:left-64 z-50">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-t border-amber-500/20 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 lg:px-8 py-4 gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
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
                    onClick={handleDiscard}
                    className="flex-1 sm:flex-none"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Discard
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
