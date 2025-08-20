import Link from "next/link";

export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-primary text-primary-foreground py-12 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">AI</span>
              </div>
              <span className="font-bold text-xl">Calendar</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Revolutionizing scheduling with intelligent automation for modern
              professionals.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#integrations"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#about"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#careers"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/80">
            © 2025 AI Calendar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
