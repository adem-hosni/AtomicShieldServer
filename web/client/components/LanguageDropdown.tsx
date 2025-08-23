import React, { useState } from "react";
import { Languages, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useLanguage,
  SUPPORTED_LANGUAGES,
  Language,
} from "@/hooks/use-language";
import { cn } from "@/lib/utils";

interface LanguageDropdownProps {
  variant?: "navbar" | "sidebar" | "mobile";
  className?: string;
}

export function LanguageDropdown({
  variant = "navbar",
  className,
}: LanguageDropdownProps) {
  const { currentLanguage, setLanguage, isLoading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (language: Language) => {
    setIsOpen(false);
    await setLanguage(language);
  };

  const getButtonClasses = () => {
    switch (variant) {
      case "navbar":
        return "h-8 w-8 sm:h-10 sm:w-10 p-0 bg-transparent border-transparent hover:bg-white/5 rounded-lg transition-all duration-200";
      case "sidebar":
        return "h-8 w-8 p-0 bg-transparent hover:bg-sidebar-accent rounded-lg transition-all duration-200";
      case "mobile":
        return "w-full justify-start px-4 py-3 h-auto bg-transparent border-transparent hover:bg-white/5 rounded-lg";
      default:
        return "";
    }
  };

  const getIconClasses = () => {
    switch (variant) {
      case "navbar":
        return "h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.9256_0.0194_259.97)] stroke-2";
      case "sidebar":
        return "h-4 w-4 text-sidebar-foreground/70";
      case "mobile":
        return "h-5 w-5 text-[oklch(0.9256_0.0194_259.97)] stroke-2 mr-3";
      default:
        return "";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Change language"
          className={cn(getButtonClasses(), className)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2
              className={cn(
                getIconClasses().replace("text-", "text-cyan-400 animate-spin"),
              )}
            />
          ) : (
            <>
              <Languages className={getIconClasses()} />
              {variant === "mobile" && <span>Change Language</span>}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={variant === "navbar" ? "end" : "start"}
        className="w-48 bg-gray-950/95 backdrop-blur-sm border border-gray-700"
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-800/50 text-gray-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </div>
            {currentLanguage.code === language.code && (
              <Check className="h-4 w-4 text-cyan-400" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
