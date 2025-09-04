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
  Package,
  Truck,
  Clock,
  MapPin,
  CheckCircle,
  ArrowLeft,
  Calculator,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Information - Amader Bazar",
  description:
    "Learn about our shipping options, delivery times, costs, and tracking information.",
};

const shippingOptions = [
  {
    name: "Standard Delivery",
    description: "Regular delivery to your doorstep",
    timeframe: "3-5 business days",
    cost: "৳60 - ৳120",
    icon: Package,
    features: [
      "Free for orders over ৳1500",
      "Signature required",
      "Track your package",
    ],
  },
  {
    name: "Express Delivery",
    description: "Faster delivery for urgent orders",
    timeframe: "1-2 business days",
    cost: "৳150 - ৳250",
    icon: Truck,
    features: [
      "Next day delivery available",
      "Priority handling",
      "SMS notifications",
    ],
  },
  {
    name: "Same Day Delivery",
    description: "Available in Dhaka city only",
    timeframe: "Within 6 hours",
    cost: "৳200 - ৳350",
    icon: Clock,
    features: ["Order before 2PM", "Dhaka city only", "Real-time tracking"],
  },
];

const deliveryAreas = [
  { city: "Dhaka", time: "1-2 days", available: true },
  { city: "Chittagong", time: "2-3 days", available: true },
  { city: "Sylhet", time: "3-4 days", available: true },
  { city: "Rajshahi", time: "3-4 days", available: true },
  { city: "Khulna", time: "3-5 days", available: true },
  { city: "Barisal", time: "4-5 days", available: true },
  { city: "Rangpur", time: "4-5 days", available: true },
  { city: "Mymensingh", time: "3-4 days", available: true },
];

export default function ShippingPage() {
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
            Shipping Information
          </h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about our shipping options and delivery
            process.
          </p>
        </div>

        {/* Shipping Options */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Shipping Options</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {shippingOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.name} className="relative">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className="h-8 w-8 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{option.name}</CardTitle>
                        <CardDescription>{option.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Delivery Time:
                      </span>
                      <Badge variant="secondary">{option.timeframe}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cost:</span>
                      <span className="font-semibold text-primary">
                        {option.cost}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Features:</span>
                      <ul className="text-sm space-y-1">
                        {option.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Delivery Areas</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Available Delivery Locations
              </CardTitle>
              <CardDescription>
                We deliver to all major cities and districts across Bangladesh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {deliveryAreas.map((area) => (
                  <div
                    key={area.city}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{area.city}</span>
                    </div>
                    <Badge variant={area.available ? "default" : "secondary"}>
                      {area.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Costs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Shipping Costs</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Cost Calculator
                </CardTitle>
                <CardDescription>
                  Shipping costs are calculated based on location and weight
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Inside Dhaka:</span>
                    <span className="font-semibold">৳60 - ৳120</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outside Dhaka:</span>
                    <span className="font-semibold">৳100 - ৳200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Delivery:</span>
                    <span className="font-semibold">+৳100</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-semibold">Free Shipping:</span>
                    <span className="font-semibold text-green-600">
                      Orders over ৳1500
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Important Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">
                    All orders are processed within 24 hours
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">
                    Tracking number provided via email and SMS
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">
                    Delivery during business hours (9AM - 8PM)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Cash on delivery available</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Package insurance included</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Order Tracking</CardTitle>
            <CardDescription>
              Track your package every step of the way
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Once your order is shipped, you&apos;ll receive a tracking number
              via email and SMS. You can track your package status in real-time
              using our tracking system.
            </p>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard/orders">Track Your Orders</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold">
                Questions about shipping?
              </h3>
              <p className="text-muted-foreground">
                Our customer service team is here to help with any
                shipping-related questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/help">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/faq">View FAQ</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
}
