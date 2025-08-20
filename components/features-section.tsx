import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FeaturesSection() {
  const features = [
    {
      title: "Smart Scheduling",
      description:
        "AI automatically finds the best times for your meetings based on your preferences and availability.",
      icon: "🤖",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Google Calendar Sync",
      description:
        "Seamlessly integrates with your existing Google Calendar without disrupting your workflow.",
      icon: "📅",
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Intelligent Suggestions",
      description:
        "Get smart recommendations for meeting locations, durations, and optimal scheduling times.",
      icon: "💡",
      color: "bg-chart-3/50 text-chart-3",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-card-foreground mb-4">
            Powerful Features for Modern Professionals
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how AI Calendar transforms your scheduling experience with
            cutting-edge technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center text-2xl mb-4`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-card-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </CardDescription>
                <Button variant="link" className="text-primary p-0 h-auto">
                  Learn More →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
