import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Eye,
  Palette,
  RotateCcw,
  Plus,
  Trash2,
  User,
  FileText,
  Image,
  Link,
  Calendar,
  MessageSquare,
  Globe,
  Type,
  AlignLeft,
  Hash,
  HelpCircle,
  Save,
  Upload,
  X,
  GripVertical,
  AlertCircle,
  Check,
  RefreshCw,
  Code,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  timestamp?: string;
  footer?: {
    text?: string;
    icon_url?: string;
  };
  thumbnail?: {
    url?: string;
    file?: File;
  };
  image?: {
    url?: string;
    file?: File;
  };
  author?: {
    name?: string;
    url?: string;
    icon_url?: string;
  };
  fields?: Array<{
    id: string;
    name: string;
    value: string;
    inline?: boolean;
  }>;
}

interface DiscordEmbedEditorProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  subtitle: string;
  className?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface Keyword {
  key: string;
  label: string;
  description: string;
  example: string;
  category: "player" | "server" | "detection" | "system" | "time";
}

// Available keywords/placeholders
const AVAILABLE_KEYWORDS: Keyword[] = [
  // Player keywords
  {
    key: "{player_name}",
    label: "Player Name",
    description: "Name of the detected player",
    example: "SuspiciousPlayer123",
    category: "player",
  },
  {
    key: "{player_id}",
    label: "Player ID",
    description: "Unique player identifier",
    example: "12345",
    category: "player",
  },
  {
    key: "{player_license}",
    label: "Player License",
    description: "Player's license identifier",
    example: "license:abc123def456",
    category: "player",
  },
  {
    key: "{player_steam}",
    label: "Steam ID",
    description: "Player's Steam identifier",
    example: "steam:110000123456789",
    category: "player",
  },
  {
    key: "{player_discord}",
    label: "Discord ID",
    description: "Player's Discord identifier",
    example: "discord:987654321098765432",
    category: "player",
  },

  // Server keywords
  {
    key: "{server_name}",
    label: "Server Name",
    description: "Name of the server",
    example: "AtomicShield RP Server",
    category: "server",
  },
  {
    key: "{server_id}",
    label: "Server ID",
    description: "Server identifier",
    example: "server_001",
    category: "server",
  },
  {
    key: "{server_endpoint}",
    label: "Server Endpoint",
    description: "Server connection endpoint",
    example: "connect cfx.re/abc123",
    category: "server",
  },

  // Detection keywords
  {
    key: "{detection_type}",
    label: "Detection Type",
    description: "Type of cheat detected",
    example: "Aimbot",
    category: "detection",
  },
  {
    key: "{detection_level}",
    label: "Detection Level",
    description: "Severity level",
    example: "HIGH",
    category: "detection",
  },
  {
    key: "{detection_confidence}",
    label: "Confidence",
    description: "Detection confidence percentage",
    example: "98.7%",
    category: "detection",
  },
  {
    key: "{ban_reason}",
    label: "Ban Reason",
    description: "Reason for the ban",
    example: "Aimbot Detection - Automated Ban",
    category: "detection",
  },
  {
    key: "{ban_duration}",
    label: "Ban Duration",
    description: "Length of the ban",
    example: "Permanent",
    category: "detection",
  },

  // System keywords
  {
    key: "{admin_name}",
    label: "Admin Name",
    description: "Name of the admin",
    example: "AdminUser",
    category: "system",
  },
  {
    key: "{action_taken}",
    label: "Action Taken",
    description: "Action performed",
    example: "Player Banned",
    category: "system",
  },
  {
    key: "{evidence_id}",
    label: "Evidence ID",
    description: "Evidence reference ID",
    example: "EV-2024-001234",
    category: "system",
  },

  // Time keywords
  {
    key: "{timestamp}",
    label: "Timestamp",
    description: "Current date and time",
    example: "2024-01-15 14:30:25",
    category: "time",
  },
  {
    key: "{date}",
    label: "Date",
    description: "Current date",
    example: "January 15, 2024",
    category: "time",
  },
  {
    key: "{time}",
    label: "Time",
    description: "Current time",
    example: "2:30 PM",
    category: "time",
  },
];

// Generate unique IDs for fields
const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultEmbed: DiscordEmbed = {
  title: "🚨 AtomicShield Alert - {detection_type} Detected",
  description:
    "**Player:** {player_name}\n**Detection:** {detection_type}\n**Confidence:** {detection_confidence}\n**Action:** {action_taken}",
  color: 0x00bfdb,
  timestamp: new Date().toISOString(),
  footer: {
    text: "AtomicShield Anti-Cheat • {timestamp}",
  },
  fields: [
    {
      id: generateId(),
      name: "🎮 Player Information",
      value:
        "**Name:** {player_name}\n**ID:** {player_id}\n**Steam:** {player_steam}",
      inline: true,
    },
    {
      id: generateId(),
      name: "🛡️ Detection Details",
      value:
        "**Type:** {detection_type}\n**Level:** {detection_level}\n**Confidence:** {detection_confidence}",
      inline: true,
    },
    {
      id: generateId(),
      name: "🌐 Server Information",
      value:
        "**Server:** {server_name}\n**Endpoint:** {server_endpoint}\n**Evidence ID:** {evidence_id}",
      inline: true,
    },
  ],
};

const emptyEmbed: DiscordEmbed = {
  color: 0x00bfdb,
  fields: [],
};

const colorPresets = [
  { name: "AtomicShield", color: 0x00bfdb },
  { name: "Success", color: 0x22c55e },
  { name: "Warning", color: 0xf59e0b },
  { name: "Error", color: 0xef4444 },
  { name: "Info", color: 0x3b82f6 },
  { name: "Purple", color: 0xa855f7 },
  { name: "Pink", color: 0xec4899 },
  { name: "Indigo", color: 0x6366f1 },
];

// Validation rules
const VALIDATION_RULES = {
  title: { maxLength: 256 },
  description: { maxLength: 4096 },
  fieldName: { maxLength: 256 },
  fieldValue: { maxLength: 1024 },
  footerText: { maxLength: 2048 },
  authorName: { maxLength: 256 },
  maxFields: 25,
  totalCharacters: 6000,
};

// URL validation regex
const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Image validation
const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8MB

// Function to replace keywords with example data for preview
const replaceKeywordsWithExamples = (text: string): string => {
  let result = text;

  AVAILABLE_KEYWORDS.forEach((keyword) => {
    const regex = new RegExp(keyword.key.replace(/[{}]/g, "\\$&"), "g");
    result = result.replace(regex, keyword.example);
  });

  return result;
};

// Keyword Picker Component
function KeywordPicker({
  onInsert,
  children,
}: {
  onInsert: (keyword: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const keywordsByCategory = AVAILABLE_KEYWORDS.reduce(
    (acc, keyword) => {
      if (!acc[keyword.category]) acc[keyword.category] = [];
      acc[keyword.category].push(keyword);
      return acc;
    },
    {} as Record<string, Keyword[]>,
  );

  const categoryIcons = {
    player: User,
    server: Globe,
    detection: AlertCircle,
    system: Zap,
    time: Calendar,
  };

  const categoryLabels = {
    player: "Player",
    server: "Server",
    detection: "Detection",
    system: "System",
    time: "Time",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 border-b">
          <h4 className="font-semibold text-sm">Insert Dynamic Keywords</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Click a keyword to insert it at cursor position
          </p>
        </div>
        <ScrollArea className="h-64">
          <div className="p-2">
            {Object.entries(keywordsByCategory).map(([category, keywords]) => {
              const Icon =
                categoryIcons[category as keyof typeof categoryIcons];
              return (
                <div key={category} className="mb-4">
                  <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                    <Icon className="h-3 w-3" />
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </div>
                  <div className="space-y-1">
                    {keywords.map((keyword) => (
                      <Tooltip key={keyword.key}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              onInsert(keyword.key);
                              setOpen(false);
                            }}
                            className="w-full text-left p-2 text-xs rounded hover:bg-muted/60 transition-colors"
                          >
                            <div className="font-mono text-primary">
                              {keyword.key}
                            </div>
                            <div className="text-muted-foreground">
                              {keyword.label}
                            </div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <div className="max-w-48">
                            <p className="font-medium">{keyword.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {keyword.description}
                            </p>
                            <p className="text-xs mt-1">
                              <span className="text-muted-foreground">
                                Example:{" "}
                              </span>
                              <span className="font-mono">
                                {keyword.example}
                              </span>
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

// Enhanced Input with Keyword Support
function KeywordInput({
  value,
  onChange,
  placeholder,
  className,
  maxLength,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  const inputRef = useRef<HTMLInputElement>(null);

  const insertKeyword = (keyword: string) => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const newValue = value.substring(0, start) + keyword + value.substring(end);

    onChange(newValue);

    // Set cursor position after the inserted keyword
    setTimeout(() => {
      input.setSelectionRange(start + keyword.length, start + keyword.length);
      input.focus();
    }, 0);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        maxLength={maxLength}
        {...props}
      />
      <KeywordPicker onInsert={insertKeyword}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1 h-7 w-7 p-0 hover:bg-muted/60"
        >
          <Code className="h-3 w-3" />
        </Button>
      </KeywordPicker>
    </div>
  );
}

// Enhanced Textarea with Keyword Support
function KeywordTextarea({
  value,
  onChange,
  placeholder,
  className,
  maxLength,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertKeyword = (keyword: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const newValue = value.substring(0, start) + keyword + value.substring(end);

    onChange(newValue);

    // Set cursor position after the inserted keyword
    setTimeout(() => {
      textarea.setSelectionRange(
        start + keyword.length,
        start + keyword.length,
      );
      textarea.focus();
    }, 0);
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        maxLength={maxLength}
        {...props}
      />
      <KeywordPicker onInsert={insertKeyword}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 h-7 w-7 p-0 hover:bg-muted/60"
        >
          <Code className="h-3 w-3" />
        </Button>
      </KeywordPicker>
    </div>
  );
}

// Sortable Field Component
function SortableField({
  field,
  index,
  onUpdate,
  onRemove,
  errors,
}: {
  field: { id: string; name: string; value: string; inline?: boolean };
  index: number;
  onUpdate: (id: string, updates: Partial<typeof field>) => void;
  onRemove: (id: string) => void;
  errors: ValidationError[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const fieldNameError = errors.find(
    (e) => e.field === `field-${field.id}-name`,
  );
  const fieldValueError = errors.find(
    (e) => e.field === `field-${field.id}-value`,
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 border rounded-lg bg-muted/20 border-border/30 space-y-3 touch-manipulation"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/40 touch-manipulation"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <Label className="text-sm font-medium">Field {index + 1}</Label>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={field.inline || false}
              onCheckedChange={(checked) =>
                onUpdate(field.id, { inline: checked })
              }
            />
            <Label className="text-xs">Inline</Label>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemove(field.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/20 touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px]"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid gap-3">
        <div>
          <KeywordInput
            value={field.name}
            onChange={(value) => onUpdate(field.id, { name: value })}
            placeholder="Field name..."
            className={cn(
              "text-sm bg-input/50 border-border/50 focus:border-primary/50",
              fieldNameError && "border-destructive focus:border-destructive",
            )}
            maxLength={VALIDATION_RULES.fieldName.maxLength}
          />
          {fieldNameError && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {fieldNameError.message}
            </p>
          )}
        </div>
        <div>
          <KeywordTextarea
            value={field.value}
            onChange={(value) => onUpdate(field.id, { value })}
            placeholder="Field value..."
            className={cn(
              "text-sm min-h-[60px] bg-input/50 border-border/50 focus:border-primary/50",
              fieldValueError && "border-destructive focus:border-destructive",
            )}
            maxLength={VALIDATION_RULES.fieldValue.maxLength}
          />
          {fieldValueError && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {fieldValueError.message}
            </p>
          )}
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span></span>
            <span>
              {field.value.length}/{VALIDATION_RULES.fieldValue.maxLength}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Image Upload Component
function ImageUpload({
  label,
  value,
  onChange,
  placeholder = "Upload or paste image URL",
  error,
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      throw new Error(
        "Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.",
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error(
        "File size too large. Please upload images smaller than 8MB.",
      );
    }

    setIsUploading(true);
    try {
      // Convert to data URL for preview
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      throw error;
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      try {
        await handleFileUpload(file);
      } catch (error) {
        // Handle error - could show toast
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await handleFileUpload(file);
      } catch (error) {
        // Handle error - could show toast
      }
    }
  };

  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">{label}</Label>
      <div className="space-y-3">
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "text-sm bg-input/50 border-border/50 focus:border-primary/50",
            error && "border-destructive focus:border-destructive",
          )}
        />
        <div
          className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <RefreshCw className="h-6 w-6 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="h-6 w-6 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground">
              {isUploading
                ? "Uploading..."
                : "Drop image here or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF, WebP up to 8MB
            </p>
          </div>
        </div>
        {value && (
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="max-w-full h-20 object-cover rounded border"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 h-6 w-6 p-0 bg-background/80 hover:bg-background/90"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        {error && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

export function DiscordEmbedEditor({
  value,
  onChange,
  title,
  subtitle,
  className,
}: DiscordEmbedEditorProps) {
  const [embed, setEmbed] = useState<DiscordEmbed>(() => {
    try {
      const parsed = value ? JSON.parse(value) : defaultEmbed;
      // Ensure fields have IDs
      if (parsed.fields) {
        parsed.fields = parsed.fields.map((field: any) => ({
          ...field,
          id: field.id || generateId(),
        }));
      }
      return parsed;
    } catch {
      return defaultEmbed;
    }
  });

  const [activeSection, setActiveSection] = useState("basic");
  const [initialEmbed, setInitialEmbed] = useState<DiscordEmbed>(() => {
    try {
      const parsed = value ? JSON.parse(value) : defaultEmbed;
      if (parsed.fields) {
        parsed.fields = parsed.fields.map((field: any) => ({
          ...field,
          id: field.id || generateId(),
        }));
      }
      return parsed;
    } catch {
      return defaultEmbed;
    }
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const { toast } = useToast();

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Validation function
  const validateEmbed = (embedData: DiscordEmbed): ValidationError[] => {
    const newErrors: ValidationError[] = [];

    // Title validation
    if (
      embedData.title &&
      embedData.title.length > VALIDATION_RULES.title.maxLength
    ) {
      newErrors.push({
        field: "title",
        message: `Title must be ${VALIDATION_RULES.title.maxLength} characters or less`,
      });
    }

    // Description validation
    if (
      embedData.description &&
      embedData.description.length > VALIDATION_RULES.description.maxLength
    ) {
      newErrors.push({
        field: "description",
        message: `Description must be ${VALIDATION_RULES.description.maxLength} characters or less`,
      });
    }

    // URL validations
    if (embedData.url && !URL_REGEX.test(embedData.url)) {
      newErrors.push({
        field: "url",
        message: "Please enter a valid URL starting with http:// or https://",
      });
    }

    if (embedData.author?.url && !URL_REGEX.test(embedData.author.url)) {
      newErrors.push({
        field: "author.url",
        message: "Please enter a valid URL starting with http:// or https://",
      });
    }

    if (
      embedData.author?.icon_url &&
      !URL_REGEX.test(embedData.author.icon_url)
    ) {
      newErrors.push({
        field: "author.icon_url",
        message: "Please enter a valid URL starting with http:// or https://",
      });
    }

    if (embedData.thumbnail?.url && !URL_REGEX.test(embedData.thumbnail.url)) {
      newErrors.push({
        field: "thumbnail.url",
        message: "Please enter a valid URL starting with http:// or https://",
      });
    }

    if (embedData.image?.url && !URL_REGEX.test(embedData.image.url)) {
      newErrors.push({
        field: "image.url",
        message: "Please enter a valid URL starting with http:// or https://",
      });
    }

    if (
      embedData.footer?.icon_url &&
      !URL_REGEX.test(embedData.footer.icon_url)
    ) {
      newErrors.push({
        field: "footer.icon_url",
        message: "Please enter a valid URL starting with http:// or https://",
      });
    }

    // Fields validation
    if (
      embedData.fields &&
      embedData.fields.length > VALIDATION_RULES.maxFields
    ) {
      newErrors.push({
        field: "fields",
        message: `Maximum ${VALIDATION_RULES.maxFields} fields allowed`,
      });
    }

    embedData.fields?.forEach((field, index) => {
      if (field.name.length > VALIDATION_RULES.fieldName.maxLength) {
        newErrors.push({
          field: `field-${field.id}-name`,
          message: `Field name must be ${VALIDATION_RULES.fieldName.maxLength} characters or less`,
        });
      }
      if (field.value.length > VALIDATION_RULES.fieldValue.maxLength) {
        newErrors.push({
          field: `field-${field.id}-value`,
          message: `Field value must be ${VALIDATION_RULES.fieldValue.maxLength} characters or less`,
        });
      }
      if (!field.name.trim()) {
        newErrors.push({
          field: `field-${field.id}-name`,
          message: "Field name cannot be empty",
        });
      }
      if (!field.value.trim()) {
        newErrors.push({
          field: `field-${field.id}-value`,
          message: "Field value cannot be empty",
        });
      }
    });

    // Footer validation
    if (
      embedData.footer?.text &&
      embedData.footer.text.length > VALIDATION_RULES.footerText.maxLength
    ) {
      newErrors.push({
        field: "footer.text",
        message: `Footer text must be ${VALIDATION_RULES.footerText.maxLength} characters or less`,
      });
    }

    // Author name validation
    if (
      embedData.author?.name &&
      embedData.author.name.length > VALIDATION_RULES.authorName.maxLength
    ) {
      newErrors.push({
        field: "author.name",
        message: `Author name must be ${VALIDATION_RULES.authorName.maxLength} characters or less`,
      });
    }

    // Total character count
    const totalChars =
      (embedData.title?.length || 0) +
      (embedData.description?.length || 0) +
      (embedData.footer?.text?.length || 0) +
      (embedData.author?.name?.length || 0) +
      (embedData.fields?.reduce(
        (acc, field) => acc + field.name.length + field.value.length,
        0,
      ) || 0);

    if (totalChars > VALIDATION_RULES.totalCharacters) {
      newErrors.push({
        field: "total",
        message: `Total character count (${totalChars}) exceeds limit of ${VALIDATION_RULES.totalCharacters}`,
      });
    }

    return newErrors;
  };

  // Check if current embed differs from initial embed
  useEffect(() => {
    const currentJson = JSON.stringify(embed);
    const initialJson = JSON.stringify(initialEmbed);
    setHasChanges(currentJson !== initialJson);

    // Validate on change
    const validationErrors = validateEmbed(embed);
    setErrors(validationErrors);
  }, [embed, initialEmbed]);

  useEffect(() => {
    const jsonString = JSON.stringify(embed, null, 2);
    onChange(jsonString);
  }, [embed, onChange]);

  const updateEmbed = (path: string, value: any) => {
    setEmbed((prev) => {
      const newEmbed = { ...prev };
      const keys = path.split(".");
      let current: any = newEmbed;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      if (value === "" && keys[keys.length - 1] !== "description") {
        delete current[keys[keys.length - 1]];
      } else {
        current[keys[keys.length - 1]] = value;
      }

      return newEmbed;
    });
  };

  const addField = () => {
    if (embed.fields && embed.fields.length >= VALIDATION_RULES.maxFields) {
      toast({
        title: "Maximum Fields Reached",
        description: `You can only have up to ${VALIDATION_RULES.maxFields} fields.`,
        variant: "destructive",
      });
      return;
    }

    setEmbed((prev) => ({
      ...prev,
      fields: [
        ...(prev.fields || []),
        {
          id: generateId(),
          name: "New Field",
          value: "Field value",
          inline: false,
        },
      ],
    }));
  };

  const removeField = (id: string) => {
    setEmbed((prev) => ({
      ...prev,
      fields: prev.fields?.filter((field) => field.id !== id) || [],
    }));
  };

  const updateField = (
    id: string,
    updates: Partial<{ name: string; value: string; inline: boolean }>,
  ) => {
    setEmbed((prev) => ({
      ...prev,
      fields:
        prev.fields?.map((field) =>
          field.id === id ? { ...field, ...updates } : field,
        ) || [],
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setEmbed((prev) => {
        if (!prev.fields) return prev;

        const oldIndex = prev.fields.findIndex(
          (field) => field.id === active.id,
        );
        const newIndex = prev.fields.findIndex(
          (field) => field.id === over?.id,
        );

        return {
          ...prev,
          fields: arrayMove(prev.fields, oldIndex, newIndex),
        };
      });
    }
  };

  const resetToDefault = () => {
    const freshDefault = {
      ...defaultEmbed,
      fields: defaultEmbed.fields?.map((field) => ({
        ...field,
        id: generateId(),
      })),
    };
    setEmbed(freshDefault);
    setInitialEmbed(freshDefault);
    setHasChanges(false);
    toast({
      title: "Reset to Default",
      description:
        "Embed has been reset to default values with dynamic keywords.",
    });
  };

  const resetToEmpty = () => {
    const freshEmpty = {
      ...emptyEmbed,
      fields: [],
    };
    setEmbed(freshEmpty);
    setInitialEmbed(freshEmpty);
    setHasChanges(false);
    toast({
      title: "Reset to Empty",
      description: "Embed has been reset to empty state.",
    });
  };

  const resetEmbed = () => {
    setEmbed(initialEmbed);
    setHasChanges(false);
  };

  const saveChanges = () => {
    if (errors.length > 0) {
      toast({
        title: "Validation Errors",
        description: "Please fix all validation errors before saving.",
        variant: "destructive",
      });
      return;
    }

    setInitialEmbed(embed);
    setHasChanges(false);
    toast({
      title: "Embed Saved",
      description:
        "Your Discord embed configuration has been saved successfully.",
    });
  };

  const getColorHex = (color?: number) => {
    if (!color) return "#00bfdb";
    return `#${color.toString(16).padStart(6, "0")}`;
  };

  const setColorFromHex = (hex: string) => {
    const color = parseInt(hex.replace("#", ""), 16);
    updateEmbed("color", color);
  };

  const getTotalCharacters = () => {
    return (
      (embed.title?.length || 0) +
      (embed.description?.length || 0) +
      (embed.footer?.text?.length || 0) +
      (embed.author?.name?.length || 0) +
      (embed.fields?.reduce(
        (acc, field) => acc + field.name.length + field.value.length,
        0,
      ) || 0)
    );
  };

  const sections = [
    { id: "basic", label: "Basic Info", icon: Type },
    { id: "author", label: "Author", icon: User },
    { id: "media", label: "Media", icon: Image },
    { id: "fields", label: "Fields", icon: FileText },
    { id: "footer", label: "Footer", icon: AlignLeft },
  ];

  const totalCharacters = getTotalCharacters();
  const hasValidationErrors = errors.length > 0;

  return (
    <TooltipProvider>
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <Label className="text-lg font-semibold">{title}</Label>
            </div>
            <Badge variant="secondary" className="text-xs w-fit">
              Discord
            </Badge>
            <Badge
              variant="outline"
              className="text-xs w-fit flex items-center gap-1"
            >
              <Code className="h-3 w-3" />
              Dynamic Keywords
            </Badge>
            <div className="flex gap-2 sm:ml-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetToEmpty}
                    className="flex items-center gap-2 touch-manipulation min-h-[44px] sm:min-h-[36px]"
                  >
                    <X className="h-3 w-3" />
                    Empty
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset to empty embed</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetToDefault}
                    className="flex items-center gap-2 touch-manipulation min-h-[44px] sm:min-h-[36px]"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Default
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset to default embed with dynamic keywords</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetEmbed}
                    className="flex items-center gap-2 touch-manipulation min-h-[44px] sm:min-h-[36px]"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset to saved embed</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}

          {/* Dynamic Keywords Info */}
          <Alert className="border-primary/20 bg-primary/5">
            <Code className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Dynamic Keywords Available</p>
                <p className="text-sm">
                  Click the <Code className="h-3 w-3 inline mx-1" /> button in
                  any text field to insert dynamic keywords like{" "}
                  <code className="text-xs bg-muted px-1 rounded">
                    {"{player_name}"}
                  </code>
                  ,{" "}
                  <code className="text-xs bg-muted px-1 rounded">
                    {"{detection_type}"}
                  </code>
                  , etc. The preview shows realistic example data.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Validation Errors Alert */}
        {hasValidationErrors && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Please fix the following issues:</p>
                <ul className="list-disc list-inside text-sm space-y-0.5">
                  {errors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid xl:grid-cols-2 lg:grid-cols-1 gap-8">
          {/* Editor Panel - Balanced with preview */}
          <div className="xl:col-span-1 lg:col-span-1 space-y-6">
            {/* Section Navigation */}
            <Card className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border-primary/20">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <Button
                        key={section.id}
                        variant={
                          activeSection === section.id ? "default" : "ghost"
                        }
                        size="sm"
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                          "flex items-center gap-2 transition-all touch-manipulation min-h-[44px] sm:min-h-[36px]",
                          activeSection === section.id &&
                            "bg-primary text-primary-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {section.label}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            {activeSection === "basic" && (
              <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Type className="h-5 w-5 text-primary" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                        <Hash className="h-4 w-4" />
                        Title
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>The main title of your embed</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <KeywordInput
                        value={embed.title || ""}
                        onChange={(value) => updateEmbed("title", value)}
                        placeholder="Enter embed title..."
                        className={cn(
                          "text-sm bg-input/50 border-border/50 focus:border-primary/50",
                          errors.find((e) => e.field === "title") &&
                            "border-destructive focus:border-destructive",
                        )}
                        maxLength={VALIDATION_RULES.title.maxLength}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span></span>
                        <span>
                          {embed.title?.length || 0}/
                          {VALIDATION_RULES.title.maxLength}
                        </span>
                      </div>
                      {errors.find((e) => e.field === "title") && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.find((e) => e.field === "title")?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                        <AlignLeft className="h-4 w-4" />
                        Description
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Main content of your embed</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <KeywordTextarea
                        value={embed.description || ""}
                        onChange={(value) => updateEmbed("description", value)}
                        placeholder="Enter embed description..."
                        className={cn(
                          "text-sm min-h-[100px] bg-input/50 border-border/50 focus:border-primary/50",
                          errors.find((e) => e.field === "description") &&
                            "border-destructive focus:border-destructive",
                        )}
                        maxLength={VALIDATION_RULES.description.maxLength}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span></span>
                        <span>
                          {embed.description?.length || 0}/
                          {VALIDATION_RULES.description.maxLength}
                        </span>
                      </div>
                      {errors.find((e) => e.field === "description") && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {
                            errors.find((e) => e.field === "description")
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                          <Palette className="h-4 w-4" />
                          Color Theme
                        </Label>
                        <div className="space-y-3">
                          <Input
                            type="color"
                            value={getColorHex(embed.color)}
                            onChange={(e) => setColorFromHex(e.target.value)}
                            className="h-10 w-full p-1 bg-input/50 border-border/50"
                          />
                          <div className="grid grid-cols-4 gap-2">
                            {colorPresets.map((preset) => (
                              <Tooltip key={preset.name}>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() =>
                                      updateEmbed("color", preset.color)
                                    }
                                    className={cn(
                                      "h-8 w-full rounded border-2 transition-all hover:scale-105 touch-manipulation",
                                      embed.color === preset.color
                                        ? "border-primary"
                                        : "border-border/30 hover:border-border",
                                    )}
                                    style={{
                                      backgroundColor: `#${preset.color.toString(16).padStart(6, "0")}`,
                                    }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{preset.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                          <Link className="h-4 w-4" />
                          URL
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Makes the title clickable</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Input
                          value={embed.url || ""}
                          onChange={(e) => updateEmbed("url", e.target.value)}
                          placeholder="https://example.com"
                          className={cn(
                            "text-sm bg-input/50 border-border/50 focus:border-primary/50",
                            errors.find((e) => e.field === "url") &&
                              "border-destructive focus:border-destructive",
                          )}
                        />
                        {errors.find((e) => e.field === "url") && (
                          <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.find((e) => e.field === "url")?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30">
                      <div>
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Include Timestamp
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Shows current time in the footer
                        </p>
                      </div>
                      <Switch
                        checked={!!embed.timestamp}
                        onCheckedChange={(checked) =>
                          updateEmbed(
                            "timestamp",
                            checked ? new Date().toISOString() : "",
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Author Section */}
            {activeSection === "author" && (
              <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    Author Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Author Name
                    </Label>
                    <KeywordInput
                      value={embed.author?.name || ""}
                      onChange={(value) => updateEmbed("author.name", value)}
                      placeholder="Author name..."
                      className={cn(
                        "text-sm bg-input/50 border-border/50 focus:border-primary/50",
                        errors.find((e) => e.field === "author.name") &&
                          "border-destructive focus:border-destructive",
                      )}
                      maxLength={VALIDATION_RULES.authorName.maxLength}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span></span>
                      <span>
                        {embed.author?.name?.length || 0}/
                        {VALIDATION_RULES.authorName.maxLength}
                      </span>
                    </div>
                    {errors.find((e) => e.field === "author.name") && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.find((e) => e.field === "author.name")?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <ImageUpload
                      label="Author Icon URL"
                      value={embed.author?.icon_url || ""}
                      onChange={(url) => updateEmbed("author.icon_url", url)}
                      placeholder="https://example.com/icon.png"
                      error={
                        errors.find((e) => e.field === "author.icon_url")
                          ?.message
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Author URL
                    </Label>
                    <Input
                      value={embed.author?.url || ""}
                      onChange={(e) =>
                        updateEmbed("author.url", e.target.value)
                      }
                      placeholder="https://example.com"
                      className={cn(
                        "text-sm bg-input/50 border-border/50 focus:border-primary/50",
                        errors.find((e) => e.field === "author.url") &&
                          "border-destructive focus:border-destructive",
                      )}
                    />
                    {errors.find((e) => e.field === "author.url") && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.find((e) => e.field === "author.url")?.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Media Section */}
            {activeSection === "media" && (
              <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Image className="h-5 w-5 text-primary" />
                    Images & Media
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImageUpload
                    label="Thumbnail (Small image on the right)"
                    value={embed.thumbnail?.url || ""}
                    onChange={(url) => updateEmbed("thumbnail.url", url)}
                    placeholder="Upload or paste thumbnail URL"
                    error={
                      errors.find((e) => e.field === "thumbnail.url")?.message
                    }
                  />
                  <ImageUpload
                    label="Image (Large image at the bottom)"
                    value={embed.image?.url || ""}
                    onChange={(url) => updateEmbed("image.url", url)}
                    placeholder="Upload or paste image URL"
                    error={errors.find((e) => e.field === "image.url")?.message}
                  />
                </CardContent>
              </Card>
            )}

            {/* Fields Section */}
            {activeSection === "fields" && (
              <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-primary/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-primary" />
                      Custom Fields
                      <Badge variant="outline" className="text-xs">
                        {embed.fields?.length || 0}/{VALIDATION_RULES.maxFields}
                      </Badge>
                    </CardTitle>
                    <Button
                      size="sm"
                      onClick={addField}
                      disabled={
                        embed.fields &&
                        embed.fields.length >= VALIDATION_RULES.maxFields
                      }
                      className="flex items-center gap-2 touch-manipulation min-h-[44px] sm:min-h-[36px]"
                    >
                      <Plus className="h-4 w-4" />
                      Add Field
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-[500px]">
                    <div className="space-y-4">
                      {embed.fields && embed.fields.length > 0 ? (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext
                            items={embed.fields.map((f) => f.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {embed.fields.map((field, index) => (
                              <SortableField
                                key={field.id}
                                field={field}
                                index={index}
                                onUpdate={updateField}
                                onRemove={removeField}
                                errors={errors}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No fields added yet</p>
                          <p className="text-xs">
                            Click "Add Field" to create custom fields
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Footer Section */}
            {activeSection === "footer" && (
              <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlignLeft className="h-5 w-5 text-primary" />
                    Footer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Footer Text
                    </Label>
                    <KeywordInput
                      value={embed.footer?.text || ""}
                      onChange={(value) => updateEmbed("footer.text", value)}
                      placeholder="Footer text..."
                      className={cn(
                        "text-sm bg-input/50 border-border/50 focus:border-primary/50",
                        errors.find((e) => e.field === "footer.text") &&
                          "border-destructive focus:border-destructive",
                      )}
                      maxLength={VALIDATION_RULES.footerText.maxLength}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span></span>
                      <span>
                        {embed.footer?.text?.length || 0}/
                        {VALIDATION_RULES.footerText.maxLength}
                      </span>
                    </div>
                    {errors.find((e) => e.field === "footer.text") && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.find((e) => e.field === "footer.text")?.message}
                      </p>
                    )}
                  </div>
                  <ImageUpload
                    label="Footer Icon URL"
                    value={embed.footer?.icon_url || ""}
                    onChange={(url) => updateEmbed("footer.icon_url", url)}
                    placeholder="https://example.com/icon.png"
                    error={
                      errors.find((e) => e.field === "footer.icon_url")?.message
                    }
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Live Preview Panel - Large and prominent like in screenshot */}
          <div className="xl:col-span-1 lg:col-span-1 xl:order-last lg:order-first">
            <div className="sticky top-6">
              <Card className="bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl border-primary/30 shadow-xl h-fit">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Eye className="h-7 w-7 text-primary" />
                    Live Preview
                    <Badge
                      variant="outline"
                      className="text-sm ml-auto bg-primary/10 border-primary/30 px-3 py-1"
                    >
                      Real Data
                    </Badge>
                  </CardTitle>
                  <p className="text-base text-muted-foreground mt-3">
                    Real-time preview with dynamic keyword replacement
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Discord-style embed preview - Compact size */}
                  <div className="bg-[#36393f] rounded-lg p-4 min-h-[300px] lg:min-h-[350px] font-['Whitney',_sans-serif] relative shadow-inner">
                    {/* Discord message container - Compact sizing */}
                    <div className="flex items-start gap-3 mb-3">
                      {/* Bot avatar - Normal size */}
                      <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-base font-medium flex-shrink-0">
                        A
                      </div>
                      {/* Bot name and badge */}
                      <div className="flex flex-wrap items-center gap-2 text-white">
                        <span className="text-white font-medium text-[16px]">
                          AtomicShield Bot
                        </span>
                        <div className="bg-[#5865f2] text-white text-[11px] px-2 py-1 rounded text-center font-medium">
                          BOT
                        </div>
                        <span className="text-[#72767d] text-sm">
                          Today at{" "}
                          {new Date().toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Embed container - Compact spacing */}
                    <div className="ml-14">
                      <div
                        className="border-l-4 border-solid bg-[#2f3136] rounded-lg p-4 shadow-lg"
                        style={{ borderLeftColor: getColorHex(embed.color) }}
                      >
                        <div className="flex gap-4">
                          <div className="flex-1 min-w-0">
                            {embed.author?.name && (
                              <div className="flex items-center gap-2 text-sm mb-3">
                                {embed.author.icon_url && (
                                  <img
                                    src={replaceKeywordsWithExamples(
                                      embed.author.icon_url,
                                    )}
                                    alt=""
                                    className="w-6 h-6 rounded-full object-cover"
                                    onError={(e) => {
                                      (
                                        e.target as HTMLImageElement
                                      ).style.display = "none";
                                    }}
                                  />
                                )}
                                <span className="text-white font-medium text-[15px] hover:underline cursor-pointer">
                                  {replaceKeywordsWithExamples(
                                    embed.author.name,
                                  )}
                                </span>
                              </div>
                            )}

                            {embed.title && (
                              <div
                                className={cn(
                                  "font-semibold text-[18px] leading-[1.375] mb-3 break-words",
                                  embed.url
                                    ? "text-[#00aff4] hover:underline cursor-pointer"
                                    : "text-white",
                                )}
                              >
                                {replaceKeywordsWithExamples(embed.title)}
                              </div>
                            )}

                            {embed.description && (
                              <div className="text-[#dcddde] text-[15px] leading-[1.2] whitespace-pre-wrap break-words mb-3">
                                {replaceKeywordsWithExamples(embed.description)}
                              </div>
                            )}

                            {embed.fields && embed.fields.length > 0 && (
                              <div className="mb-4">
                                {(() => {
                                  const renderFields = () => {
                                    const result = [];
                                    let currentRow = [];
                                    let inlineCount = 0;

                                    for (
                                      let i = 0;
                                      i < embed.fields.length;
                                      i++
                                    ) {
                                      const field = embed.fields[i];

                                      if (field.inline && inlineCount < 3) {
                                        currentRow.push(field);
                                        inlineCount++;

                                        // If we hit 3 inline fields or this is the last field, render the row
                                        if (
                                          inlineCount === 3 ||
                                          i === embed.fields.length - 1
                                        ) {
                                          result.push(
                                            <div
                                              key={`row-${result.length}`}
                                              className="grid grid-cols-3 gap-2 mb-3"
                                            >
                                              {currentRow.map(
                                                (rowField, idx) => (
                                                  <div
                                                    key={rowField.id}
                                                    className="min-w-0"
                                                  >
                                                    <div className="text-white font-semibold text-[15px] leading-[1.2] mb-1 break-words">
                                                      {replaceKeywordsWithExamples(
                                                        rowField.name,
                                                      )}
                                                    </div>
                                                    <div className="text-[#dcddde] text-[15px] leading-[1.2] break-words whitespace-pre-wrap">
                                                      {replaceKeywordsWithExamples(
                                                        rowField.value,
                                                      )}
                                                    </div>
                                                  </div>
                                                ),
                                              )}
                                              {/* Fill empty slots if less than 3 inline fields */}
                                              {currentRow.length < 3 &&
                                                Array.from({
                                                  length: 3 - currentRow.length,
                                                }).map((_, idx) => (
                                                  <div
                                                    key={`empty-${idx}`}
                                                    className="min-w-0"
                                                  ></div>
                                                ))}
                                            </div>,
                                          );
                                          currentRow = [];
                                          inlineCount = 0;
                                        }
                                      } else {
                                        // Non-inline field or we've exceeded 3 inline fields in a row
                                        // First, render any pending inline fields
                                        if (currentRow.length > 0) {
                                          result.push(
                                            <div
                                              key={`row-${result.length}`}
                                              className="grid grid-cols-3 gap-2 mb-3"
                                            >
                                              {currentRow.map((rowField) => (
                                                <div
                                                  key={rowField.id}
                                                  className="min-w-0"
                                                >
                                                  <div className="text-white font-semibold text-[15px] leading-[1.2] mb-1 break-words">
                                                    {replaceKeywordsWithExamples(
                                                      rowField.name,
                                                    )}
                                                  </div>
                                                  <div className="text-[#dcddde] text-[15px] leading-[1.2] break-words whitespace-pre-wrap">
                                                    {replaceKeywordsWithExamples(
                                                      rowField.value,
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                              {/* Fill empty slots */}
                                              {currentRow.length < 3 &&
                                                Array.from({
                                                  length: 3 - currentRow.length,
                                                }).map((_, idx) => (
                                                  <div
                                                    key={`empty-${idx}`}
                                                    className="min-w-0"
                                                  ></div>
                                                ))}
                                            </div>,
                                          );
                                          currentRow = [];
                                          inlineCount = 0;
                                        }

                                        // Render the non-inline field
                                        result.push(
                                          <div key={field.id} className="mb-3">
                                            <div className="text-white font-semibold text-[15px] leading-[1.2] mb-1 break-words">
                                              {replaceKeywordsWithExamples(
                                                field.name,
                                              )}
                                            </div>
                                            <div className="text-[#dcddde] text-[15px] leading-[1.2] break-words whitespace-pre-wrap">
                                              {replaceKeywordsWithExamples(
                                                field.value,
                                              )}
                                            </div>
                                          </div>,
                                        );
                                      }
                                    }

                                    return result;
                                  };

                                  return renderFields();
                                })()}
                              </div>
                            )}

                            {embed.image?.url && (
                              <div className="mt-4 mb-3">
                                <img
                                  src={replaceKeywordsWithExamples(
                                    embed.image.url,
                                  )}
                                  alt=""
                                  className="max-w-full max-h-[200px] rounded object-cover"
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                  }}
                                />
                              </div>
                            )}

                            {(embed.footer?.text || embed.timestamp) && (
                              <div className="text-[#72767d] text-[13px] mt-3 flex items-center gap-2 flex-wrap">
                                {embed.footer?.icon_url && (
                                  <img
                                    src={replaceKeywordsWithExamples(
                                      embed.footer.icon_url,
                                    )}
                                    alt=""
                                    className="w-5 h-5 rounded-full object-cover"
                                    onError={(e) => {
                                      (
                                        e.target as HTMLImageElement
                                      ).style.display = "none";
                                    }}
                                  />
                                )}
                                {embed.footer?.text && (
                                  <span>
                                    {replaceKeywordsWithExamples(
                                      embed.footer.text,
                                    )}
                                  </span>
                                )}
                                {embed.footer?.text && embed.timestamp && (
                                  <span>•</span>
                                )}
                                {embed.timestamp && (
                                  <span>
                                    {new Date(
                                      embed.timestamp,
                                    ).toLocaleDateString("en-US", {
                                      month: "2-digit",
                                      day: "2-digit",
                                      year: "numeric",
                                    })}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          {embed.thumbnail?.url && (
                            <div className="flex-shrink-0">
                              <img
                                src={replaceKeywordsWithExamples(
                                  embed.thumbnail.url,
                                )}
                                alt=""
                                className="w-20 h-20 rounded object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Stats */}
                  <div className="mt-4 p-4 bg-muted/20 rounded-lg border border-border/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" />
                      Preview Statistics
                    </h4>
                    <div className="text-xs text-muted-foreground space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Characters:</span>
                        <span
                          className={cn(
                            "font-bold",
                            totalCharacters > VALIDATION_RULES.totalCharacters
                              ? "text-destructive"
                              : "text-foreground",
                          )}
                        >
                          {totalCharacters}/{VALIDATION_RULES.totalCharacters}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Fields:</span>
                        <span
                          className={cn(
                            "font-bold",
                            embed.fields &&
                              embed.fields.length >= VALIDATION_RULES.maxFields
                              ? "text-destructive"
                              : "text-foreground",
                          )}
                        >
                          {embed.fields?.length || 0}/
                          {VALIDATION_RULES.maxFields}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Active Keywords:</span>
                        <span className="text-primary font-bold flex items-center gap-1">
                          <Code className="h-3 w-3" />
                          {
                            AVAILABLE_KEYWORDS.filter(
                              (k) =>
                                embed.title?.includes(k.key) ||
                                embed.description?.includes(k.key) ||
                                embed.footer?.text?.includes(k.key) ||
                                embed.author?.name?.includes(k.key) ||
                                embed.fields?.some(
                                  (f) =>
                                    f.name.includes(k.key) ||
                                    f.value.includes(k.key),
                                ),
                            ).length
                          }
                          / {AVAILABLE_KEYWORDS.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Validation:</span>
                        <span
                          className={cn(
                            hasValidationErrors
                              ? "text-destructive"
                              : "text-green-600",
                            "flex items-center gap-1 font-bold",
                          )}
                        >
                          {hasValidationErrors ? (
                            <>
                              <AlertCircle className="h-4 w-4" />
                              {errors.length}{" "}
                              {errors.length === 1 ? "Error" : "Errors"}
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4" />
                              Valid
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Save Bar - Only appears when there are changes */}
        {hasChanges && (
          <div className="border-t border-border bg-card/95 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    You have unsaved embed changes
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Save your embed configuration to apply changes
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={resetEmbed}
                  className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground touch-manipulation min-h-[44px] sm:min-h-[36px]"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={saveChanges}
                  disabled={hasValidationErrors}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] sm:min-h-[36px]"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Embed
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
