import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { content } from "@/lib/content";
import { Wifi, Router, Server, LifeBuoy } from "lucide-react";

const iconMap: { [key: string]: React.ElementType } = {
  Wifi,
  Router,
  Server,
  LifeBuoy,
};

export default function Services() {
  return (
    <section id="services" className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
              Built For Speed
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We provide a complete internet solution for your home or business, from our network right to your screen.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-4">
          {content.services.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <Card key={service.title} className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-primary">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary">
                    <Icon className="h-8 w-8 text-primary transition-colors group-hover:text-primary-foreground" />
                  </div>
                  <CardTitle className="font-headline">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  <p>{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
