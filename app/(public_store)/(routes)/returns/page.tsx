import { Metadata } from "next";
import Link from "next/link";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Exchanges - Amader Bazar",
  description:
    "Learn about our hassle-free return and exchange policy. Easy returns within 30 days.",
};

const returnProcess = [
  {
    step: 1,
    title: "Request Return",
    description: "Contact us within 30 days of delivery",
    icon: FileText,
  },
  {
    step: 2,
    title: "Get Approval",
    description: "We'll review and approve your return request",
    icon: CheckCircle,
  },
  {
    step: 3,
    title: "Pack & Ship",
    description: "Pack the item safely and ship it back to us",
    icon: Package,
  },
  {
    step: 4,
    title: "Receive Refund",
    description: "Get your refund within 7-10 business days",
    icon: RefreshCw,
  },
];

const returnableItems = [
  {
    item: "Clothing & Accessories",
    allowed: true,
    condition: "Unworn with tags",
  },
  {
    item: "Electronics",
    allowed: true,
    condition: "Original packaging required",
  },
  { item: "Home & Garden", allowed: true, condition: "Unused condition" },
  { item: "Books", allowed: true, condition: "No writing or damage" },
  { item: "Health & Beauty", allowed: false, condition: "Hygiene reasons" },
  { item: "Perishable Items", allowed: false, condition: "Food safety" },
  { item: "Custom/Personalized", allowed: false, condition: "Made to order" },
  { item: "Gift Cards", allowed: false, condition: "Non-returnable" },
];

export default function ReturnsPage() {
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
          <h1 className="text-4xl font-bold tracking-tight">
            Returns & Exchanges
          </h1>
          <p className="text-xl text-muted-foreground">
            We want you to be completely satisfied with your purchase.
            Here&apos;s our hassle-free return policy.
          </p>
        </div>

        {/* Policy Overview */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-green-600" />
                <CardTitle className="text-green-800 dark:text-green-200">
                  30-Day Return Window
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 dark:text-green-300">
                You have 30 days from delivery to return any eligible item for a
                full refund.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-blue-800 dark:text-blue-200">
                  Free Return Shipping
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 dark:text-blue-300">
                We provide free return shipping labels for all eligible returns
                within Bangladesh.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-purple-800 dark:text-purple-200">
                  Quick Refunds
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 dark:text-purple-300">
                Refunds are processed within 7-10 business days after we receive
                your return.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Return Process */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">How to Return an Item</h2>
          <div className="grid lg:grid-cols-4 gap-6">
            {returnProcess.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.step} className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="w-fit mx-auto mb-2">
                      Step {step.step}
                    </Badge>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* What Can Be Returned */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">What Can Be Returned?</h2>
          <Card>
            <CardHeader>
              <CardTitle>Return Eligibility</CardTitle>
              <CardDescription>
                Check if your item is eligible for return based on our policy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {returnableItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      {item.allowed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-medium">{item.item}</span>
                    </div>
                    <div className="text-right">
                      <Badge variant={item.allowed ? "default" : "destructive"}>
                        {item.allowed ? "Returnable" : "Not Returnable"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.condition}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exchanges */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Exchanges</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Size/Color Exchanges</CardTitle>
                <CardDescription>
                  Exchange for a different size or color of the same item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      Free exchange within 30 days
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Subject to availability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Free shipping both ways</span>
                  </div>
                </div>
                <Button className="w-full">Request Exchange</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Defective Items</CardTitle>
                <CardDescription>
                  Items that arrived damaged or defective
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      Immediate replacement or refund
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      No time limit for defective items
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Free return shipping</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Report Defective Item
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Information */}
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-800 dark:text-orange-200">
                Important Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-orange-700 dark:text-orange-300">
            <p className="text-sm">
              • Items must be in original condition with all tags and packaging
            </p>
            <p className="text-sm">
              • Return shipping is free within Bangladesh only
            </p>
            <p className="text-sm">
              • Refunds will be issued to the original payment method
            </p>
            <p className="text-sm">
              • Custom or personalized items cannot be returned unless defective
            </p>
            <p className="text-sm">
              • Sale items marked as &quot;Final Sale&quot; are not returnable
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">
                Need Help with a Return?
              </h3>
              <p className="text-muted-foreground">
                Our customer service team is here to make your return process as
                smooth as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="mailto:returns@amaderbazar.com">
                    Start Return Request
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/help">Contact Support</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
}
