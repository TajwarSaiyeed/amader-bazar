import { Metadata } from "next";
import Link from "next/link";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  Scale,
  Shield,
  AlertTriangle,
  Users,
  CreditCard,
  Calendar,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - Amader Bazar",
  description:
    "Terms and conditions for using Amader Bazar platform. Please read these terms carefully before using our services.",
};

const lastUpdated = "September 1, 2025";
const effectiveDate = "September 1, 2025";

export default function TermsOfServicePage() {
  return (
    <MaxWidthWrapper>
      <div className="py-12 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <Link
            href="/help"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Help Center
          </Link>
          <div className="flex items-center gap-3">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">
              Terms of Service
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Effective: {effectiveDate}</span>
            </div>
          </div>
          <p className="text-xl text-muted-foreground">
            Please read these terms and conditions carefully before using our
            services.
          </p>
        </div>

        {/* Important Notice */}
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <AlertTriangle className="h-5 w-5" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-orange-700 dark:text-orange-300">
            <p className="text-sm">
              By accessing and using Amader Bazar, you agree to be bound by
              these Terms of Service. If you do not agree to these terms, please
              do not use our platform.
            </p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                These Terms of Service (&quot;Terms&quot;) constitute a legally
                binding agreement between you and Amader Bazar (&quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;) regarding your use of our
                website, mobile application, and services.
              </p>
              <p className="text-sm">
                By creating an account, making a purchase, or otherwise using
                our services, you acknowledge that you have read, understood,
                and agree to be bound by these Terms and our Privacy Policy.
              </p>
              <p className="text-sm">
                We reserve the right to modify these Terms at any time. Changes
                will be effective immediately upon posting. Your continued use
                of our services after any changes constitutes acceptance of the
                new Terms.
              </p>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                2. Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">To use our services, you must:</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Be at least 18 years old or have parental consent</li>
                <li>
                  • Provide accurate and complete information during
                  registration
                </li>
                <li>
                  • Have the legal capacity to enter into binding agreements
                </li>
                <li>
                  • Not be prohibited from using our services under applicable
                  law
                </li>
              </ul>
              <p className="text-sm">
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account.
              </p>
            </CardContent>
          </Card>

          {/* Account Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>3. Account Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Account Security</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Keep your password secure and confidential</li>
                  <li>• Notify us immediately of any unauthorized use</li>
                  <li>• Use accurate and up-to-date information</li>
                  <li>• Maintain only one account per person</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Prohibited Activities</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Using our services for illegal purposes</li>
                  <li>
                    • Attempting to gain unauthorized access to our systems
                  </li>
                  <li>• Interfering with or disrupting our services</li>
                  <li>• Creating fake accounts or impersonating others</li>
                  <li>• Violating intellectual property rights</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Orders and Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                4. Orders and Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Order Process</h3>
                <p className="text-sm">
                  When you place an order, you make an offer to purchase
                  products at the listed prices. We reserve the right to accept
                  or decline any order. Order confirmation constitutes
                  acceptance.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Pricing and Availability</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Prices are subject to change without notice</li>
                  <li>
                    • Product availability is not guaranteed until order
                    confirmation
                  </li>
                  <li>• We reserve the right to correct pricing errors</li>
                  <li>
                    • All prices include applicable taxes unless stated
                    otherwise
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Payment Terms</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Payment is due at the time of order placement</li>
                  <li>
                    • We accept various payment methods as displayed at checkout
                  </li>
                  <li>
                    • You authorize us to charge your payment method for all
                    fees
                  </li>
                  <li>• Failed payments may result in order cancellation</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Shipping and Delivery */}
          <Card>
            <CardHeader>
              <CardTitle>5. Shipping and Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                We will make reasonable efforts to deliver products within the
                estimated timeframes, but delivery dates are not guaranteed.
                Risk of loss transfers to you upon delivery.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold">Delivery Terms</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Delivery times are estimates and may vary</li>
                  <li>• You must provide accurate delivery information</li>
                  <li>
                    • Additional fees may apply for special delivery requests
                  </li>
                  <li>
                    • We are not liable for delays caused by circumstances
                    beyond our control
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Returns and Refunds */}
          <Card>
            <CardHeader>
              <CardTitle>6. Returns and Refunds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Our return policy allows returns within 30 days of delivery for
                eligible items. Please refer to our detailed Return Policy for
                complete terms and conditions.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold">Refund Processing</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>
                    • Refunds will be issued to the original payment method
                  </li>
                  <li>
                    • Processing time is 7-10 business days after we receive the
                    return
                  </li>
                  <li>• Return shipping costs may be deducted from refunds</li>
                  <li>
                    • Some items are not eligible for return due to hygiene or
                    safety reasons
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>7. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                All content on our platform, including text, graphics, logos,
                images, and software, is owned by or licensed to Amader Bazar
                and is protected by copyright and other intellectual property
                laws.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold">Usage Rights</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>
                    • You may use our content only for personal, non-commercial
                    purposes
                  </li>
                  <li>
                    • You may not copy, reproduce, or distribute our content
                    without permission
                  </li>
                  <li>
                    • Product images and descriptions are for display purposes
                    only
                  </li>
                  <li>
                    • Brand names and trademarks belong to their respective
                    owners
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                8. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                To the maximum extent permitted by law, Amader Bazar shall not
                be liable for any indirect, incidental, special, consequential,
                or punitive damages, including but not limited to loss of
                profits, data, or business opportunities.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold">Service Availability</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>
                    • We provide services on an &quot;as is&quot; and &quot;as
                    available&quot; basis
                  </li>
                  <li>
                    • We do not guarantee uninterrupted or error-free service
                  </li>
                  <li>
                    • Maintenance and updates may temporarily affect
                    availability
                  </li>
                  <li>
                    • Force majeure events may impact our ability to provide
                    services
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Dispute Resolution */}
          <Card>
            <CardHeader>
              <CardTitle>9. Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                We encourage resolving disputes through direct communication. If
                you have a concern, please contact our customer service team
                first.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold">Governing Law</h3>
                <p className="text-sm">
                  These Terms are governed by the laws of Bangladesh. Any
                  disputes will be resolved in the courts of Dhaka, Bangladesh.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>10. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                We may suspend or terminate your account at our discretion if
                you violate these Terms or engage in harmful activities. You may
                also terminate your account at any time by contacting us.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold">Effect of Termination</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>
                    • Your right to use our services will cease immediately
                  </li>
                  <li>
                    • Outstanding orders and obligations will remain in effect
                  </li>
                  <li>
                    • We may retain certain information as required by law
                  </li>
                  <li>
                    • Provisions that should survive termination will continue
                    to apply
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                If you have any questions about these Terms of Service, please
                contact us:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>Email: legal@amaderbazar.com</span>
                </div>
                <div className="text-sm">
                  <p>
                    <strong>Amader Bazar</strong>
                  </p>
                  <p>Dhaka, Bangladesh</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">
                Questions About These Terms?
              </h3>
              <p className="text-muted-foreground">
                If you need clarification on any of these terms or have legal
                questions, our team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="mailto:legal@amaderbazar.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Legal Team
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/help">Help Center</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
}
