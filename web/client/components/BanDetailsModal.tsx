import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createCopyHandler } from "@/lib/copy-utils";
import {
  Copy,
  User,
  Shield,
  Clock,
  Calendar,
  FileText,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { BanRecord } from "@shared/api";

interface BanDetailsModalProps {
  ban: BanRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

// Utility function to construct full evidence URLs
const getEvidenceUrl = (
  evidenceUrl: string | null | undefined,
): string | null => {
  if (!evidenceUrl) return null;

  // If it's already a full URL, return as is
  if (evidenceUrl.startsWith("http://") || evidenceUrl.startsWith("https://")) {
    return evidenceUrl;
  }

  // Construct full URL based on environment
  const baseUrl = import.meta.env.PROD
    ? "https://atomicshield.com" // Production URL
    : window.location.origin; // Development URL (http://localhost:8080 etc)

  return `${baseUrl}${evidenceUrl}`;
};

export function BanDetailsModal({
  ban,
  isOpen,
  onClose,
}: BanDetailsModalProps) {
  const { toast } = useToast();
  const handleCopy = createCopyHandler(toast);

  if (!ban) return null;

  const evidenceUrl = getEvidenceUrl(ban.evidenceUrl);

  const copyableFields = [
    {
      label: "Ban ID",
      value: ban.banId || ban.id,
      icon: <FileText className="h-4 w-4" />,
    },
    {
      label: "Player Name",
      value: ban.playerName,
      icon: <User className="h-4 w-4" />,
    },
    {
      label: "Steam ID / Player ID",
      value: ban.playerId || ban.steamId || "No Steam ID",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      label: "Reason",
      value: ban.reason,
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      label: "Date Banned",
      value: ban.bannedAt,
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      label: "First Join Date",
      value: ban.firstJoin,
      icon: <Clock className="h-4 w-4" />,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Eye className="h-6 w-6 text-primary" />
            Ban Details - {ban.banId || ban.id}
          </DialogTitle>
          <DialogDescription>
            Complete ban information with copy-to-clipboard functionality
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Player Information */}
          <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Player Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-lg font-medium">
                    {ban.playerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-lg">{ban.playerName}</div>
                  <div className="text-sm text-muted-foreground">
                    {ban.playerId || ban.steamId || "No Steam ID"}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {copyableFields.slice(1, 3).map((field) => (
                  <div
                    key={field.label}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {field.icon}
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {field.label}
                        </div>
                        <div className="font-medium">{field.value}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(field.value, field.label)}
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      First Join Date
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{ban.firstJoin}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCopy(ban.firstJoin, "First Join Date")
                      }
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ban Information */}
          <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-destructive" />
                Ban Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Ban ID
                      </div>
                      <div className="font-mono font-medium">
                        {ban.banId || ban.id}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(ban.banId || ban.id, "Ban ID")}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Reason
                      </div>
                      <div className="font-medium">{ban.reason}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(ban.reason, "Ban Reason")}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Date Banned
                      </div>
                      <div className="font-medium">{ban.bannedAt}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(ban.bannedAt, "Ban Date")}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="destructive"
                      className="bg-destructive/20 text-destructive border-destructive/30"
                    >
                      {ban.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(ban.status, "Status")}
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      Evidence
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {ban.evidence ? "Yes" : "No"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCopy(ban.evidence ? "Yes" : "No", "Evidence")
                      }
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evidence Section - Full Width */}
        <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5 text-primary" />
              Evidence & Screenshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`bg-secondary/20 border border-border rounded-lg p-4 flex items-center justify-center ${
                ban.evidence && evidenceUrl ? "min-h-48" : "min-h-24"
              }`}
            >
              {ban.evidence && evidenceUrl ? (
                <div className="w-full space-y-3">
                  <img
                    src={evidenceUrl}
                    alt="Ban Evidence"
                    className="w-full h-auto max-h-64 object-contain rounded-lg border border-border/50"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallbackDiv = e.currentTarget
                        .nextElementSibling as HTMLElement;
                      if (fallbackDiv) fallbackDiv.style.display = "block";
                    }}
                  />
                  <div className="text-center space-y-1 hidden">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto">
                      <Eye className="h-6 w-6" />
                    </div>
                    <div className="font-medium text-sm">
                      Evidence Image Failed to Load
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {evidenceUrl}
                    </div>
                  </div>
                </div>
              ) : ban.evidence ? (
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto">
                    <Eye className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      Screenshot Available
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Evidence captured for this ban (URL not available)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="text-muted-foreground text-sm">
                    No evidence available
                  </div>
                  <div className="text-xs text-muted-foreground">
                    No screenshot was captured for this ban
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-primary/20">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-primary/20 hover:bg-primary/10"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              const allData = copyableFields
                .map((f) => `${f.label}: ${f.value}`)
                .join("\n");
              handleCopy(allData, "All Ban Details");
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
