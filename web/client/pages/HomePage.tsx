import React, { useState, useEffect, useRef } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Shield,
  Eye,
  Zap,
  Users,
  Activity,
  CheckCircle,
  Globe,
  Lock,
  TrendingUp,
  BarChart3,
  Camera,
  AlertTriangle,
  Star,
  ArrowRight,
  Play,
  Menu,
  X,
  Server,
  Target,
  Sparkles,
  Clock,
  Award,
  ChevronRight,
  Quote,
} from "lucide-react";
import { Link } from "react-router-dom";

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
  usePageTitle("Home");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Animation refs
  const heroRef = useIntersectionObserver(0.1);
  const statsRef = useIntersectionObserver(0.1);
  const featuresRef = useIntersectionObserver(0.1);
  const analyticsRef = useIntersectionObserver(0.1);
  const whyUsRef = useIntersectionObserver(0.1);
  const testimonialsRef = useIntersectionObserver(0.1);

  const features = [
    {
      icon: <Shield className="h-12 w-12 text-blue-400" />,
      title: "Advanced Threat Detection",
      description:
        "AI-powered detection algorithms that identify and neutralize cheats before they impact your server environment.",
      gradient: "from-blue-500/20 to-blue-600/5",
      delay: "0ms",
    },
    {
      icon: <Activity className="h-12 w-12 text-green-400" />,
      title: "Real-time Monitoring",
      description:
        "24/7 surveillance with instant alerts and automated responses to suspicious player behavior.",
      gradient: "from-green-500/20 to-green-600/5",
      delay: "100ms",
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-purple-400" />,
      title: "Advanced Analytics",
      description:
        "Comprehensive insights and reporting to help you understand server performance and player patterns.",
      gradient: "from-purple-500/20 to-purple-600/5",
      delay: "200ms",
    },
    {
      icon: <Target className="h-12 w-12 text-orange-400" />,
      title: "Precision Targeting",
      description:
        "Surgical precision in cheat detection with minimal false positives and maximum accuracy.",
      gradient: "from-orange-500/20 to-orange-600/5",
      delay: "300ms",
    },
    {
      icon: <Globe className="h-12 w-12 text-cyan-400" />,
      title: "Global Network",
      description:
        "Worldwide threat intelligence sharing and collaborative defense mechanisms.",
      gradient: "from-cyan-500/20 to-cyan-600/5",
      delay: "400ms",
    },
    {
      icon: <Clock className="h-12 w-12 text-yellow-400" />,
      title: "Instant Response",
      description:
        "Lightning-fast reaction times with automated mitigation and manual override capabilities.",
      gradient: "from-yellow-500/20 to-yellow-600/5",
      delay: "500ms",
    },
  ];

  const whyChooseUs = [
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Industry Leading",
      description:
        "Trusted by over 10,000+ servers worldwide with 99.9% uptime guarantee",
    },
    {
      icon: <Lock className="h-8 w-8 text-green-400" />,
      title: "Enterprise Security",
      description:
        "Military-grade encryption and security protocols protecting your data",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-400" />,
      title: "Expert Support",
      description:
        "24/7 support from anti-cheat specialists and gaming industry veterans",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-purple-400" />,
      title: "Cutting Edge Tech",
      description:
        "Latest AI and machine learning technologies for superior detection",
    },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Server Owner, NoPixel",
      content:
        "AtomicShield has completely transformed our server security. The detection rate is incredible and false positives are virtually non-existent.",
      avatar: "AC",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      role: "Community Manager, Eclipse RP",
      content:
        "Best investment we've made for our community. The real-time monitoring and instant alerts have saved us countless times.",
      avatar: "SJ",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Lead Admin, Grand RP",
      content:
        "The analytics and reporting features give us insights we never had before. It's like having a crystal ball for server security.",
      avatar: "MR",
      rating: 5,
    },
  ];

  const liveStats = [
    { label: "Threats Blocked", value: "2,847,293", change: "+12.3%" },
    { label: "Servers Protected", value: "10,247", change: "+8.7%" },
    { label: "Players Secured", value: "1.2M", change: "+15.2%" },
    { label: "Uptime", value: "99.99%", change: "0.01%" },
  ];

  // Testimonial carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 h-8 w-8 bg-primary/20 rounded-full blur-xl animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                AtomicShield
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105"
              >
                Features
              </a>
              <a
                href="#analytics"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105"
              >
                Analytics
              </a>
              <a
                href="#testimonials"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105"
              >
                Reviews
              </a>
              <Link
                to="/dashboard"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105"
              >
                Dashboard
              </Link>
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
              >
                <Link to="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover:bg-primary/10"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="#features"
                  className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                >
                  Features
                </a>
                <a
                  href="#analytics"
                  className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                >
                  Analytics
                </a>
                <a
                  href="#testimonials"
                  className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                >
                  Reviews
                </a>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-primary to-blue-600"
                  >
                    <Link to="/dashboard">Get Started</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />

        <div
          ref={heroRef.ref}
          className={`max-w-7xl mx-auto text-center relative z-10 transition-all duration-1000 ${
            heroRef.isIntersecting
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 rounded-full px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Next-Generation Anti-Cheat Protection
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Secure Your{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Gaming World
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-cyan-400/20 blur-2xl -z-10 animate-pulse" />
              </span>
              <br />
              with AtomicShield
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              The most advanced anti-cheat system for FiveM servers. Protect
              your community with AI-powered detection, real-time monitoring,
              and enterprise-grade security.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                asChild
              >
                <Link to="/dashboard">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transform hover:scale-105 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section
        ref={statsRef.ref}
        className={`py-32 px-4 sm:px-6 lg:px-8 border-y border-border/50 bg-gradient-to-r from-background via-primary/5 to-background transition-all duration-1000 ${
          statsRef.isIntersecting
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Live Protection Statistics
            </h2>
            <p className="text-muted-foreground">
              Real-time data from our global network
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {liveStats.map((stat, index) => (
              <Card
                key={stat.label}
                className={`text-center border-primary/20 hover:border-primary/40 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 transform hover:scale-110 hover:-translate-y-2 ${
                  statsRef.isIntersecting
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {stat.label}
                  </div>
                  <div className="text-xs text-green-400 flex items-center justify-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8">
        <div ref={featuresRef.ref} className="max-w-7xl mx-auto">
          <div
            className={`text-center space-y-4 mb-16 transition-all duration-1000 ${
              featuresRef.isIntersecting
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Badge
              variant="outline"
              className="text-primary border-primary/20 bg-primary/5 px-4 py-2"
            >
              <Shield className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold">
              Advanced Protection{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Technology
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our cutting-edge anti-cheat system combines AI, machine learning,
              and real-time monitoring to provide unparalleled protection for
              your gaming community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group bg-gradient-to-br ${feature.gradient} border-primary/20 hover:border-primary/40 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 transform hover:scale-110 hover:-translate-y-6 ${
                  featuresRef.isIntersecting
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: feature.delay }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-background/10 rounded-xl group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Preview Section */}
      <section
        id="analytics"
        className="py-32 px-4 sm:px-6 lg:px-8 bg-muted/30"
      >
        <div ref={analyticsRef.ref} className="max-w-7xl mx-auto">
          <div
            className={`text-center space-y-4 mb-16 transition-all duration-1000 ${
              analyticsRef.isIntersecting
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Badge
              variant="outline"
              className="text-primary border-primary/20 bg-primary/5 px-4 py-2"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics Dashboard
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold">
              Comprehensive{" "}
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Insights
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get detailed analytics and reporting to understand your server's
              security posture and player behavior patterns.
            </p>
          </div>

          <div
            className={`relative transition-all duration-1000 ${
              analyticsRef.isIntersecting
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 overflow-hidden">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Real-Time Dashboard</h3>
                    <p className="text-muted-foreground">
                      Monitor your server's security in real-time with our
                      comprehensive dashboard. Track threats, player behavior,
                      and system performance all in one place.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span>Live threat monitoring</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span>Player behavior analytics</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span>Automated reporting</span>
                      </div>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-primary to-blue-600"
                      asChild
                    >
                      <Link to="/dashboard">
                        View Dashboard
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 blur-3xl" />
                    <div className="relative bg-background/10 backdrop-blur-xl border border-primary/20 rounded-2xl p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Security Overview</h4>
                          <Badge className="bg-green-500/20 text-green-400">
                            Secure
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-background/20 rounded-lg p-3">
                            <div className="text-2xl font-bold text-green-400">
                              99.9%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Detection Rate
                            </div>
                          </div>
                          <div className="bg-background/20 rounded-lg p-3">
                            <div className="text-2xl font-bold text-blue-400">
                              0.1%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              False Positives
                            </div>
                          </div>
                        </div>
                        <div className="h-20 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-lg flex items-end justify-between p-2">
                          {[40, 65, 45, 80, 55, 75, 60].map((height, i) => (
                            <div
                              key={i}
                              className="bg-primary/50 w-6 rounded-sm transition-all duration-1000"
                              style={{
                                height: `${height}%`,
                                transitionDelay: `${i * 100}ms`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div ref={whyUsRef.ref} className="max-w-7xl mx-auto">
          <div
            className={`text-center space-y-4 mb-16 transition-all duration-1000 ${
              whyUsRef.isIntersecting
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Badge
              variant="outline"
              className="text-primary border-primary/20 bg-primary/5 px-4 py-2"
            >
              <Star className="w-4 h-4 mr-2" />
              Why Choose Us
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold">
              Trusted by{" "}
              <span className="bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
                Thousands
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join the community of server owners who trust AtomicShield to
              protect their players and maintain the integrity of their gaming
              environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card
                key={index}
                className={`group border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 transform hover:scale-105 ${
                  whyUsRef.isIntersecting
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-32 px-4 sm:px-6 lg:px-8 bg-muted/30"
      >
        <div ref={testimonialsRef.ref} className="max-w-7xl mx-auto">
          <div
            className={`text-center space-y-4 mb-16 transition-all duration-1000 ${
              testimonialsRef.isIntersecting
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Badge
              variant="outline"
              className="text-primary border-primary/20 bg-primary/5 px-4 py-2"
            >
              <Quote className="w-4 h-4 mr-2" />
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold">
              What Our{" "}
              <span className="bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
                Community Says
              </span>
            </h2>
          </div>

          <div
            className={`relative transition-all duration-1000 ${
              testimonialsRef.isIntersecting
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <blockquote className="text-xl sm:text-2xl italic leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>

                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonials[currentTestimonial].role}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentTestimonial
                            ? "bg-primary"
                            : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-5xl font-bold">
              Ready to{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Secure Your Server?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of server owners who trust AtomicShield to protect
              their communities. Start your free trial today and experience the
              difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                asChild
              >
                <Link to="/dashboard">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transform hover:scale-105 transition-all duration-300"
              >
                View Pricing
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border/50">
              <div className="space-y-4">
                <h3 className="font-semibold text-primary">Product</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a
                      href="#features"
                      className="hover:text-foreground transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#analytics"
                      className="hover:text-foreground transition-colors"
                    >
                      Analytics
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-foreground transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-primary">Support</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Status
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-primary">Company</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Terms
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border/50 pt-8 text-center text-muted-foreground">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">AtomicShield</span>
              </div>
              <p>
                &copy; 2024 AtomicShield. All rights reserved. Protecting gaming
                communities worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
