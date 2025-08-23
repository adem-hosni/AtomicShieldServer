import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  BookOpen,
  Search,
  ExternalLink,
  Download,
  Play,
  Code,
  Settings,
  Shield,
  Users,
  FileText,
  Zap,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Clock,
  Server,
  UserCheck,
  Globe,
  Key,
  Database,
  Monitor,
  HelpCircle,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: DocArticle[];
  category: "player" | "server" | "general";
}

interface DocArticle {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  readTime: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  lastUpdated: string;
}

export function DocumentationPage() {
  const { t } = useLanguage();
  usePageTitle("Documentation");
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<
    "player" | "server" | "general"
  >("player");
  const [showKey, setShowKey] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const docSections: DocSection[] = [
    // PLAYER DOCUMENTATION
    {
      id: "player-setup",
      title: "Player Connection Guide",
      description: "How players can connect and use the protection system",
      icon: <UserCheck className="h-5 w-5" />,
      category: "player",
      articles: [
        {
          id: "player-download",
          title: "Download & Installation",
          description:
            "Step-by-step guide to download and install the protection client",
          readTime: "3 min",
          difficulty: "beginner",
          lastUpdated: "2024-01-15",
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Download className="h-5 w-5 text-cyan-600" />
                  Download Process
                </h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="bg-cyan-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div>
                      <strong>Visit the main website:</strong>
                      <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded border">
                        <code className="text-cyan-600">
                          https://atomic-shield.com/
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-6 w-6 p-0"
                          onClick={() =>
                            copyToClipboard("https://atomic-shield.com/")
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-cyan-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div>
                      <strong>Click "Download Now" button</strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        The download button is prominently displayed on the
                        homepage
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-cyan-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div>
                      <strong>Save the file to your computer</strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Choose a location you can easily find later
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Play className="h-5 w-5 text-green-600" />
                  First Time Setup
                </h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div>
                      <strong>Open the downloaded protection file</strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Double-click the downloaded file to launch the
                        application
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div>
                      <strong>Click "Start Now"</strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        This will initialize the protection system
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div>
                      <strong>Wait for the system to load</strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        When loaded, it will show "Have Fun". You can now close
                        the loader
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-amber-600" />
                  Startup Mode (Optional)
                </h3>
                <div className="space-y-3 text-sm">
                  <p>
                    <strong>Enable Startup Mode:</strong> If you want the
                    protection to start automatically when you open your PC
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Skip Startup Mode:</strong> If you not enable it,
                    you need to open the protection manually when you start your
                    PC (recommended for most users)
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "player-usage",
          title: "Using the Protection System",
          description: "How to use the protection client effectively",
          readTime: "2 min",
          difficulty: "beginner",
          lastUpdated: "2024-01-15",
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-blue-600" />
                  Normal Operation
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    The protection runs automatically in the background
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    You can play as normal - no interruption to gameplay
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    The system protects you from malicious threats automatically
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                  Important Notes
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                    <span>
                      Keep the protection running while playing on protected
                      servers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                    <span>
                      Don't attempt to disable or modify the protection system
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                    <span>
                      Contact server administrators if you experience any issues
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          ),
        },
      ],
    },

    // SERVER DOCUMENTATION
    {
      id: "server-setup",
      title: "Server Owner Setup",
      description: "Complete setup guide for server administrators",
      icon: <Server className="h-5 w-5" />,
      category: "server",
      articles: [
        {
          id: "purchase-setup",
          title: "Purchase & Account Setup",
          description: "How to purchase a license and set up your account",
          readTime: "5 min",
          difficulty: "beginner",
          lastUpdated: "2024-01-15",
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Key className="h-5 w-5 text-green-600" />
                  Purchase Process
                </h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div>
                      <strong>Visit the website to buy a key:</strong>
                      <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded border">
                        <code className="text-green-600">website buy key</code>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div>
                      <strong>
                        After payment, you won't receive the key immediately
                      </strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Don't worry - this is normal and part of the security
                        process
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div>
                      <strong>
                        Go to Discord → Open Ticket → Send TabeID of Invoice
                      </strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Our support team will verify your purchase and provide
                        your key
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  Account Creation
                </h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div>
                      <strong>Go to main website:</strong>
                      <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded border">
                        <code className="text-blue-600">atomic-shield.com</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-6 w-6 p-0"
                          onClick={() => copyToClipboard("atomic-shield.com")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div>
                      <strong>Create an account</strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Use the same email address you used for purchasing
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Key Activation
                </h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div>
                      <strong>Go to Subscription section</strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Navigate to the subscription management area in your
                        dashboard
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div>
                      <strong>Click "Redeem Key"</strong>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div>
                      <strong>Put your key for active subscription</strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Enter the key you received from Discord support
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          ),
        },
        {
          id: "server-configuration",
          title: "Server Configuration",
          description: "Configure your server with the protection system",
          readTime: "8 min",
          difficulty: "intermediate",
          lastUpdated: "2024-01-15",
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-600" />
                  Server Registration
                </h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div>
                      <strong>Go to Servers section</strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Navigate to the servers management area in your
                        dashboard
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div>
                      <strong>Click "Add Server"</strong>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div>
                      <strong>Put your server information:</strong>
                      <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                        <li>
                          • <strong>IP:</strong> Your server's IP address
                        </li>
                        <li>
                          • <strong>NAME:</strong> Your server's display name
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <div>
                      <strong>Copy the generated server key</strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        You'll need this key for the next step
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Download className="h-5 w-5 text-orange-600" />
                  Quick Setup Download
                </h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div>
                      <strong>
                        Go to "Quick Setup Download Anticheat Script"
                      </strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        This will download the server-side protection files
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div>
                      <strong>Add the script to your resources folder</strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Extract and place the protection script in your server's
                        resources directory
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div>
                      <strong>Remember to ensure it in your server.cfg</strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Add the ensure line to make sure the resource starts
                        with your server
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <div>
                      <strong>Open fxmanifest and replace your key</strong>
                      <div className="mt-2 p-3 bg-gray-900 rounded border">
                        <code className="text-orange-400 text-xs">
                          -- Replace 'YOUR_SERVER_KEY_HERE' with your actual
                          server key
                          <br />
                          Config.ServerKey = "YOUR_SERVER_KEY_HERE"
                        </code>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Final Steps
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Restart your server to apply the protection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Monitor the console for successful initialization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Your server is now protected!
                  </li>
                </ul>
              </div>
            </div>
          ),
        },
      ],
    },

    // GENERAL DOCUMENTATION
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      description: "Common issues and their solutions",
      icon: <HelpCircle className="h-5 w-5" />,
      category: "general",
      articles: [
        {
          id: "common-issues",
          title: "Common Issues",
          description: "Solutions for frequently encountered problems",
          readTime: "10 min",
          difficulty: "beginner",
          lastUpdated: "2024-01-15",
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Connection Issues
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong>Problem:</strong> Can't connect to protected server
                    <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                      <p>
                        • Make sure you have downloaded and started the
                        protection client
                      </p>
                      <p>
                        • Verify the protection is running in the background
                      </p>
                      <p>• Restart the protection client and try again</p>
                    </div>
                  </div>
                  <div>
                    <strong>Problem:</strong> Protection won't start
                    <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                      <p>• Check if you have administrative privileges</p>
                      <p>• Disable antivirus temporarily during installation</p>
                      <p>• Re-download the client from the official website</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-amber-600" />
                  Server Configuration Issues
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong>Problem:</strong> Server key not working
                    <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                      <p>
                        • Double-check the key is copied correctly (no extra
                        spaces)
                      </p>
                      <p>• Ensure your subscription is active</p>
                      <p>
                        • Verify server information matches what you registered
                      </p>
                    </div>
                  </div>
                  <div>
                    <strong>Problem:</strong> Protection not loading on server
                    <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                      <p>• Check server console for error messages</p>
                      <p>
                        • Ensure the resource is properly added to server.cfg
                      </p>
                      <p>• Verify file permissions are correct</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  Getting Additional Help
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                    <span>Join our Discord server for live support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span>
                      Create a support ticket with detailed information
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-blue-500" />
                    <span>
                      Include console logs and error messages when reporting
                      issues
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
  ];

  const filteredSections = docSections
    .filter((section) => section.category === activeCategory)
    .map((section) => ({
      ...section,
      articles: section.articles.filter(
        (article) =>
          searchQuery === "" ||
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((section) => section.articles.length > 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const selectedArticleData = selectedArticle
    ? docSections
        .flatMap((s) => s.articles)
        .find((a) => a.id === selectedArticle)
    : null;

  if (selectedArticle && selectedArticleData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Navigation */}
          <Button
            variant="ghost"
            onClick={() => setSelectedArticle(null)}
            className="mb-4"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Documentation
          </Button>

          {/* Article Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {selectedArticleData.title}
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">
                    {selectedArticleData.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getDifficultyColor(selectedArticleData.difficulty)}`}
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {selectedArticleData.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • {selectedArticleData.readTime}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>{selectedArticleData.content}</CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
            <BookOpen className="h-10 w-10 text-primary" />
            Documentation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive guides for players and server administrators to get
            the most out of your protection platform.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={activeCategory === "player" ? "default" : "ghost"}
              onClick={() => setActiveCategory("player")}
              className="rounded-md"
            >
              <Users className="h-4 w-4 mr-2" />
              For Players
            </Button>
            <Button
              variant={activeCategory === "server" ? "default" : "ghost"}
              onClick={() => setActiveCategory("server")}
              className="rounded-md"
            >
              <Server className="h-4 w-4 mr-2" />
              For Server Owners
            </Button>
            <Button
              variant={activeCategory === "general" ? "default" : "ghost"}
              onClick={() => setActiveCategory("general")}
              className="rounded-md"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              General Help
            </Button>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="space-y-6">
          {filteredSections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  {section.icon}
                  {section.title}
                </CardTitle>
                <p className="text-muted-foreground">{section.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.articles.map((article) => (
                    <Card
                      key={article.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedArticle(article.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-foreground">
                              {article.title}
                            </h4>
                            <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          </div>

                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {article.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${getDifficultyColor(article.difficulty)}`}
                              />
                              <span className="text-xs text-muted-foreground capitalize">
                                {article.difficulty}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {article.readTime}
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Updated {article.lastUpdated}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status Indicator */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Documentation is up to date
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
