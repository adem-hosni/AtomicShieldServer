import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  HelpCircle,
  ExternalLink,
  Search,
  CheckCircle,
  MessageCircle,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function SupportPage() {
  const { t } = useLanguage();
  usePageTitle("Support");
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: "1",
      question: "How do I set up the protection system for my server?",
      answer:
        "First, purchase a license key from our website. After payment, open a Discord ticket with your invoice ID to receive your key. Then create an account on our platform, redeem your key, add your server details, and download the server script. Finally, configure the script with your server key and restart your server.",
      category: "setup",
    },
    {
      id: "2",
      question: "How do players download and install the protection client?",
      answer:
        "Players should visit our main website (atomic-shield.com) and click 'Download Now'. After downloading, they run the file, click 'Start Now', and wait for it to show 'Have Fun'. They can optionally enable startup mode for automatic launching.",
      category: "installation",
    },
    {
      id: "3",
      question:
        "What should I do if players can't connect to my protected server?",
      answer:
        "Make sure players have downloaded and started the protection client. The protection must be running in the background for players to connect to protected servers. If issues persist, they should restart the protection client.",
      category: "troubleshooting",
    },
    {
      id: "4",
      question: "My server key isn't working, what should I do?",
      answer:
        "Double-check that the key is copied correctly without extra spaces. Ensure your subscription is active and that the server information matches what you registered. Check the server console for any error messages.",
      category: "troubleshooting",
    },
    {
      id: "5",
      question: "How do I get my license key after purchase?",
      answer:
        "After purchasing, you won't receive the key immediately. Go to Discord, open a support ticket, and send the Table ID from your invoice. Our support team will verify your purchase and provide your license key.",
      category: "billing",
    },
    {
      id: "6",
      question: "Can I change my server IP after registration?",
      answer:
        "Yes, you can update your server information through your dashboard. Go to the Servers section, find your server, and update the details. You may need to restart your server after making changes.",
      category: "configuration",
    },
    {
      id: "7",
      question: "What are the response times for support?",
      answer:
        "Critical issues: 1-2 hours, General support: 4-8 hours, General questions: 12-24 hours. We provide 24/7 support through Discord and email.",
      category: "support",
    },
    {
      id: "8",
      question: "How do I update the protection system?",
      answer:
        "Updates are handled automatically for the client. For server scripts, check your dashboard for new versions and follow the update instructions. Always backup your configuration before updating.",
      category: "maintenance",
    },
  ];

  const filteredFAQ = faqItems.filter(
    (item) =>
      (selectedCategory === "all" || item.category === selectedCategory) &&
      (searchQuery === "" ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground flex items-center justify-center gap-2 sm:gap-3">
            <HelpCircle className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />
            Support Center
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
            Get help with setup, configuration, and troubleshooting. Our team is
            here to assist you 24/7.
          </p>
        </div>

        {/* Discord Support */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-purple-500/20 hover:border-purple-500/40 transition-colors">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg">
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                </div>
                Discord Support
              </CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground">
                Join our Discord server for real-time support and community
                help.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Real-time support chat</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Community help and tips</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Direct access to developers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>License key distribution</span>
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                  <strong>For license keys:</strong> Open a ticket with your
                  invoice Table ID after purchase.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white touch-manipulation min-h-11 sm:min-h-10"
                size="lg"
                onClick={() =>
                  window.open("https://discord.gg/atomic-shield", "_blank")
                }
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className="text-sm sm:text-base">
                  Join Discord Server
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Frequently Asked Questions
              </CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground">
                Find quick answers to common questions about setup and
                troubleshooting.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-border rounded-md bg-background text-foreground min-w-[160px]"
                >
                  <option value="all">All Categories</option>
                  <option value="setup">Setup</option>
                  <option value="installation">Installation</option>
                  <option value="troubleshooting">Troubleshooting</option>
                  <option value="billing">Billing</option>
                  <option value="configuration">Configuration</option>
                  <option value="support">Support</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              {/* FAQ Items */}
              <div className="space-y-3">
                {filteredFAQ.map((item) => (
                  <Card
                    key={item.id}
                    className="border border-border hover:border-primary/40 transition-colors"
                  >
                    <CardContent className="p-0">
                      <button
                        onClick={() =>
                          setExpandedFAQ(
                            expandedFAQ === item.id ? null : item.id,
                          )
                        }
                        className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-foreground">
                              {item.question}
                            </h4>
                          </div>
                          {expandedFAQ === item.id ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                      </button>
                      {expandedFAQ === item.id && (
                        <div className="px-4 pb-4 border-t bg-muted/20">
                          <p className="text-sm text-muted-foreground leading-relaxed pt-3">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Information */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Support Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Support Hours</h4>
                <p className="text-sm text-muted-foreground">
                  24/7 Support Available
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Response Times</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Critical Issues:</span>
                    <span className="text-red-500 font-medium">1-2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>General Support:</span>
                    <span className="text-yellow-500 font-medium">
                      4-8 hours
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="text-green-500 font-medium">
                      12-24 hours
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Discord Server</h4>
                <p className="text-sm text-muted-foreground">
                  Join for real-time support and license keys
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
