import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ModeratorInviteData } from "@shared/api";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Users,
  Eye,
  Ban,
  FileText,
  Settings,
  Webhook,
  Map,
  Video,
} from "lucide-react";

const permissionIcons: Record<string, React.ReactNode> = {
  view_dashboard: <Eye className="h-4 w-4" />,
  view_analytics: <Shield className="h-4 w-4" />,
  kick_players: <UserCheck className="h-4 w-4" />,
  ban_players: <Ban className="h-4 w-4" />,
  view_player_logs: <FileText className="h-4 w-4" />,
  manage_config: <Settings className="h-4 w-4" />,
  webhook_settings: <Webhook className="h-4 w-4" />,
  view_map: <Map className="h-4 w-4" />,
  view_streams: <Video className="h-4 w-4" />,
  manage_moderators: <Users className="h-4 w-4" />,
};

const permissionLabels: Record<string, string> = {
  view_dashboard: "View Dashboard",
  view_analytics: "View Analytics",
  kick_players: "Kick Players",
  ban_players: "Ban Players",
  view_player_logs: "View Player Logs",
  manage_config: "Manage Configuration",
  webhook_settings: "Webhook Settings",
  manage_moderators: "Manage Moderators",
};

export function AcceptInvite() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [inviteData, setInviteData] = useState<ModeratorInviteData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    const fetchInviteData = async () => {
      if (!token) {
        setError("Invalid invite link");
        setLoading(false);
        return;
      }

      try {
        // Simulate API call to validate token and get invite data
        const response = await api.moderators.fetchModeratorInviteData(token);
        if (response.success) {
          setInviteData(response.data);
        } else {
          setError(response.message);
        }

        // In real app, this would validate the token with API
      } catch (err) {
        setError("Failed to load invite details");
      } finally {
        setLoading(false);
      }
    };

    fetchInviteData();
  }, [token]);

  const handleAcceptInvite = async () => {
    if (!inviteData) return;

    setAccepting(true);
    try {
      // Simulate API call to accept invite
      const response = api.moderators.markInvite(token, true);
      if (!response.success) {
        toast("Invite accepted successfully! Welcome to the team.");
        navigate("/");
      } else {
        setError(response.message);
        toast({
          title: "Invite Accept Error",
          description: response.message || "Failed to accept invite",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Invite Accept Error",
        description: "Failed to accept invite",
        variant: "destructive",
      });
      setError("Failed to accept invite. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  const handleDeclineInvite = async () => {
    if (!inviteData) return;

    setDeclining(true);
    try {
      // Simulate API call to accept invite
      const response = await api.moderators.markInvite(token, false);
      if (response.success) {
        toast("Invite decline successfully! Welcome to the team.");
        navigate("/");
      } else {
        setError(response.message);
        toast({
          title: "Invite Decline Error",
          description: response.message || "Failed to decmone invite",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Invite Decline Error",
        description: "Failed to decline invite",
        variant: "destructive",
      });
      setError("Failed to decline invite. Please try again.");
    } finally {
      setDeclining(false);
    }
  };

  const isExpired = inviteData
    ? new Date(inviteData.expiresAt) < new Date()
    : false;
  const canAccept = inviteData && !isExpired && inviteData.status === "pending";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-background/95 backdrop-blur-xl border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading invite details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-background/95 backdrop-blur-xl border-red-500/20">
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invalid Invite</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="border-primary/20"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_26%,transparent_27%)] bg-[length:40px_40px] animate-pulse" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              AtomicShield Invite
            </h1>
            <p className="text-muted-foreground mt-2">
              You've been invited to join as a moderator
            </p>
          </div>

          {/* Main Invite Card */}
          <Card className="bg-background/95 backdrop-blur-xl border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Moderator Invitation
                {isExpired ? (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 ml-auto">
                    <Clock className="h-3 w-3 mr-1" />
                    Expired
                  </Badge>
                ) : (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Inviter Info */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <Avatar className="h-12 w-12 border-2 border-primary/30">
                  <AvatarImage src={inviteData.inviterAvatar} />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    {inviteData.inviterName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{inviteData.inviterName}</div>
                  <div className="text-sm text-primary">
                    invited you to join {inviteData.serverName}
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Granted Permissions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inviteData.permissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-primary/20"
                    >
                      <div className="p-1 rounded bg-primary/20 text-primary">
                        {permissionIcons[permission] || (
                          <Shield className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {permissionLabels[permission] ||
                          permission.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expiry Info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-muted/20 border border-primary/10">
                <Clock className="h-4 w-4" />
                <span>
                  {isExpired
                    ? "Expired Invite"
                    : "This invite expires on " + inviteData.expiresAt}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {canAccept ? (
                  <>
                    <Button
                      onClick={handleAcceptInvite}
                      disabled={accepting}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {accepting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Invitation
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleDeclineInvite}
                      disabled={declining || accepting}
                      variant="outline"
                      className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      {declining ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Declining...
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Decline
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                      <AlertTriangle className="h-5 w-5" />
                      <span>This invitation is no longer available</span>
                    </div>
                    <Button
                      onClick={() => navigate("/")}
                      variant="outline"
                      className="border-primary/20"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              This invitation was sent by {inviteData.inviterName} for{" "}
              {inviteData.serverName}
            </p>
            <p className="mt-1">
              If you didn't expect this invitation, you can safely ignore it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
