import React from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { AtomicNavbar } from "@/components/AtomicNavbar";
import {
  Shield,
  Lock,
  Eye,
  Database,
  CheckCircle,
  AlertTriangle,
  Monitor,
  HardDrive,
  Cpu,
  Wifi,
  FileCheck,
  AlertCircle,
  Globe,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PrivacyPolicy = () => {
  usePageTitle("Privacy Policy");
  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.12)_1px,transparent_1px)] bg-[size:50px_50px]"
          style={{
            animation: "grid-move 20s linear infinite",
          }}
        />
      </div>

      {/* Glowing Orbs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 flex justify-center">
        <AtomicNavbar />
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/30 rounded-full px-6 py-3 backdrop-blur-xl shadow-lg shadow-cyan-500/10 mb-8 group hover:shadow-cyan-500/20 transition-all duration-300">
              <div className="relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fded3bb25d27f4acca47097c7c5d9349e%2F9c3bb44456604be2871a4b72bb7f176b?format=webp&width=800"
                  alt="AtomicShield Logo"
                  className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-md"
                />
                <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-sm opacity-50" />
              </div>
              <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-300 transition-all duration-300">
                Privacy Policy
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                Privacy &
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent glow-text">
                Data Collection
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
              AtomicShield is a client-side anti-cheat system that runs on your
              computer before you join FiveM servers. This policy details
              exactly what information we collect and how we use it to maintain
              fair gaming.
            </p>
          </div>

          {/* Important Notice */}
          <div className="mb-12">
            <Card className="bg-gradient-to-br from-red-950/50 to-orange-950/30 backdrop-blur-2xl border border-red-400/30 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="h-8 w-8 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Important Notice
                    </h2>
                    <div className="space-y-3 text-gray-300">
                      <p className="text-lg">
                        <strong className="text-red-400">
                          AtomicShield requires constant internet connection
                        </strong>{" "}
                        and cannot be used offline. The software establishes a
                        WebSocket connection only when FiveM is running and
                        disconnects when FiveM closes.
                      </p>
                      <p className="text-lg">
                        <strong className="text-orange-400">
                          Data collection cannot be disabled.
                        </strong>{" "}
                        All collected data is essential for anti-cheat
                        functionality. By using AtomicShield, you consent to the
                        data collection described below.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-8">
            {/* System Information Collection */}
            <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-cyan-400/20 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Monitor className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold text-white">
                    System Information Collection
                  </h2>
                </div>
                <div className="space-y-6 text-gray-300">
                  <p className="text-lg">
                    AtomicShield collects specific system information to create
                    unique hardware identifiers (HWIDs) for anti-cheat purposes.
                    This data helps prevent ban evasion and ensures fair
                    gameplay.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 bg-cyan-400/10 rounded-lg border border-cyan-400/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <Cpu className="h-6 w-6 text-cyan-400" />
                        <h3 className="text-lg font-semibold text-white">
                          Hardware Identifiers
                        </h3>
                      </div>
                      <ul className="space-y-2 text-cyan-300">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>System hardware specifications</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Unique hardware component identifiers</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>System configuration fingerprints</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Connected device information</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Hardware compatibility data</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 bg-purple-400/10 rounded-lg border border-purple-400/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <Globe className="h-6 w-6 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">
                          Network & System Data
                        </h3>
                      </div>
                      <ul className="space-y-2 text-purple-300">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Computer IP address</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Computer name</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Username</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>System configuration details</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-400/20">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-2">
                          Why We Collect This Data
                        </h4>
                        <p className="text-blue-300 text-sm">
                          Hardware identifiers create unique fingerprints for
                          each system, making it extremely difficult for banned
                          users to evade restrictions by creating new accounts.
                          This ensures long-term security and maintains fair
                          play across all servers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Scanning */}
            <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-orange-400/20 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <FileCheck className="h-6 w-6 text-orange-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Security Scanning & System Analysis
                  </h2>
                </div>
                <div className="space-y-6 text-gray-300">
                  <p className="text-lg">
                    AtomicShield performs comprehensive security analysis to
                    detect potential cheat tools and system vulnerabilities that
                    could compromise game integrity.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 bg-orange-400/10 rounded-lg border border-orange-400/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <HardDrive className="h-6 w-6 text-orange-400" />
                        <h3 className="text-lg font-semibold text-white">
                          File System Analysis
                        </h3>
                      </div>
                      <ul className="space-y-2 text-orange-300">
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>
                            Scans game-related directories for unauthorized
                            modifications
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>
                            Detects suspicious file modifications and injections
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>
                            Monitors for unauthorized third-party plugins
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 bg-red-400/10 rounded-lg border border-red-400/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <Lock className="h-6 w-6 text-red-400" />
                        <h3 className="text-lg font-semibold text-white">
                          System Security Analysis
                        </h3>
                      </div>
                      <ul className="space-y-2 text-red-300">
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Analyzes system security configurations</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Monitors system integrity settings</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Detects potentially malicious software</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Identifies security bypass attempts</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg border border-red-400/20">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-6 w-6 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">
                          Security Risk Detection
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-red-300 mb-2">
                              Security Risks Monitored:
                            </h4>
                            <ul className="text-sm text-red-300 space-y-1">
                              <li>• Compromised system security settings</li>
                              <li>• Unauthorized system modifications</li>
                              <li>• Suspicious software installations</li>
                              <li>• System integrity bypasses</li>
                              <li>• Potential cheat-enabling configurations</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-orange-300 mb-2">
                              Why This Matters:
                            </h4>
                            <p className="text-sm text-orange-300">
                              Certain system configurations and software can
                              enable sophisticated cheating methods that bypass
                              standard protection measures. Our analysis helps
                              maintain fair gameplay for all users.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FiveM Monitoring & Connection */}
            <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-green-400/20 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Eye className="h-6 w-6 text-green-400" />
                  <h2 className="text-2xl font-bold text-white">
                    FiveM Monitoring & Connection Management
                  </h2>
                </div>
                <div className="space-y-6 text-gray-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 bg-green-400/10 rounded-lg border border-green-400/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <Wifi className="h-6 w-6 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">
                          Smart Connection System
                        </h3>
                      </div>
                      <ul className="space-y-2 text-green-300">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            WebSocket connection activates only when FiveM
                            starts
                          </span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            Automatically disconnects when FiveM closes
                          </span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Requires constant internet connection</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            No background monitoring when FiveM is not running
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 bg-blue-400/10 rounded-lg border border-blue-400/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <Database className="h-6 w-6 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">
                          FiveM Monitoring
                        </h3>
                      </div>
                      <ul className="space-y-2 text-blue-300">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Monitors only FiveM processes</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Detects unauthorized modifications</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Real-time cheat detection</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Game integrity verification</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-400/20">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-2">
                          Privacy Protection
                        </h4>
                        <p className="text-cyan-300 text-sm">
                          AtomicShield only monitors FiveM when it's running. We
                          do not access other applications, personal files, or
                          system data unrelated to FiveM. The connection is
                          fully encrypted and automatically terminates when
                          you're not gaming.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Transmission & Usage */}
            <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-purple-400/20 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Database className="h-6 w-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Data Transmission & Usage
                  </h2>
                </div>
                <div className="space-y-6 text-gray-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 bg-purple-400/10 rounded-lg border border-purple-400/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <Globe className="h-6 w-6 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">
                          Data Sent to Servers
                        </h3>
                      </div>
                      <ul className="space-y-2 text-purple-300">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Player IP address</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Hardware identification (HWID) data</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Detection results and security flags</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>System security status</span>
                        </li>
                      </ul>
                      <div className="mt-4 p-3 bg-purple-500/20 rounded border border-purple-400/30">
                        <p className="text-xs text-purple-200">
                          <strong>Note:</strong> Only essential anti-cheat data
                          is transmitted. Personal files and private information
                          are never sent to our servers.
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-indigo-400/10 rounded-lg border border-indigo-400/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <Shield className="h-6 w-6 text-indigo-400" />
                        <h3 className="text-lg font-semibold text-white">
                          Data Usage
                        </h3>
                      </div>
                      <ul className="space-y-2 text-indigo-300">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Anti-cheat detection and prevention</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Ban enforcement and evasion prevention</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Security system improvements</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>False positive reduction</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-lg border border-red-400/20">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-6 w-6 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">
                          No Third-Party Data Sharing
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-green-300 mb-2">
                              ✅ We DO NOT Share Data With:
                            </h4>
                            <ul className="text-sm text-green-300 space-y-1">
                              <li>• Game developers or publishers</li>
                              <li>• Server owners or administrators</li>
                              <li>• Marketing companies</li>
                              <li>• Data brokers or analytics services</li>
                              <li>• Any external third parties</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-red-300 mb-2">
                              ⚠️ Data Usage Restrictions:
                            </h4>
                            <p className="text-sm text-red-300">
                              All collected data is used exclusively for
                              AtomicShield's anti-cheat functionality. Data
                              cannot be disabled or opted out of, as it is
                              essential for the system's operation.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention & Rights */}
            <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-amber-400/20 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Clock className="h-6 w-6 text-amber-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Data Retention & User Rights
                  </h2>
                </div>
                <div className="space-y-6 text-gray-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 bg-amber-400/10 rounded-lg border border-amber-400/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <Database className="h-6 w-6 text-amber-400" />
                        <h3 className="text-lg font-semibold text-white">
                          Data Storage
                        </h3>
                      </div>
                      <ul className="space-y-2 text-amber-300">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Hardware identifiers stored indefinitely</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            Detection logs retained for security analysis
                          </span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Ban records maintained permanently</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Encrypted storage with secure protocols</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 bg-red-400/10 rounded-lg border border-red-400/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                        <h3 className="text-lg font-semibold text-white">
                          User Limitations
                        </h3>
                      </div>
                      <ul className="space-y-2 text-red-300">
                        <li className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>No opt-out options for data collection</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>
                            Cannot disable specific monitoring features
                          </span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>All data collection is mandatory</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Continued use requires data consent</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-400/20">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      What You Can Do
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-blue-300 mb-3">
                          Available Rights:
                        </h4>
                        <ul className="space-y-2 text-blue-300">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>
                              Request information about your stored data
                            </span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>
                              Contact support for data-related questions
                            </span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>Stop using the service at any time</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-cyan-300 mb-3">
                          Important Note:
                        </h4>
                        <p className="text-cyan-300 text-sm">
                          Due to the security-critical nature of anti-cheat
                          systems, certain data (especially ban records and
                          hardware identifiers) cannot be deleted as this would
                          compromise the integrity of the anti-cheat system.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GDPR & European Privacy Compliance */}
            <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-blue-400/20 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Globe className="h-6 w-6 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">
                    GDPR & European Privacy Rights
                  </h2>
                </div>
                <div className="space-y-6 text-gray-300">
                  <p className="text-lg">
                    For users in the European Union, European Economic Area, and
                    other regions with similar privacy laws, AtomicShield
                    complies with applicable data protection regulations
                    including GDPR.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-400/10 rounded-lg border border-blue-400/20">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Legal Basis for Processing
                      </h3>
                      <div className="space-y-3 text-blue-300">
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">
                              Legitimate Interest:
                            </span>
                            <span className="text-sm block">
                              Preventing cheating and maintaining fair gameplay
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Consent:</span>
                            <span className="text-sm block">
                              You explicitly consent by installing and using our
                              software
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">
                              Contract Performance:
                            </span>
                            <span className="text-sm block">
                              Necessary for providing anti-cheat services
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-green-400/10 rounded-lg border border-green-400/20">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Your European Rights
                      </h3>
                      <ul className="space-y-2 text-green-300">
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            Right to information about data processing
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            Right to access your personal data
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-400" />
                          <span className="text-sm">
                            Right to rectification (limited due to security
                            requirements)
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-400" />
                          <span className="text-sm">
                            Right to erasure (restricted for anti-cheat
                            integrity)
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            Right to lodge complaints with supervisory
                            authorities
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-400/20">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-6 w-6 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">
                          Important GDPR Limitations
                        </h3>
                        <div className="space-y-4">
                          <p className="text-purple-300 text-sm">
                            While we respect your European privacy rights,
                            certain rights may be limited due to the
                            security-critical nature of anti-cheat systems:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-yellow-300 mb-2">
                                ⚠️ Restricted Rights:
                              </h4>
                              <ul className="text-sm text-yellow-300 space-y-1">
                                <li>
                                  • Data erasure (would compromise security)
                                </li>
                                <li>• Data portability (security risk)</li>
                                <li>
                                  • Processing restrictions (would disable
                                  protection)
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-green-300 mb-2">
                                ✅ Available Rights:
                              </h4>
                              <ul className="text-sm text-green-300 space-y-1">
                                <li>• Information and access requests</li>
                                <li>• Complaint filing</li>
                                <li>
                                  • Withdrawal of consent (by uninstalling)
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-400/20">
                    <div className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-2">
                          Data Protection Officer Contact
                        </h4>
                        <p className="text-blue-300 text-sm">
                          For GDPR-related inquiries, data subject requests, or
                          privacy concerns from European users, please contact
                          our Data Protection Officer at:{" "}
                          <strong>dpo@atomicshield.com</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal & Compliance */}
            <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-slate-400/20 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-6 w-6 text-slate-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Legal Basis & General Compliance
                  </h2>
                </div>
                <div className="space-y-6 text-gray-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-400/10 rounded-lg border border-slate-400/20">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Consent & Agreement
                      </h3>
                      <p className="text-slate-300 mb-4">
                        By installing and using AtomicShield, you provide
                        explicit consent for all data collection activities
                        described in this policy. This consent is required for
                        the software to function.
                      </p>
                      <div className="space-y-2 text-slate-300">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">
                            Installation constitutes consent
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">
                            Continued use maintains consent
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">
                            Uninstalling withdraws consent
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gray-400/10 rounded-lg border border-gray-400/20">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Age Requirements
                      </h3>
                      <p className="text-gray-300 mb-4">
                        AtomicShield can be used by individuals of all ages.
                        Users under 16 (or the applicable age of digital consent
                        in their jurisdiction) should ensure parental consent
                        and awareness.
                      </p>
                      <div className="space-y-2 text-gray-300">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">
                            Parental consent required for minors
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">
                            Compliance with local age requirements
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/20">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Updates to This Policy
                    </h3>
                    <p className="text-gray-300 mb-4">
                      This privacy policy may be updated to reflect changes in
                      our data collection practices or legal requirements.
                      Material changes will be communicated with appropriate
                      notice.
                    </p>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-300 text-sm">
                        We recommend reviewing this policy periodically.
                        Continued use after updates constitutes acceptance of
                        the revised terms.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-cyan-400/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Privacy Questions & Support
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                If you have questions about this privacy policy, our data
                collection practices, or need support regarding AtomicShield,
                please contact us through the channels below.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:privacy@atomicshield.com"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg text-white font-medium transition-all duration-300"
                >
                  Privacy Contact
                </a>
                <a
                  href="mailto:dpo@atomicshield.com"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 rounded-lg text-white font-medium transition-all duration-300"
                >
                  GDPR/EU Privacy
                </a>
                <a
                  href="mailto:support@atomicshield.com"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 rounded-lg text-white font-medium transition-all duration-300"
                >
                  Technical Support
                </a>
                <a
                  href="https://discord.gg/atomic-shield"
                  className="px-6 py-3 border border-cyan-400/40 hover:border-cyan-400/60 bg-gray-950/20 hover:bg-cyan-400/5 rounded-lg text-cyan-400 hover:text-cyan-300 font-medium transition-all duration-300"
                >
                  Join Discord
                </a>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Last updated:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
