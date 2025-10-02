import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Briefcase, Home, Star } from "lucide-react";

const pricingPlans = [
  {
    name: "Essential",
    speed: "8Mbps",
    price: "30",
    isFeatured: false,
    homeUse: "Great for browsing, email, and social media on a few devices.",
    businessUse: "Perfect for solo entrepreneurs and low-traffic guest Wi-Fi.",
  },
  {
    name: "Performance",
    speed: "15Mbps",
    price: "50",
    isFeatured: true,
    homeUse: "Ideal for HD streaming, online gaming, and a busy smart home.",
    businessUse: "Supports small teams, video calls, and regular cloud uploads.",
  },
  {
    name: "Power",
    speed: "25Mbps",
    price: "80",
    isFeatured: false,
    homeUse: "Flawless 4K streaming, competitive gaming, and many users.",
    businessUse: "Best for growing teams, frequent large file transfers, and VoIP.",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pricing</div>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
              Plans for Everyone
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Powerful internet for your home and business. Simple, transparent pricing.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-sm gap-8 md:max-w-none md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                plan.isFeatured ? 'border-primary border-2 ring-4 ring-primary/10' : 'border'
              }`}
            >
              {plan.isFeatured && (
                <div className="bg-primary text-primary-foreground text-center py-1.5 px-4 text-sm font-semibold rounded-t-lg -mt-px flex items-center justify-center gap-2">
                  <Star className="w-4 h-4" /> Most Popular
                </div>
              )}
              <CardHeader className="items-center text-center pt-8">
                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold tracking-tight">${plan.price}</span>
                  <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                </div>
                <p className="text-lg font-semibold text-primary">{plan.speed}</p>
              </CardHeader>
              <CardContent className="flex-grow space-y-6 px-8">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span><strong className="text-foreground">For Home:</strong> {plan.homeUse}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span><strong className="text-foreground">For Business:</strong> {plan.businessUse}</span>
                  </div>
                </div>
                 <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Unlimited Data</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>No Contracts</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>24/7 Support</span>
                    </li>
                </ul>
              </CardContent>
              <CardFooter className="p-6">
                <Button className="w-full" size="lg" variant={plan.isFeatured ? 'default' : 'outline'}>
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
