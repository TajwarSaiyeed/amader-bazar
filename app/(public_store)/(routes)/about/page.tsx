import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Metadata } from "next";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Truck,
  Shield,
  Heart,
  Users,
  Award,
  Clock,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Amader Bazar",
  description:
    "Learn more about Amader Bazar - your trusted online marketplace for daily needs. Discover our story, mission, and commitment to serving our customers.",
};

export default function AboutPage() {
  const features = [
    {
      icon: ShoppingBag,
      title: "Wide Product Range",
      description:
        "From daily essentials to specialty items, we have everything you need in one place.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Quick and reliable delivery service to get your orders to you on time.",
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description:
        "Your data and transactions are protected with industry-standard security measures.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description:
        "We prioritize customer satisfaction and provide exceptional service every time.",
    },
  ];

  const stats = [
    { label: "Happy Customers", value: "10K+", icon: Users },
    { label: "Products Available", value: "5K+", icon: ShoppingBag },
    { label: "Years of Service", value: "5+", icon: Clock },
    { label: "Cities Covered", value: "20+", icon: MapPin },
  ];

  return (
    <MaxWidthWrapper>
      <div className="py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="space-y-4">
            <Badge variant="outline" className="text-sm px-3 py-1">
              About Amader Bazar
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Your Trusted <span className="text-primary">Marketplace</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Amader Bazar is more than just an online store. We&apos;re your
              reliable partner for all daily needs, bringing quality products
              and exceptional service right to your doorstep.
            </p>
          </div>

          <div className="relative w-full max-w-4xl mx-auto h-96 rounded-2xl overflow-hidden">
            <Image
              src="/logo.png"
              alt="Amader Bazar Store"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </section>

        {/* Story Section */}
        <section className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm">
                Our Story
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                Built for the Community
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Founded with a simple mission: to make quality products
                accessible to everyone. We started as a small local business and
                have grown into a trusted online marketplace serving thousands
                of customers.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our journey began when we realized that people needed a
                reliable, convenient way to shop for their daily essentials.
                Today, we continue to innovate and expand our services to better
                serve our community.
              </p>
            </div>
          </div>

          <div className="relative">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-0 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center space-y-2">
                      <stat.icon className="h-8 w-8 mx-auto text-primary" />
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="text-sm">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              What Makes Us Different
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We&apos;re committed to providing an exceptional shopping
              experience with features designed around your needs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0 space-y-4">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-muted/30 rounded-2xl p-8 md:p-12 text-center space-y-6">
          <div className="space-y-4">
            <Badge variant="outline" className="text-sm">
              Our Mission
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              Empowering Communities Through Commerce
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We believe that everyone deserves access to quality products at
              fair prices. Our mission is to bridge the gap between customers
              and quality goods, while supporting local businesses and fostering
              economic growth in our communities.
            </p>
          </div>

          <div className="flex items-center justify-center pt-4">
            <Award className="h-16 w-16 text-primary" />
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="text-sm">
              Get in Touch
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              We&apos;d Love to Hear From You
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions, suggestions, or just want to say hello? We&apos;re
              always here to help and improve your shopping experience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-2xl mx-auto">
            <Card className="p-6 text-center">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Visit Us</h3>
                  <p className="text-sm text-muted-foreground">Bangladesh</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Join our growing family
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Support</h3>
                  <p className="text-sm text-muted-foreground">
                    24/7 customer service
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </MaxWidthWrapper>
  );
}
