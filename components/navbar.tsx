"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  AI
                </span>
              </div>
              <span className="font-bold text-xl text-primary">Calendar</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <Button
                variant="ghost"
                onClick={() => scrollToSection("features")}
                className="text-foreground hover:text-primary hover:bg-primary/10 font-medium"
              >
                Features
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("ai-capabilities")}
                className="text-foreground hover:text-primary hover:bg-primary/10 font-medium"
              >
                AI Capabilities
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("contact")}
                className="text-foreground hover:text-primary hover:bg-primary/10 font-medium"
              >
                Contact
              </Button>
            </div>
          </div>

          <div className="flex items-center">
            <Button
              asChild
              variant="outline"
              className="bg-transparent hover:bg-primary hover:text-primary-foreground border-primary text-primary transition-all duration-200"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
