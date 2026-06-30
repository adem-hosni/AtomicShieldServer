import React from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { AtomicNavbar } from "@/components/AtomicNavbar";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Scale,
  Users,
  FileText,
  Lock,
  Verified,
  Globe,
  Search,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TermsOfService = () => {
  usePageTitle("Terms of Service");
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
        <div className="max-w-4xl mx-auto">
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
                Legal Information
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                Terms of
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent glow-text">
                Service
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed">
              By using Atomic Shield ("the Software"), you agree to the
              following terms and conditions.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* General Terms */}
            <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-cyan-400/20 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold text-white">
                    General Terms
                  </h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <p>
                      You may not use the Software for any unlawful or malicious
                      purposes.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <p>
                      Unauthorized distribution, modification, or reverse
                      engineering of the Software is strictly prohibited.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <p>
                      Atomic Shield is provided "as-is" without any warranties
                      of any kind, express or implied.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <p>
                      We reserve the right to terminate your access to the
                      Software at any time for violations of these terms.
                    </p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-cyan-400/10 rounded-lg border border-cyan-400/20">
                  <p className="text-cyan-300 text-sm">
                    These Terms of Service may be updated from time to time, and
                    it is your responsibility to review them periodically.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Processing Terms */}
            <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-emerald-400/20 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="h-6 w-6 text-emerald-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Payment Processing Terms
                  </h2>
                </div>
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Polar.sh Payment Processing
                    </h3>
                    <p className="mb-3">
                      For credit card, Apple Pay, and Google Pay transactions,
                      we partner with Polar.sh as our payment processor. When
                      making purchases through these payment methods, you agree
                      to Polar.sh's terms of service.
                    </p>
                    <p>
                      Polar.sh terms are available at:{" "}
                      <a
                        href="https://polar.sh/legal/terms"
                        className="text-cyan-400 hover:text-cyan-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://polar.sh/legal/terms
                      </a>
                    </p>
                    <p>
                      For support with Polar.sh transactions, contact:{" "}
                      <a
                        href="mailto:support@polar.sh"
                        className="text-cyan-400 hover:text-cyan-300 underline"
                      >
                        support@polar.sh
                      </a>
                    </p>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      SellAuth Payment Processing
                    </h3>
                    <p className="mb-3">
                      For cryptocurrency and PayPal transactions, we partner
                      with SellAuth as our payment processor. When making
                      purchases through these payment methods, you agree to
                      SellAuth's terms of service.
                    </p>
                    <p>
                      SellAuth terms are available at:{" "}
                      <a
                        href="https://sellauth.com/terms"
                        className="text-cyan-400 hover:text-cyan-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://sellauth.com/terms
                      </a>
                    </p>
                    <p>
                      For support with SellAuth transactions, contact:{" "}
                      <a
                        href="mailto:support@sellauth.com"
                        className="text-cyan-400 hover:text-cyan-300 underline"
                      >
                        support@sellauth.com
                      </a>
                    </p>
                  </div>

                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-400/20">
                    <p className="text-blue-300 text-sm">
                      <strong>Important:</strong> Payment processing disputes,
                      refund requests, and billing inquiries should be directed
                      to the respective payment processor (Polar.sh or SellAuth)
                      in the first instance. AtomicShield will assist with any
                      additional support needed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Licensing & Usage */}
            <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-purple-400/20 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-6 w-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Licensing & Usage
                  </h2>
                </div>
                <div className="space-y-6 text-gray-300">
                  <p>
                    Atomic Shield is provided under a license model. When
                    purchasing access, you receive a non-transferable,
                    non-exclusive, revocable license for use on a single FiveM
                    server.
                  </p>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      License Options:
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-400/30">
                          1 Month
                        </Badge>
                        <span>1 Month License</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30">
                          3 Months
                        </Badge>
                        <span>3 Months License</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                          Lifetime
                        </Badge>
                        <span>Lifetime License</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-400/20">
                    <p className="text-red-300 font-medium mb-2">
                      License sharing, resale, or multi-server deployment under
                      a single license is strictly prohibited.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Prohibited Uses:
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <span>
                          Using Atomic Shield for cheat development or testing
                        </span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <span>
                          Reverse engineering or tampering with the software
                        </span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <span>
                          Redistributing, reselling, or rebranding the product
                        </span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <span>Bypassing security or detection features</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-400/20">
                    <p className="text-red-300 font-medium">
                      Violations will result in immediate license termination
                      and a permanent ban from the Atomic Shield network. No
                      refunds will be granted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Signing & Security Guarantees */}
            <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-green-400/20 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Lock className="h-6 w-6 text-green-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Code Signing & Security Guarantees
                  </h2>
                </div>
                <div className="space-y-6 text-gray-300">
                  <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-400/20">
                    <div className="flex items-start space-x-3">
                      <Verified className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">
                          Certificate Authority & Security
                        </h3>
                        <p className="text-green-300 mb-4">
                          AtomicShield is digitally signed with a verified
                          SSL.com Code Signing Certificate, ensuring the
                          software's authenticity and integrity. This guarantees
                          that the software you receive is legitimate and has
                          not been tampered with.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-sm">
                              Issued by:{" "}
                              <strong>
                                SSL.com Code Signing Intermediate CA RSA R1
                              </strong>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-green-400" />
                            <span className="text-sm">
                              Valid from:{" "}
                              <strong>May 2, 2025 to May 2, 2026</strong>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-green-400" />
                            <span className="text-sm">
                              Includes timestamping for verification integrity
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-400/10 rounded-lg border border-blue-400/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <Search className="h-6 w-6 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">
                          Certificate Verification
                        </h3>
                      </div>
                      <div className="space-y-3 text-blue-300">
                        <p className="text-sm">
                          To verify the authenticity of AtomicShield, check that
                          the digital signature shows:
                        </p>
                        <div className="bg-blue-500/20 p-3 rounded border border-blue-400/30 font-mono text-xs">
                          <div>
                            <strong>Publisher:</strong>
                          </div>
                          <div>CN = Gia Hưng Lê</div>
                          <div>O = Gia Hưng Lê</div>
                          <div>L = Huyện Quảng Xương</div>
                          <div>S = Thanh Hóa</div>
                          <div>C = VN</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span className="text-sm">
                            Scan with VirusTotal or similar security services
                            for additional verification
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-red-400/10 rounded-lg border border-red-400/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                        <h3 className="text-lg font-semibold text-white">
                          Security Commitments
                        </h3>
                      </div>
                      <ul className="space-y-2 text-red-300">
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            AtomicShield cannot contain malware due to code
                            signing requirements
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            Any malware detection would result in immediate
                            certificate revocation
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            SSL.com monitors and validates all signed
                            applications
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            Certificate would be permanently banned if security
                            violations occur
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-6 w-6 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">
                          Legal Security Guarantees
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-purple-300 mb-2">
                              Our Guarantees:
                            </h4>
                            <ul className="text-sm text-purple-300 space-y-1">
                              <li>• Software is 100% malware-free</li>
                              <li>
                                • Digital signature verification available
                              </li>
                              <li>• SSL.com certificate authority backing</li>
                              <li>• Timestamped signatures for integrity</li>
                              <li>• No false antivirus triggers</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-pink-300 mb-2">
                              Certificate Revocation Triggers:
                            </h4>
                            <ul className="text-sm text-pink-300 space-y-1">
                              <li>• Any malware detection</li>
                              <li>• Security standard violations</li>
                              <li>• Unauthorized code modifications</li>
                              <li>• Certificate authority policy violations</li>
                              <li>• User security compromise reports</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-2">
                          False Positive Handling
                        </h4>
                        <p className="text-yellow-300 text-sm">
                          If any antivirus software incorrectly flags
                          AtomicShield as malicious, we will immediately
                          investigate the issue and work with the antivirus
                          vendor to resolve the false positive. Our code signing
                          certificate provides cryptographic proof of the
                          software's legitimacy.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-400/20">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      User Verification Steps
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-cyan-300 mb-3">
                          Before Installation:
                        </h4>
                        <ol className="space-y-2 text-cyan-300 text-sm">
                          <li className="flex items-start space-x-2">
                            <span className="bg-cyan-500/20 text-cyan-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">
                              1
                            </span>
                            <span>
                              Right-click the downloaded file and select
                              "Properties"
                            </span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="bg-cyan-500/20 text-cyan-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">
                              2
                            </span>
                            <span>
                              Go to "Digital Signatures" tab and verify the
                              publisher
                            </span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="bg-cyan-500/20 text-cyan-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">
                              3
                            </span>
                            <span>
                              Upload to VirusTotal.com for additional security
                              scanning
                            </span>
                          </li>
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-300 mb-3">
                          Security Verification:
                        </h4>
                        <ul className="space-y-2 text-blue-300 text-sm">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>
                              Certificate must show "SSL.com" as issuer
                            </span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>
                              Publisher must match the exact details above
                            </span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>
                              File hash should match official distribution
                            </span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>VirusTotal should show 0 detections</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refund Policy & Support */}
            <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-yellow-400/20 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Refund Policy & Support
                  </h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Refunds are not offered for digital products unless required
                    by applicable law. If you experience technical issues with
                    the Software, please contact our support team for resolution
                    before requesting a refund. Refund requests must be
                    submitted in writing to support@atomicshield.com.
                  </p>
                  <p>
                    Support is available 24/7 via our Discord:{" "}
                    <a
                      href="https://discord.gg/atomic-shield"
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      discord.gg/atomic-shield
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-cyan-400/20 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">
                Questions about our Terms?
              </h3>
              <p className="text-gray-300 mb-6">
                If you have any questions about these Terms of Service, please
                contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@atomicshield.com"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg text-white font-medium transition-all duration-300"
                >
                  Email Support
                </a>
                <a
                  href="https://discord.gg/atomic-shield"
                  className="px-6 py-3 border border-cyan-400/40 hover:border-cyan-400/60 bg-gray-950/20 hover:bg-cyan-400/5 rounded-lg text-cyan-400 hover:text-cyan-300 font-medium transition-all duration-300"
                >
                  Join Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
