import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, GaugeCircle, Building2 } from "lucide-react";

const pricingPlans = [
  {
    speed: "8Mbps",
    price: "30",
    isFeatured: false,
    description: "Good for browsing, email, and social media.",
  },
  {
    speed: "15Mbps",
    price: "50",
    isFeatured: true,
    description: "Great for HD streaming, gaming, and multiple users.",
  },
  {
    speed: "25Mbps",
    price: "80",
    isFeatured: false,
    description: "Best for 4K streaming, large files, and smart homes.",
  },
];

const valueProps = [
  {
    icon: Calendar,
    title: "30-Day Plans",
    description: "All plans are billed monthly with no long-term contracts."
  },
  {
    icon: GaugeCircle,
    title: "High Speed",
    description: "Get the same super-fast speed for uploads and downloads."
  },
  {
    icon: Building2,
    title: "Home & Business",
    description: "Reliable internet for both your home and your business."
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pricing</div>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
              Simple, Clear Plans
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the speed you need. No hidden fees, no surprises.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-sm gap-8 md:max-w-4xl md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card key={plan.speed} className={`flex flex-col rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-2 ${plan.isFeatured ? 'border-primary border-2 shadow-lg' : ''}`}>
              {plan.isFeatured && (
                <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-semibold rounded-t-lg -mt-px">
                  Most Popular
                </div>
              )}
              <CardHeader className="items-center text-center">
                <CardTitle className="font-headline text-4xl">{plan.speed}</CardTitle>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-grow items-center text-center">
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="ml-1 text-xl text-muted-foreground">/mo</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.isFeatured ? 'default' : 'outline'}>
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-16 grid gap-8 md:grid-cols-3">
            {valueProps.map((prop) => {
              const Icon = prop.icon;
              return (
                <div key={prop.title} className="flex flex-col items-center text-center gap-2">
                  <Icon className="w-10 h-10 text-primary" />
                  <h3 className="text-lg font-bold">{prop.title}</h3>
                  <p className="text-sm text-muted-foreground">{prop.description}</p>
                </div>
              )
            })}
        </div>
      </div>
    </section>
  );
}
