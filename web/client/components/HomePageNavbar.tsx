import { useState, useEffect } from "react";
import { Menu, X, Shield, Github, LogIn } from "lucide-react";
import { Button } from "./ui/button";

export function HomePageNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`transition-all duration-500 ${
        isScrolled ? "relative pt-2 px-2 sm:pt-4 sm:px-4" : "relative"
      }`}
    >
      <div
        className={`relative flex items-center justify-between w-full transition-all duration-500 ${
          isScrolled
            ? "max-w-[960px] px-4 py-3 sm:px-6 sm:py-4 lg:px-8 backdrop-blur-[24px] bg-[oklab(0.1363_-0.00682067_-0.0357553_/_0.4)] border border-[oklch(0.2778_0.0461_256.36)] rounded-b-[16px] shadow-lg shadow-cyan-500/20"
            : "max-w-none px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 bg-gray-950/80 backdrop-blur-sm"
        }`}
      >
        {/* Logo/Brand Section */}
        <a href="/" className="flex items-center space-x-2 sm:space-x-3 group">
          <div className="relative">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fded3bb25d27f4acca47097c7c5d9349e%2F9c3bb44456604be2871a4b72bb7f176b?format=webp&width=800"
              alt="AtomicShield Logo"
              className="h-6 w-6 sm:h-8 sm:w-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-lg"
            />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse group-hover:bg-cyan-400/40 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </div>
          <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-purple-300 transition-all duration-300">
            AtomicShield
          </span>
        </a>

        {/* Medium + Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2 md:space-x-3 lg:space-x-4 xl:space-x-6">
          <a
            href="#features"
            className="flex items-center justify-center h-8 md:h-9 px-2 md:px-3 xl:px-4 text-xs md:text-sm font-medium text-[oklab(0.9256_-0.00337878_-0.0191035_/_0.8)] rounded-lg cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.4,_0,_0.2,_1)] hover:bg-white/5"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="flex items-center justify-center h-8 md:h-9 px-2 md:px-3 xl:px-4 text-xs md:text-sm font-medium text-[oklab(0.9256_-0.00337878_-0.0191035_/_0.8)] rounded-lg cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.4,_0,_0.2,_1)] hover:bg-white/5"
          >
            Pricing
          </a>
          <a
            href="/tos"
            className="flex items-center justify-center h-8 md:h-9 px-2 md:px-3 xl:px-4 text-xs md:text-sm font-medium text-[oklab(0.9256_-0.00337878_-0.0191035_/_0.8)] rounded-lg cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.4,_0,_0.2,_1)] hover:bg-white/5"
          >
            TOS
          </a>
          <a
            href="/privacy"
            className="flex items-center justify-center h-8 md:h-9 px-2 md:px-3 xl:px-4 text-xs md:text-sm font-medium text-[oklab(0.9256_-0.00337878_-0.0191035_/_0.8)] rounded-lg cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.4,_0,_0.2,_1)] hover:bg-white/5"
          >
            Privacy
          </a>
        </nav>

        {/* Right Side */}
        <div className="flex items-center">
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 justify-center">
            {/* Sign In Button */}
            <div className="flex items-center h-full justify-center">
              <a href="/auth/signin" className="cursor-pointer">
                <Button
                  size="sm"
                  className="inline-flex items-center justify-center h-7 px-3 sm:h-8 sm:px-4 lg:px-6 text-xs font-medium rounded-md bg-[oklch(0.1363_0.0364_259.2)] border border-[oklch(0.2778_0.0461_256.36)] shadow-[rgba(0,_0,_0)_0px_0px_0px_0px,_rgba(0,_0,_0,_0.1)_0px_1px_3px_0px,_rgba(0,_0,_0,_0.1)_0px_1px_2px_-1px] text-white transition-all duration-150 ease-[cubic-bezier(0.4,_0,_0.2,_1)] hover:bg-white/5"
                >
                  <span className="hidden sm:inline">Sign in</span>
                  <span className="sm:hidden">Sign</span>
                </Button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="h-8 w-8 p-0 bg-transparent border-transparent hover:bg-white/5 rounded-lg"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-[oklch(0.9256_0.0194_259.97)] stroke-2" />
                ) : (
                  <Menu className="h-5 w-5 text-[oklch(0.9256_0.0194_259.97)] stroke-2" />
                )}
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div
          className={`md:hidden transition-all duration-300 ${
            isScrolled
              ? "mt-2 mx-2 sm:mx-4 backdrop-blur-[24px] bg-[oklab(0.1363_-0.00682067_-0.0357553_/_0.4)] border border-[oklch(0.2778_0.0461_256.36)] rounded-lg shadow-lg shadow-cyan-500/20"
              : "bg-gray-950/95 backdrop-blur-sm border-t border-[oklch(0.2778_0.0461_256.36)]"
          }`}
        >
          <div className="px-4 py-4 space-y-3">
            <a
              href="#features"
              className="block px-4 py-3 text-sm font-medium text-[oklab(0.9256_-0.00337878_-0.0191035_/_0.8)] rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block px-4 py-3 text-sm font-medium text-[oklab(0.9256_-0.00337878_-0.0191035_/_0.8)] rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="/tos"
              className="block px-4 py-3 text-sm font-medium text-[oklab(0.9256_-0.00337878_-0.0191035_/_0.8)] rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              TOS
            </a>
            <a
              href="/privacy"
              className="block px-4 py-3 text-sm font-medium text-[oklab(0.9256_-0.00337878_-0.0191035_/_0.8)] rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Privacy
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
