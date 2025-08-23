import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, X, Image, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadFieldProps {
  id: string;
  title: string;
  subtitle: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  preview?: boolean;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FileUploadField({
  id,
  title,
  subtitle,
  accept = "*/*",
  multiple = false,
  maxSize = 10,
  preview = false,
  value = "",
  onChange,
  className,
}: FileUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [previewUrl, setPreviewUrl] = useState<string>(value);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadStatus("error");
      console.error(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    setUploadStatus("uploading");

    // For image files, create preview
    if (preview && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setPreviewUrl(url);
        onChange(url);
        setUploadStatus("success");
        console.log(`File uploaded for ${id}:`, file.name);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, just return the file name
      onChange(file.name);
      setUploadStatus("success");
      console.log(`File uploaded for ${id}:`, file.name);
    }

    // Reset status after 2 seconds
    setTimeout(() => setUploadStatus("idle"), 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const clearFile = () => {
    setPreviewUrl("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">{title}</Label>
      </div>

      {/* Upload Area */}
      <Card
        className={cn(
          "relative border-2 border-dashed transition-all duration-200 cursor-pointer group",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          uploadStatus === "success" && "border-green-500 bg-green-500/5",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="p-6 text-center">
          {previewUrl && preview ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="mx-auto max-h-32 rounded-lg object-cover"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                {uploadStatus === "uploading" ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                ) : uploadStatus === "success" ? (
                  <Check className="h-6 w-6 text-green-500" />
                ) : preview ? (
                  <Image className="h-6 w-6 text-primary" />
                ) : (
                  <Upload className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {uploadStatus === "uploading"
                    ? "Uploading..."
                    : uploadStatus === "success"
                      ? "Upload successful!"
                      : value
                        ? "File selected: " + value.split("/").pop()
                        : "Drop file here or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max size: {maxSize}MB
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
