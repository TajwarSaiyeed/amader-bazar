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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  Package,
  CreditCard,
  Truck,
  RefreshCw,
  Shield,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - Amader Bazar",
  description:
    "Find quick answers to the most common questions about shopping, shipping, returns, and more.",
};

const faqCategories = [
  {
    id: "orders",
    title: "Orders & Payment",
    icon: CreditCard,
    questions: [
      {
        question: "How do I place an order?",
        answer:
          "To place an order, browse our products, add items to your cart, and proceed to checkout. You'll need to provide your shipping information and choose a payment method. We accept credit cards, debit cards, mobile banking (bKash, Nagad, Rocket), and cash on delivery.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept Visa, MasterCard, American Express, mobile banking (bKash, Nagad, Rocket), bank transfers, and cash on delivery. All online payments are processed securely through our payment partners.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer:
          "You can modify or cancel your order within 2 hours of placing it, provided it hasn't been processed for shipping. Contact our customer service team immediately for assistance.",
      },
      {
        question: "How do I track my order?",
        answer:
          "Once your order ships, you'll receive a tracking number via email and SMS. You can track your package using this number on our website or the courier's tracking page.",
      },
      {
        question: "What if my payment fails?",
        answer:
          "If your payment fails, try using a different payment method or contact your bank. You can also choose cash on delivery as an alternative payment option.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    icon: Truck,
    questions: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping takes 3-5 business days, express shipping takes 1-2 business days, and same-day delivery is available in Dhaka city. Delivery times may vary during peak seasons or due to weather conditions.",
      },
      {
        question: "Do you offer free shipping?",
        answer:
          "Yes! We offer free standard shipping on orders over ৳1500. For orders under ৳1500, shipping costs range from ৳60-200 depending on your location.",
      },
      {
        question: "Do you deliver outside Bangladesh?",
        answer:
          "Currently, we only deliver within Bangladesh. We're working on expanding our delivery network to other countries in the future.",
      },
      {
        question: "What if I'm not home during delivery?",
        answer:
          "Our delivery partner will attempt delivery twice. If you're not available, they'll leave a note with instructions to reschedule delivery or arrange pickup from the nearest collection point.",
      },
      {
        question: "Can I change my delivery address?",
        answer:
          "You can change your delivery address before your order is shipped. Contact our customer service team as soon as possible to make changes.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    icon: RefreshCw,
    questions: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Some items like personal care products and custom items are not returnable for hygiene reasons.",
      },
      {
        question: "How do I return an item?",
        answer:
          "Contact our customer service team to initiate a return. We'll provide you with a return shipping label and instructions. Pack the item securely and ship it back to us using the provided label.",
      },
      {
        question: "How long does it take to get my refund?",
        answer:
          "Refunds are processed within 7-10 business days after we receive your returned item. The time it takes for the refund to appear in your account depends on your payment method and bank.",
      },
      {
        question: "Can I exchange an item instead of returning it?",
        answer:
          "Yes, we offer exchanges for different sizes or colors of the same item, subject to availability. Contact us within 30 days of delivery to arrange an exchange.",
      },
      {
        question: "Who pays for return shipping?",
        answer:
          "We provide free return shipping labels for eligible returns within Bangladesh. For exchanges due to sizing issues, we cover both the return and reshipping costs.",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Profile",
    icon: Users,
    questions: [
      {
        question: "Do I need an account to shop?",
        answer:
          "While you can browse our products without an account, you'll need to create one to place orders, track purchases, and access exclusive features like wishlists and order history.",
      },
      {
        question: "How do I create an account?",
        answer:
          "Click the 'Sign In' button and then select 'Create Account'. You can sign up using your email address or social media accounts (Google, Facebook). Verify your email to activate your account.",
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer:
          "Click 'Forgot Password' on the sign-in page and enter your email address. We'll send you a reset link. Follow the instructions in the email to create a new password.",
      },
      {
        question: "How do I update my profile information?",
        answer:
          "Log into your account and go to 'My Profile'. You can update your name, email, phone number, and addresses. Make sure to save your changes after updating.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can request account deletion by contacting our customer service team. Please note that this action is permanent and will remove all your order history and saved information.",
      },
    ],
  },
  {
    id: "products",
    title: "Products & Inventory",
    icon: Package,
    questions: [
      {
        question: "How do I know if an item is in stock?",
        answer:
          "Product availability is shown on each product page. If an item is out of stock, you can sign up for notifications to be alerted when it's back in stock.",
      },
      {
        question: "Are your product images accurate?",
        answer:
          "We strive to show accurate product images and descriptions. However, actual colors may vary slightly due to monitor settings and lighting. If you're not satisfied with your purchase, our return policy applies.",
      },
      {
        question: "Do you offer product warranties?",
        answer:
          "Yes, we offer manufacturer warranties on electronics and appliances. Warranty terms vary by product and manufacturer. Warranty information is provided on the product page.",
      },
      {
        question: "Can I get a price match?",
        answer:
          "We offer competitive prices but don't have a formal price matching policy. However, we regularly review our prices to ensure they're competitive in the market.",
      },
      {
        question: "Do you restock sold-out items?",
        answer:
          "We regularly restock popular items. Sign up for stock notifications on the product page to be notified when the item is available again.",
      },
    ],
  },
  {
    id: "security",
    title: "Security & Privacy",
    icon: Shield,
    questions: [
      {
        question: "Is my personal information safe?",
        answer:
          "Yes, we take data security seriously. We use SSL encryption for all transactions and follow industry best practices to protect your personal information. Read our Privacy Policy for details.",
      },
      {
        question: "Are online payments secure?",
        answer:
          "Absolutely. We use secure payment gateways that comply with international security standards. Your payment information is encrypted and never stored on our servers.",
      },
      {
        question: "How do you use my data?",
        answer:
          "We use your data to process orders, provide customer service, and improve your shopping experience. We don't sell your personal information to third parties. See our Privacy Policy for complete details.",
      },
      {
        question: "Can I opt out of marketing emails?",
        answer:
          "Yes, you can unsubscribe from marketing emails at any time by clicking the unsubscribe link in any email or by updating your preferences in your account settings.",
      },
      {
        question: "What should I do if I suspect fraudulent activity?",
        answer:
          "If you notice any suspicious activity on your account or unauthorized charges, contact us immediately. Change your password and review your recent orders and account activity.",
      },
    ],
  },
];

export default function FAQPage() {
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
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground">
            Find quick answers to the most common questions about shopping with
            Amader Bazar.
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search frequently asked questions..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    {category.title}
                  </CardTitle>
                  <CardDescription>
                    Common questions about {category.title.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.id}-${index}`}
                      >
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Still have questions?</h3>
              <p className="text-muted-foreground">
                Can&apos;t find the answer you&apos;re looking for? Our support
                team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="mailto:support@amaderbazar.com">
                    Contact Support
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
