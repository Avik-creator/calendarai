import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AiCapabilitiesSection() {
  return (
    <section id="ai-capabilities" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-card-foreground mb-6">
              AI That Actually Understands Your Schedule
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our advanced AI learns from your scheduling patterns, preferences,
              and habits to provide personalized recommendations that save you
              hours every week.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                  <span className="text-primary-foreground text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    Conflict Resolution
                  </h3>
                  <p className="text-muted-foreground">
                    Automatically detects and resolves scheduling conflicts
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    Smart Reminders
                  </h3>
                  <p className="text-muted-foreground">
                    Contextual notifications based on your schedule and location
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    Time Optimization
                  </h3>
                  <p className="text-muted-foreground">
                    Suggests optimal meeting durations and buffer times
                  </p>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Try AI Features
            </Button>
          </div>

          <div className="relative">
            <Card className="border-gray-200 shadow-xl bg-white">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">AI</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Meeting scheduled for 2:00 PM
                      </p>
                      <p className="text-sm text-gray-600">
                        Optimal time found based on your preferences
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-blue-100 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📍</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Location suggestion: Conference Room A
                      </p>
                      <p className="text-sm text-gray-600">
                        Based on attendee locations and availability
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">⏰</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        15-minute buffer added
                      </p>
                      <p className="text-sm text-gray-600">
                        Preventing back-to-back meeting fatigue
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
