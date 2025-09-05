import { Metadata } from "next";
import Link from "next/link";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { HelpNavigation } from "@/components/help-navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Package,
  RefreshCw,
  Shield,
  FileText,
  ArrowRight,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center - Amader Bazar",
  description:
    "Get help with your orders, shipping, returns, and more. Find answers to frequently asked questions.",
};

const helpSections = [
  {
    title: "Shipping Information",
    description:
      "Learn about our shipping options, delivery times, and tracking.",
    icon: Package,
    href: "/shipping",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    title: "Returns & Exchanges",
    description: "Easy returns and exchanges within 30 days of purchase.",
    icon: RefreshCw,
    href: "/returns",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  {
    title: "Frequently Asked Questions",
    description: "Quick answers to the most common questions.",
    icon: HelpCircle,
    href: "/faq",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information.",
    icon: Shield,
    href: "/privacy",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  {
    title: "Terms of Service",
    description: "Terms and conditions for using our platform.",
    icon: FileText,
    href: "/terms",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
  },
];

export default function HelpCenterPage() {
  return (
    <MaxWidthWrapper>
      <div className="py-12 space-y-12">
        {/* Navigation */}
        <HelpNavigation />

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Help Center</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We&apos;re here to help! Find answers to your questions or get in
            touch with our support team.
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Phone className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Mon-Fri, 9AM-6PM (Bangladesh Time)
              </p>
              <p className="font-medium">+880 1234-567890</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Mail className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-3">
                We&apos;ll respond within 24 hours
              </p>
              <p className="font-medium">support@amaderbazar.com</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Available 24/7 for urgent issues
              </p>
              <Button variant="outline" size="sm">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Help Sections */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center">Browse Help Topics</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card
                  key={section.href}
                  className="group hover:shadow-lg transition-all duration-200"
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg ${section.bgColor} flex items-center justify-center mb-3`}
                    >
                      <Icon className={`h-6 w-6 ${section.color}`} />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={section.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-between group-hover:bg-accent"
                      >
                        Learn More
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-accent/50 rounded-lg p-8 text-center space-y-4">
          <h3 className="text-xl font-semibold">Still need help?</h3>
          <p className="text-muted-foreground">
            Can&apos;t find what you&apos;re looking for? Our support team is
            here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="mailto:support@amaderbazar.com">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="tel:+8801234567890">
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
