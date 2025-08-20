import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-card-foreground mb-6 leading-tight">
          Revolutionize Your Scheduling with{" "}
          <span className="text-primary">AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Effortlessly manage your Google Calendar events with intelligent
          automation. Let AI handle the complexity while you focus on what
          matters most.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signin">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
            >
              Get Started Free
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 text-lg bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Watch Demo
          </Button>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">🤖</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600 text-sm">
              Smart scheduling with machine learning
            </p>
          </div>

          <div className="p-6 bg-blue-100 rounded-lg border border-blue-300">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">📅</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Google Sync</h3>
            <p className="text-gray-600 text-sm">
              Seamless calendar integration
            </p>
          </div>

          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Setup</h3>
            <p className="text-gray-600 text-sm">
              Get started in under 2 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
