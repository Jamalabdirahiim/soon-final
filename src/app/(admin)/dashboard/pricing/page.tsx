
"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFirestore, useDoc } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Trash } from "lucide-react";

const pricingPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  speed: z.string().min(1, "Speed is required"),
  price: z.string().min(1, "Price is required"),
  homeUse: z.string().min(1, "Home use description is required"),
  businessUse: z.string().min(1, "Business use description is required"),
});

const formSchema = z.object({
  pricingPlans: z.array(pricingPlanSchema),
});

type PricingFormValues = z.infer<typeof formSchema>;

export default function PricingPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const contentDocRef = firestore ? doc(firestore, 'site-content', 'content') : null;
  const { data: contentData, loading: isLoadingContent } = useDoc<PricingFormValues>(contentDocRef);

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pricingPlans: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pricingPlans",
  });

  React.useEffect(() => {
    if (contentData?.pricingPlans) {
      form.reset({ pricingPlans: contentData.pricingPlans });
    }
  }, [contentData, form]);

  const onSubmit = async (data: PricingFormValues) => {
    if (!contentDocRef) return;
    try {
      await setDoc(contentDocRef, data, { merge: true });
      toast({
        title: "Pricing Plans Updated",
        description: "Your pricing plans have been saved successfully.",
      });
    } catch (error) {
      console.error("Error updating pricing plans:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem saving your pricing plans.",
      });
    }
  };

  if (isLoadingContent) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading pricing plans...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b">
        <h2 className="text-2xl font-bold tracking-tight">Pricing Management</h2>
        <p className="text-muted-foreground">Add, edit, or remove pricing plans for your website.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Plan #{index + 1}: {form.watch(`pricingPlans.${index}.name`) || 'New Plan'}</CardTitle>
                        <CardDescription>Details for this pricing tier.</CardDescription>
                    </div>
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove Plan</span>
                    </Button>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name={`pricingPlans.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Essential" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`pricingPlans.${index}.speed`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Speed</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 8Mbps" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`pricingPlans.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (USD per month)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-2 space-y-4">
                    <FormField
                      control={form.control}
                      name={`pricingPlans.${index}.homeUse`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Use Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Great for browsing, email, and social media..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`pricingPlans.${index}.businessUse`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Use Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Perfect for solo entrepreneurs..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: "", speed: "", price: "", homeUse: "", businessUse: "" })}
                >
                Add New Plan
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Pricing Plans"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
