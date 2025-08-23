import React, { useState, useEffect, useRef } from "react";
import { useAuthCallback } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { getSeoConfig } from "@/lib/seo-routes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HomePageNavbar } from "@/components/HomePageNavbar";
import { PricingSectionAnimated } from "@/components/PricingSectionAnimated";
import { PaymentMethodModal } from "@/components/PaymentMethodModal";
import {
  Shield,
  Activity,
  BarChart3,
  Users,
  Server,
  TrendingUp,
  CheckCircle,
  Play,
  Star,
  ChevronRight,
  ArrowRight,
  Cpu,
  Network,
  Zap,
  Eye,
  Globe,
  Target,
  Clock,
  Database,
  AlertTriangle,
  Lock,
  Trophy,
  Award,
  Smartphone,
  Settings,
  Code,
  Headphones,
  MessageCircle,
  Quote,
  ExternalLink,
  Mail,
  Github,
  Twitter,
  Linkedin,
  MapPin,
  Phone,
  Calendar,
  Rocket,
  Building2,
  UserCheck,
  HeartHandshake,
  Gamepad2,
  MonitorSpeaker,
  BarChart,
  PieChart,
  Download,
} from "lucide-react";

// Animation Hook
const useIntersectionObserver = (threshold = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        }
      },
      { threshold },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isIntersecting };
};

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: number;
    link: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (plan: {
    name: string;
    price: number;
    link: string;
  }) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // Handle OAuth callback
  useAuthCallback();

  // Animation refs
  const heroRef = useIntersectionObserver(0.1);
  const statsRef = useIntersectionObserver(0.1);
  const featuresRef = useIntersectionObserver(0.1);
  const milestonesRef = useIntersectionObserver(0.1);
  const journeyRef = useIntersectionObserver(0.1);
  const testimonialsRef = useIntersectionObserver(0.1);
  const ctaRef = useIntersectionObserver(0.1);

  const liveStats = [
    {
      label: "Players Protected",
      value: "750,000+",
      change: "+18.7%",
      icon: Users,
      color: "from-green-400/20 to-emerald-500/20",
    },
    {
      label: "Threat Detection Rate",
      value: "99.98%",
      change: "+0.02%",
      icon: Target,
      color: "from-purple-400/20 to-violet-500/20",
    },
    {
      label: "Protected Users",
      value: "80,000+",
      change: "+12.4%",
      icon: Shield,
      color: "from-red-400/20 to-orange-500/20",
    },
  ];

  const milestones = [
    {
      icon: Trophy,
      label: "Industry Awards",
      value: <p>5+</p>,
      description: "Recognition for cybersecurity excellence",
    },
    {
      icon: Award,
      label: "Years of Protection",
      value: <p>1+</p>,
      description: "Defending digital infrastructure since 2016",
    },
    {
      icon: Globe,
      label: "Countries Protected",
      value: <p>4+</p>,
      description: "Global coverage across continents",
    },
    {
      icon: Building2,
      label: "Enterprise Clients",
      value: <p>50+</p>,
      description: "Trusted by gaming communities worldwide",
    },
  ];

  const features = [
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "Advanced Performance Detection",
      description:
        "Real-time pattern analysis monitors gaming activity to optimize performance and identify potential threats before they impact your platform.",
      gradient: "from-cyan-400/10 to-blue-500/10",
      border: "border-cyan-400/20",
      glow: "shadow-cyan-500/10",
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Advanced Behavioral Analytics",
      description:
        "Deep learning algorithms monitor user patterns, input sequences, and system interactions to detect anomalies and optimize gaming experiences.",
      gradient: "from-purple-400/10 to-pink-500/10",
      border: "border-purple-400/20",
      glow: "shadow-purple-500/10",
    },
    {
      icon: <Network className="h-8 w-8" />,
      title: "Global Intelligence Network",
      description:
        "Crowdsourced performance data from thousands of protected platforms worldwide, providing instant updates on optimization patterns and security insights.",
      gradient: "from-emerald-400/10 to-teal-500/10",
      border: "border-emerald-400/20",
      glow: "shadow-emerald-500/10",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Quantum Response Time",
      description:
        "Sub-millisecond performance optimization and response capabilities with automated enhancement systems and seamless platform integration.",
      gradient: "from-yellow-400/10 to-orange-500/10",
      border: "border-yellow-400/20",
      glow: "shadow-yellow-500/10",
    },
  ];

  const journeySteps = [
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Quick Setup",
      description:
        "Deploy AtomicShield in under 5 minutes with our automated installation toolkit and advanced configuration wizard.",
      features: [
        "One-click installation",
        "Auto-configuration",
        "Zero downtime setup",
      ],
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-400/30",
    },
    {
      icon: <MonitorSpeaker className="h-8 w-8" />,
      title: "Real-time Monitoring",
      description:
        "Access comprehensive analytics and performance visualization through our advanced command center dashboard.",
      features: [
        "Real-time performance monitoring",
        "Performance metrics",
        "Custom alerts",
      ],
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-400/30",
    },
    {
      icon: <HeartHandshake className="h-8 w-8" />,
      title: "Community Support",
      description:
        "Join thousands of protected platforms and access 24/7 expert support from our gaming specialists.",
      features: ["Expert support team", "Community forums", "Knowledge base"],
      gradient: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-400/30",
    },
  ];

  const testimonials = [
    {
      quote:
        "AtomicShield transformed our gaming platform. Zero false positives and 99.9% threat detection rate. Our community finally feels secure and performs optimally.",
      author: "Alex Rodriguez",
      role: "Gaming Platform Owner",
      company: "NextGen Gaming",
      avatar: "/api/placeholder/64/64",
      rating: 5,
    },
    {
      quote:
        "The real-time detection insights are incredible. It optimizes performance and catches issues that other systems miss completely. Game-changing technology.",
      author: "Sarah Chen",
      role: "Performance Director",
      company: "Eclipse Gaming",
      avatar: "/api/placeholder/64/64",
      rating: 5,
    },
    {
      quote:
        "Installation was seamless and the dashboard provides insights we never had before. Our performance issues dropped 90% thanks to advanced optimization.",
      author: "Marcus Thompson",
      role: "Community Manager",
      company: "Digital World",
      avatar: "/api/placeholder/64/64",
      rating: 5,
    },
  ];

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
        <div
          className="absolute top-3/4 left-3/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Scanning Lines Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-2 animate-scan" />
      </div>

      {/* Home Page Navigation */}
      <nav className="fixed top-0 w-full z-50 flex justify-center">
        <HomePageNavbar />
      </nav>

      {/* Hero Section with Dashboard Preview */}
      <section className="relative pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 min-h-screen flex items-center">
        <div
          ref={heroRef.ref}
          className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center transition-all duration-1000 ${
            heroRef.isIntersecting
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Hero Content */}
          <div className="space-y-6 sm:space-y-8 z-10 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/30 rounded-full px-3 sm:px-4 py-2 backdrop-blur-xl shadow-lg shadow-cyan-500/10 group hover:shadow-cyan-500/20 transition-all duration-300">
              <div className="relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fded3bb25d27f4acca47097c7c5d9349e%2F9c3bb44456604be2871a4b72bb7f176b?format=webp&width=800"
                  alt="AtomicShield Logo"
                  className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse group-hover:animate-bounce transition-all duration-300 drop-shadow-md"
                />
                <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-sm opacity-50" />
              </div>
              <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-300 transition-all duration-300">
                Quantum-Grade Enhancement Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                Secure Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent glow-text">
                Digital Empire
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Advanced real-time threat detection and performance optimization.
              Enhance your gaming platforms with comprehensive monitoring and
              adaptive defense systems.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 justify-center lg:justify-start">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 border-emerald-400/40 hover:border-emerald-400/60 bg-gray-950/20 hover:bg-emerald-400/5 backdrop-blur-xl text-emerald-400 hover:text-emerald-300 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 rounded-xl"
                asChild
              >
                <a
                  href="https://atomic-shield.com/static/download/AtomicShieldAgent.exe"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                  Download
                </a>
              </Button>
              <Button
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 border border-cyan-400/30 rounded-xl backdrop-blur-sm"
                asChild
              >
                <a href="#pricing">
                  <Star className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                  View Pricing
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 border-cyan-400/40 hover:border-cyan-400/60 bg-gray-950/20 hover:bg-cyan-400/5 backdrop-blur-xl text-cyan-400 hover:text-cyan-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300 rounded-xl"
                asChild
              >
                <a
                  href="https://www.youtube.com/watch?v=nfuYH1L7mYc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Play className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                  Watch Demo
                </a>
              </Button>
            </div>
          </div>

          {/* Dashboard Preview with Floating Stats */}
          <div className="relative mt-8 lg:mt-0">
            {/* Animated Stat Cards - More responsive positioning */}
            <div className="hidden lg:block">
              {liveStats.map((stat, index) => {
                const IconComponent = stat.icon;
                const positions = [
                  {
                    top: "-top-6 xl:-top-12",
                    left: "-left-2 xl:-left-8",
                    delay: "0ms",
                  },
                  {
                    top: "-top-2 xl:-top-8",
                    left: "right-0 xl:-right-4",
                    delay: "200ms",
                  },
                  {
                    top: "top-8 xl:top-12",
                    left: "-left-4 xl:-left-12",
                    delay: "400ms",
                  },
                ];
                const pos = positions[index];

                return (
                  <div
                    key={stat.label}
                    className={`absolute ${pos.top} ${pos.left} z-20 animate-float`}
                    style={{
                      animationDelay: pos.delay,
                      animationDuration: `${3 + index * 0.5}s`,
                    }}
                  >
                    <div
                      className={`bg-gradient-to-br ${stat.color} backdrop-blur-2xl border border-white/10 rounded-2xl p-3 xl:p-4 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 group hover:border-cyan-400/30 min-w-[140px] xl:min-w-[160px]`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <IconComponent className="h-4 w-4 xl:h-6 xl:w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                        <div className="text-xs text-green-400 flex items-center gap-1">
                          <TrendingUp className="h-2 w-2 xl:h-3 xl:w-3" />
                          <span className="text-[10px] xl:text-xs">
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className="text-lg xl:text-2xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-[10px] xl:text-xs text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Dashboard Mockup */}
            <div className="relative bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-cyan-400/20 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-500">
              <div className="space-y-4 sm:space-y-6">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    Security Command Center
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs sm:text-sm text-gray-400">
                      OPERATIONAL
                    </span>
                  </div>
                </div>

                {/* Enhanced Charts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-cyan-400/10">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="text-xs sm:text-sm text-gray-400">
                        Performance Analytics Matrix
                      </span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">
                        ACTIVE
                      </Badge>
                    </div>
                    <div className="h-16 sm:h-20 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-lg flex items-end justify-between p-2">
                      {[40, 65, 45, 80, 55, 75, 90, 85, 70].map((height, i) => (
                        <div
                          key={i}
                          className="bg-gradient-to-t from-cyan-400 to-cyan-300 w-1.5 sm:w-2 rounded-sm shadow-lg shadow-cyan-400/30 animate-pulse"
                          style={{
                            height: `${height}%`,
                            animationDelay: `${i * 100}ms`,
                            animationDuration: "2s",
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-2 sm:mt-3 text-xs text-cyan-400">
                      Real-time performance analysis
                    </div>
                  </div>

                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-purple-400/10">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="text-xs sm:text-sm text-gray-400">
                        System Performance
                      </span>
                      <div className="text-base sm:text-lg font-bold text-purple-400">
                        98.7%
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">CPU Usage</span>
                        <span className="text-xs text-green-400">23%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-green-400 to-cyan-400 h-1.5 rounded-full shadow-sm shadow-green-400/30"
                          style={{ width: "23%" }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Memory</span>
                        <span className="text-xs text-yellow-400">67%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-400 h-1.5 rounded-full shadow-sm shadow-yellow-400/30"
                          style={{ width: "67%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Activity Feed */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Live Security Feed
                    </span>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-400/30 text-xs">
                      MONITORING
                    </Badge>
                  </div>
                  {[
                    {
                      action: "Detection system optimized performance",
                      user: "Detection-Engine",
                      time: "0.3s ago",
                      status: "threat",
                      severity: "high",
                    },
                    {
                      action: "Quantum scan completed",
                      user: "Server-Cluster-01",
                      time: "1.2s ago",
                      status: "success",
                      severity: "low",
                    },
                    {
                      action: "Defense grid updated",
                      user: "Auto-Defense-System",
                      time: "3.7s ago",
                      status: "info",
                      severity: "medium",
                    },
                  ].map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-cyan-400/20 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse ${
                            activity.status === "threat"
                              ? "bg-red-400 shadow-lg shadow-red-400/50"
                              : activity.status === "success"
                                ? "bg-green-400 shadow-lg shadow-green-400/50"
                                : "bg-blue-400 shadow-lg shadow-blue-400/50"
                          }`}
                        />
                        <div>
                          <div className="text-sm text-white group-hover:text-cyan-300 transition-colors">
                            {activity.action}
                          </div>
                          <div className="text-xs text-gray-500">
                            {activity.user}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section
        id="features"
        className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 relative"
      >
        <div ref={featuresRef.ref} className="max-w-7xl mx-auto">
          <div
            className={`text-center space-y-6 sm:space-y-8 mb-16 sm:mb-20 transition-all duration-1000 ${
              featuresRef.isIntersecting
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Badge
              variant="outline"
              className="text-cyan-400 border-cyan-400/30 bg-cyan-400/5 px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm backdrop-blur-xl shadow-lg shadow-cyan-500/10"
            >
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              Advanced Defense Matrix
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Quantum-Grade{" "}
              </span>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent glow-text">
                Protection
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed px-4">
              Our revolutionary enhancement platform leverages advanced
              computing, pattern recognition, and global intelligence to provide
              developer-grade optimization for next-generation gaming
              experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${feature.gradient} backdrop-blur-2xl border ${feature.border} rounded-2xl lg:rounded-3xl p-6 sm:p-8 hover:border-cyan-400/40 transition-all duration-700 hover:shadow-2xl hover:${feature.glow} ${
                  featuresRef.isIntersecting
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-400/5 rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                    <div className="p-3 sm:p-4 bg-cyan-400/10 rounded-xl lg:rounded-2xl border border-cyan-400/30 text-cyan-400 shadow-lg shadow-cyan-500/10 group-hover:shadow-cyan-500/20 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-base sm:text-lg group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones / Stats Section */}
      <section className="py-20 px-6 relative">
        <div ref={milestonesRef.ref} className="max-w-7xl mx-auto">
          <div
            className={`transition-all duration-1000 ${
              milestonesRef.isIntersecting
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {milestones.map((milestone, index) => {
                const IconComponent = milestone.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-cyan-400/20 rounded-3xl p-8 hover:border-cyan-400/40 transition-all duration-700 hover:shadow-2xl hover:shadow-cyan-500/20"
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-400/10 rounded-2xl border border-cyan-400/30 text-cyan-400 shadow-lg shadow-cyan-500/10 group-hover:shadow-cyan-500/20 transition-all duration-300 mb-6">
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <div className="text-4xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {milestone.value}
                      </div>
                      <div className="text-lg font-semibold text-cyan-400 mb-2">
                        {milestone.label}
                      </div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        {milestone.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Journey / Use Cases Section */}
      <section id="dashboard" className="py-32 px-6 relative">
        <div ref={journeyRef.ref} className="max-w-7xl mx-auto">
          <div
            className={`text-center space-y-8 mb-20 transition-all duration-1000 ${
              journeyRef.isIntersecting
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Badge
              variant="outline"
              className="text-purple-400 border-purple-400/30 bg-purple-400/5 px-8 py-4 text-sm backdrop-blur-xl shadow-lg shadow-purple-500/10"
            >
              <Gamepad2 className="w-5 h-5 mr-3" />
              Your Security Journey
            </Badge>
            <h2 className="text-5xl sm:text-7xl font-bold">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                From Setup to{" "}
              </span>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent glow-text">
                Protection
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Experience seamless integration with our three-step journey from
              installation to complete server protection.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {journeySteps.map((step, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${step.gradient} backdrop-blur-2xl border ${step.border} rounded-3xl p-8 hover:border-cyan-400/40 transition-all duration-700 hover:shadow-2xl hover:shadow-cyan-500/20 ${
                  journeyRef.isIntersecting
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-cyan-500/30">
                    {index + 1}
                  </div>

                  <div className="flex items-center space-x-4 mb-6 mt-4">
                    <div className="p-4 bg-cyan-400/10 rounded-2xl border border-cyan-400/30 text-cyan-400 shadow-lg shadow-cyan-500/10 group-hover:shadow-cyan-500/20 transition-all duration-300">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-gray-400 leading-relaxed text-lg group-hover:text-gray-300 transition-colors mb-6">
                    {step.description}
                  </p>

                  <div className="space-y-3">
                    {step.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-6 relative">
        <div ref={testimonialsRef.ref} className="max-w-7xl mx-auto">
          <div
            className={`text-center space-y-8 mb-20 transition-all duration-1000 ${
              testimonialsRef.isIntersecting
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Badge
              variant="outline"
              className="text-emerald-400 border-emerald-400/30 bg-emerald-400/5 px-8 py-4 text-sm backdrop-blur-xl shadow-lg shadow-emerald-500/10"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Trusted by Gaming Communities
            </Badge>
            <h2 className="text-5xl sm:text-7xl font-bold">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                What Our{" "}
              </span>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent glow-text">
                Heroes Say
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Join thousands of developers and gamers who trust AtomicShield to
              enhance their gaming experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-cyan-400/20 rounded-3xl p-8 hover:border-cyan-400/40 transition-all duration-700 hover:shadow-2xl hover:shadow-cyan-500/20 ${
                  testimonialsRef.isIntersecting
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-cyan-400/40 mb-6" />

                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-300 leading-relaxed text-lg group-hover:text-white transition-colors mb-8">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/30">
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-white font-semibold group-hover:text-cyan-300 transition-colors">
                        {testimonial.author}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {testimonial.role} • {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 relative"
      >
        <div ref={ctaRef.ref} className="max-w-7xl mx-auto">
          <div
            className={`transition-all duration-1000 ${
              ctaRef.isIntersecting
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Pricing Header */}
            <div className="text-center space-y-6 sm:space-y-8 mb-16 sm:mb-20">
              <Badge
                variant="outline"
                className="text-emerald-400 border-emerald-400/30 bg-emerald-400/5 px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm backdrop-blur-xl shadow-lg shadow-emerald-500/10"
              >
                <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                Simple & Transparent Pricing
              </Badge>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Choose Your{" "}
                </span>
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent glow-text">
                  Plan
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed px-4">
                All plans include the same powerful features. Choose the
                duration that works best for your server.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {/* Basic Plan */}
              <div className="group relative bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-cyan-400/20 rounded-2xl lg:rounded-3xl p-6 sm:p-8 hover:border-cyan-400/40 transition-all duration-700 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-400/5 rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative">
                  <div className="text-center mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Basic
                    </h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-4xl sm:text-5xl font-bold text-cyan-400">
                        $40
                      </span>
                      <span className="text-gray-400 ml-2 text-sm sm:text-base">
                        /month
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400">
                      Perfect for small servers
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">
                        Live web panel
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">
                        Full configurable detections
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">
                        Detection webhook on discord
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">
                        Instant delivery
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      handleSelectPlan({
                        name: "Basic",
                        price: 40,
                        link: "https://polar.sh/atomicshield/subscriptions",
                      })
                    }
                    className="w-full py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 border border-cyan-400/30 rounded-xl"
                  >
                    Get Started
                  </Button>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="group relative bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-emerald-400/20 rounded-3xl p-8 hover:border-emerald-400/40 transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-teal-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-5xl font-bold text-emerald-400">
                        $80
                      </span>
                      <span className="text-gray-400 ml-2">/3 months</span>
                    </div>
                    <p className="text-gray-400">
                      Best value for growing servers
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">Live web panel</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">
                        Full configurable detections
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">
                        Detection webhook on discord
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">Instant delivery</span>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      handleSelectPlan({
                        name: "Pro",
                        price: 80,
                        link: "https://polar.sh/atomicshield/subscriptions",
                      })
                    }
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 border border-emerald-400/30 rounded-xl"
                  >
                    Get Started
                  </Button>
                </div>
              </div>

              {/* Enterprise Plan - Featured */}
              <div className="group relative bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border-2 border-purple-400/40 rounded-3xl p-8 hover:border-purple-400/60 transition-all duration-700 hover:shadow-2xl hover:shadow-purple-500/20 scale-105">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-3xl opacity-50" />
                <div className="relative">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Enterprise
                    </h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-5xl font-bold text-purple-400">
                        $250
                      </span>
                      <span className="text-gray-400 ml-2">/lifetime</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-red-400 line-through text-lg">
                        $300
                      </span>
                      <Badge className="bg-red-500/20 text-red-400 border-red-400/30 text-xs">
                        17% OFF
                      </Badge>
                    </div>
                    <p className="text-gray-400">
                      One-time payment, lifetime access
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">Live web panel</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">
                        Full configurable detections
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">
                        Detection webhook on discord
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">Instant delivery</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">Advanced Log</span>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      handleSelectPlan({
                        name: "Enterprise",
                        price: 250,
                        link: "https://polar.sh/atomicshield/subscriptions",
                      })
                    }
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-400/30 rounded-xl"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>

            {/* Additional CTA */}
            <div className="text-center mt-12 sm:mt-16">
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-4">
                Need help choosing? All plans include 24/7 support and a 30-day
                money-back guarantee.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 border-cyan-400/40 hover:border-cyan-400/60 bg-gray-950/20 hover:bg-cyan-400/5 backdrop-blur-xl text-cyan-400 hover:text-cyan-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300 rounded-xl"
                  asChild
                >
                  <a
                    href="https://discord.gg/atmoic-shield"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                    Schedule Demo
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 border-emerald-400/40 hover:border-emerald-400/60 bg-gray-950/20 hover:bg-emerald-400/5 backdrop-blur-xl text-emerald-400 hover:text-emerald-300 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 rounded-xl"
                  asChild
                >
                  <a
                    href="https://discord.gg/atmoic-shield"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Headphones className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                    Contact Support
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Trial Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="group relative bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-emerald-400/30 rounded-3xl p-8 sm:p-12 hover:border-emerald-400/50 transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-cyan-400/5 rounded-3xl opacity-50" />
            <div className="relative text-center space-y-6">
              {/* Trial Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-400/10 via-cyan-500/10 to-blue-500/10 border border-emerald-400/30 rounded-full px-4 py-2 backdrop-blur-xl shadow-lg shadow-emerald-500/10">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Limited Time Offer
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Start Your{" "}
                </span>
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent glow-text">
                  Free Trial
                </span>
              </h2>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Get a
                <span className="text-emerald-400 font-semibold">
                  {" "}
                  free 3-day license
                </span>{" "}
                to experience the full power of AtomicShield with complete
                access to all features.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 mb-8">
                <div className="flex items-center space-x-3 bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-emerald-400/10">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Full Protection</span>
                </div>
                <div className="flex items-center space-x-3 bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-emerald-400/10">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">
                    Real-time Analytics
                  </span>
                </div>
                <div className="flex items-center space-x-3 bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-emerald-400/10">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">24/7 Support</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 border border-emerald-400/30 rounded-xl backdrop-blur-sm"
                  asChild
                >
                  <a href="/dashboard">
                    <Rocket className="mr-3 h-5 w-5" />
                    Start Free Trial
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 border-cyan-400/40 hover:border-cyan-400/60 bg-gray-950/20 hover:bg-cyan-400/5 backdrop-blur-xl text-cyan-400 hover:text-cyan-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300 rounded-xl"
                  asChild
                >
                  <a href="#features">
                    <Eye className="mr-3 h-5 w-5" />
                    Learn More
                  </a>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 pt-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span>Free 3-Day License</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>Setup in Under 5 Minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-4 w-4 text-emerald-400" />
                  <span>750,000+ Players Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-gray-950/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-lg">
              Get answers to common questions about AtomicShield
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="item-1"
              className="border border-cyan-400/20 rounded-lg bg-gray-950/50"
            >
              <AccordionTrigger className="px-6 text-white hover:text-cyan-400 transition-colors text-left">
                How do I install AtomicShield on my server?
              </AccordionTrigger>
              <AccordionContent className="px-6 text-gray-300">
                <div className="space-y-3">
                  <p>
                    <strong>Installation Steps:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>
                      Extract the AtomicShield folder and put it in your scripts
                      directory with the folder name "atomic-shield"
                    </li>
                    <li>
                      In the server.key file, enter your server key (available
                      in your dashboard)
                    </li>
                    <li>
                      If you get an error in console, copy the key from your
                      dashboard and paste it in the server.key file
                    </li>
                    <li>
                      Ensure "atomic-shield" is added to your server.cfg file
                    </li>
                    <li>Run your server</li>
                    <li>
                      You should see "atomic shield successfully joined network"
                      in the console
                    </li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border border-cyan-400/20 rounded-lg bg-gray-950/50"
            >
              <AccordionTrigger className="px-6 text-white hover:text-cyan-400 transition-colors text-left">
                How do I get my license key after purchase?
              </AccordionTrigger>
              <AccordionContent className="px-6 text-gray-300">
                When you buy a license from SellAuth or Polar, you get the key
                instantly. Simply redeem it in your dashboard and add your
                server to start using AtomicShield.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border border-cyan-400/20 rounded-lg bg-gray-950/50"
            >
              <AccordionTrigger className="px-6 text-white hover:text-cyan-400 transition-colors text-left">
                I'm getting DirectX errors, how do I fix this?
              </AccordionTrigger>
              <AccordionContent className="px-6 text-gray-300">
                Some devices don't have DirectX installed. Download and install
                DirectX from Microsoft:{" "}
                <a
                  href="https://download.microsoft.com/download/1/7/1/1718ccc4-6315-4d8e-9543-8e28a4e18c4c/dxwebsetup.exe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                >
                  Download DirectX
                </a>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border border-cyan-400/20 rounded-lg bg-gray-950/50"
            >
              <AccordionTrigger className="px-6 text-white hover:text-cyan-400 transition-colors text-left">
                Can I use VPN or proxy with AtomicShield?
              </AccordionTrigger>
              <AccordionContent className="px-6 text-gray-300">
                If you want to run a VPN, make sure to start it before opening
                the game (when the game is closed). Remove any proxy or
                connection-blocking software that might interfere with
                AtomicShield's connection.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="border border-cyan-400/20 rounded-lg bg-gray-950/50"
            >
              <AccordionTrigger className="px-6 text-white hover:text-cyan-400 transition-colors text-left">
                How do I add my server after getting a license?
              </AccordionTrigger>
              <AccordionContent className="px-6 text-gray-300">
                After purchasing and redeeming your license key, go to your
                dashboard and use the "Add Server" function to connect your
                server to AtomicShield protection.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-6"
              className="border border-cyan-400/20 rounded-lg bg-gray-950/50"
            >
              <AccordionTrigger className="px-6 text-white hover:text-cyan-400 transition-colors text-left">
                What should I do if I have connection issues?
              </AccordionTrigger>
              <AccordionContent className="px-6 text-gray-300">
                Ensure that no proxy software or firewall is blocking the
                connection. If using a VPN, start it before launching the game.
                Contact our support team on Discord if issues persist.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-7"
              className="border border-cyan-400/20 rounded-lg bg-gray-950/50"
            >
              <AccordionTrigger className="px-6 text-white hover:text-cyan-400 transition-colors text-left">
                Where can I get additional support?
              </AccordionTrigger>
              <AccordionContent className="px-6 text-gray-300">
                Join our Discord server at{" "}
                <a
                  href="https://discord.gg/atmoic-shield"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                >
                  discord.gg/atmoic-shield
                </a>{" "}
                or email us at{" "}
                <a
                  href="mailto:atomicshield.ac@gmail.com"
                  className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                >
                  atomicshield.ac@gmail.com
                </a>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-950/50 backdrop-blur-sm border-t border-cyan-400/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {/* Brand */}
            <div className="space-y-6">
              <a
                href="/"
                className="flex items-center space-x-3 group cursor-pointer"
              >
                <div className="relative">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fded3bb25d27f4acca47097c7c5d9349e%2F9c3bb44456604be2871a4b72bb7f176b?format=webp&width=800"
                    alt="AtomicShield Logo"
                    className="h-8 w-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 drop-shadow-lg filter brightness-0 invert"
                  />
                  <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-lg animate-pulse group-hover:bg-cyan-400/50 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-purple-300 transition-all duration-300">
                  AtomicShield
                </span>
              </a>
              <p className="text-gray-400 leading-relaxed">
                Advanced performance optimization powered by real-time detection
                insights for the next generation of gaming platforms.
              </p>
            </div>

            {/* Documentation */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">
                Documentation
              </h3>
              <div className="space-y-3">
                <a
                  href="#pricing"
                  className="block text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  License Purchase Guide
                </a>
                <a
                  href="/dashboard"
                  className="block text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Dashboard Guide
                </a>
                <a
                  href="#faq"
                  className="block text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Installation Guide
                </a>
                <a
                  href="https://discord.gg/atmoic-shield"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Server Setup Guide
                </a>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Support</h3>
              <div className="space-y-3">
                <a
                  href="https://download.microsoft.com/download/1/7/1/1718ccc4-6315-4d8e-9543-8e28a4e18c4c/dxwebsetup.exe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  DirectX Download
                </a>
                <a
                  href="https://discord.gg/atmoic-shield"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Discord Support
                </a>
                <a
                  href="#faq"
                  className="block text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  FAQ
                </a>
                <a
                  href="mailto:atomicshield.ac@gmail.com"
                  className="block text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Email Support
                </a>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="h-5 w-5 text-cyan-400" />
                  <a
                    href="mailto:atomicshield.ac@gmail.com"
                    className="hover:text-cyan-400 transition-colors"
                  >
                    atomicshield.ac@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-cyan-400/10 mt-12 sm:mt-16 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>© 2025 AtomicShield. All rights reserved.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-4 md:mt-0">
              <a
                href="/privacy"
                className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="/tos"
                className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Payment Method Modal */}
      {selectedPlan && (
        <PaymentMethodModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plan={selectedPlan}
        />
      )}
    </div>
  );
};

export default HomePage;
