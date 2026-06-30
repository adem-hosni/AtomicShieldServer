import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Download, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDownloadFieldProps {
  id: string;
  title: string;
  subtitle: string;
  data: any;
  filename: string;
  mimeType?: string;
  className?: string;
}

export function FileDownloadField({
  id,
  title,
  subtitle,
  data,
  filename,
  mimeType = "application/json",
  className,
}: FileDownloadFieldProps) {
  const [downloadStatus, setDownloadStatus] = React.useState<
    "idle" | "downloading" | "success"
  >("idle");

  const handleDownload = () => {
    try {
      setDownloadStatus("downloading");

      const content =
        typeof data === "string" ? data : JSON.stringify(data, null, 2);
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setDownloadStatus("success");
      console.log(`Configuration exported as ${filename}`);

      // Reset status after 2 seconds
      setTimeout(() => setDownloadStatus("idle"), 2000);
    } catch (error) {
      console.error("Export failed:", error);
      setDownloadStatus("idle");
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">{title}</Label>
      </div>

      <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-all duration-200">
        <div className="p-6 text-center">
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              {downloadStatus === "downloading" ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
              ) : downloadStatus === "success" ? (
                <Check className="h-6 w-6 text-green-500" />
              ) : (
                <FileText className="h-6 w-6 text-primary" />
              )}
            </div>

            <div>
              <p className="text-sm font-medium mb-2">
                {downloadStatus === "downloading"
                  ? "Preparing download..."
                  : downloadStatus === "success"
                    ? "Downloaded successfully!"
                    : "Ready to export configuration"}
              </p>

              <Button
                onClick={handleDownload}
                disabled={downloadStatus === "downloading"}
                className="flex items-center gap-2"
                size="sm"
              >
                <Download className="h-4 w-4" />
                Export as {filename.split(".").pop()?.toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
