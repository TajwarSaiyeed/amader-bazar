import { Metadata } from "next";
import Link from "next/link";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Users,
  FileText,
  Mail,
  Calendar
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - Amader Bazar",
  description: "Learn how we collect, use, and protect your personal information. Your privacy is important to us.",
};

const lastUpdated = "September 1, 2025";

export default function PrivacyPolicyPage() {
  return (
    <MaxWidthWrapper>
      <div className="py-12 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/help" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Help Center
          </Link>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
          <p className="text-xl text-muted-foreground">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>

        {/* Quick Overview */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Quick Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              • We collect information you provide (account details, orders) and some automatic data (website usage)
            </p>
            <p className="text-sm">
              • We use your information to process orders, provide customer service, and improve our services
            </p>
            <p className="text-sm">
              • We don&apos;t sell your personal information to third parties
            </p>
            <p className="text-sm">
              • You can control your data through your account settings or by contacting us
            </p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Information You Provide</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Account Information:</strong> Name, email address, phone number, and password when you create an account</p>
                  <p><strong>Order Information:</strong> Billing and shipping addresses, payment information, and order history</p>
                  <p><strong>Communication:</strong> Messages you send us through customer service, reviews, and feedback</p>
                  <p><strong>Marketing Preferences:</strong> Your choices about receiving promotional communications</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Information We Collect Automatically</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</p>
                  <p><strong>Usage Data:</strong> Pages you visit, time spent on our site, and how you interact with our content</p>
                  <p><strong>Location Data:</strong> General location based on IP address (country/city level)</p>
                  <p><strong>Cookies:</strong> Small files stored on your device to improve your browsing experience</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">Essential Services</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Process and fulfill your orders</li>
                    <li>• Provide customer support</li>
                    <li>• Send order confirmations and updates</li>
                    <li>• Process payments and prevent fraud</li>
                    <li>• Maintain your account and preferences</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Improvements & Marketing</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Improve our website and services</li>
                    <li>• Personalize your shopping experience</li>
                    <li>• Send promotional offers (with consent)</li>
                    <li>• Analyze usage patterns and trends</li>
                    <li>• Develop new features and products</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                How We Share Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Service Providers</h3>
                  <p className="text-sm text-muted-foreground">
                    We share information with trusted partners who help us operate our business, including payment processors, shipping companies, and technology providers. These partners are contractually required to protect your information.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Legal Requirements</h3>
                  <p className="text-sm text-muted-foreground">
                    We may disclose information when required by law, to protect our rights, or to investigate fraud or security issues.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Business Transfers</h3>
                  <p className="text-sm text-muted-foreground">
                    If our business is sold or merged, your information may be transferred to the new owners, who must continue to protect it according to this policy.
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    ✓ We never sell your personal information to third parties for their marketing purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Technical Safeguards</h3>
                  <ul className="text-sm space-y-1">
                    <li>• SSL encryption for all data transmission</li>
                    <li>• Secure data centers with access controls</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Encrypted storage of sensitive information</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Organizational Measures</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Limited access to personal data</li>
                    <li>• Employee training on data protection</li>
                    <li>• Regular privacy impact assessments</li>
                    <li>• Incident response procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">Account Control</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Update your profile information</li>
                    <li>• Change your communication preferences</li>
                    <li>• Delete your account and data</li>
                    <li>• Download your personal data</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Marketing Control</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Unsubscribe from emails anytime</li>
                    <li>• Opt out of SMS notifications</li>
                    <li>• Disable personalized advertising</li>
                    <li>• Control cookie preferences</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  To exercise any of these rights, contact us at privacy@amaderbazar.com or through your account settings.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                We use cookies and similar technologies to improve your browsing experience, analyze site traffic, and personalize content.
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">Essential Cookies</h3>
                  <p className="text-sm text-muted-foreground">Required for the website to function properly (shopping cart, login status)</p>
                </div>
                <div>
                  <h3 className="font-semibold">Analytics Cookies</h3>
                  <p className="text-sm text-muted-foreground">Help us understand how visitors use our website to improve performance</p>
                </div>
                <div>
                  <h3 className="font-semibold">Marketing Cookies</h3>
                  <p className="text-sm text-muted-foreground">Used to deliver relevant advertisements and track campaign effectiveness</p>
                </div>
              </div>
              <p className="text-sm">
                You can control cookies through your browser settings, but disabling certain cookies may affect website functionality.
              </p>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. 
                We&apos;ll notify you of significant changes by email or through a prominent notice on our website.
              </p>
              <p className="text-sm">
                The &quot;Last Updated&quot; date at the top of this policy indicates when the most recent changes were made.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Questions About Privacy?</h3>
              <p className="text-muted-foreground">
                If you have any questions about this privacy policy or how we handle your personal information, we&apos;re here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="mailto:privacy@amaderbazar.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Privacy Team
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/help">
                    Contact Support
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
}