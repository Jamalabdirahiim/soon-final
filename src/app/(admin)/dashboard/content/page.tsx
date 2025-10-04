
"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

const heroSchema = z.object({
  headline: z.string().min(1, "Headline is required"),
  subheadline: z.string().min(1, "Subheadline is required"),
});

const serviceSchema = z.object({
  title: z.string().min(1, "Service title is required"),
  description: z.string().min(1, "Service description is required"),
});

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

const contentSchema = z.object({
  hero: heroSchema,
  services: z.array(serviceSchema),
  faq: z.array(faqSchema),
});

type ContentFormValues = z.infer<typeof contentSchema>;

export default function ContentPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const contentDocRef = firestore ? doc(firestore, 'site-content', 'content') : null;
  const { data: contentData, loading: isLoadingContent } = useDoc<ContentFormValues>(contentDocRef);

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      hero: { headline: "", subheadline: "" },
      services: [],
      faq: [],
    },
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control: form.control,
    name: "faq",
  });

  React.useEffect(() => {
    if (contentData) {
      form.reset(contentData);
    }
  }, [contentData, form]);

  const onSubmit = async (data: ContentFormValues) => {
    if (!contentDocRef) return;
    try {
      await setDoc(contentDocRef, data);
      toast({
        title: "Content Updated",
        description: "Your website content has been saved successfully.",
      });
    } catch (error) {
      console.error("Error updating content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem saving your changes.",
      });
    }
  };

  if (isLoadingContent) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading content...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>
              This is the main text that appears at the top of your homepage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="hero.headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input placeholder="The Future of Connectivity. Delivered." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hero.subheadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-headline</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Get the fastest and most reliable internet..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
            <CardDescription>
              Manage the services that are displayed on your homepage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {serviceFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                <h4 className="font-semibold">Service #{index + 1}</h4>
                <FormField
                  control={form.control}
                  name={`services.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Service Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`services.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Service Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="destructive" size="sm" onClick={() => removeService(index)}>
                  Remove Service
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendService({ title: "", description: "" })}
            >
              Add Service
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Manage the FAQ section.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {faqFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                 <h4 className="font-semibold">FAQ #{index + 1}</h4>
                <FormField
                  control={form.control}
                  name={`faq.${index}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Input placeholder="Question" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`faq.${index}.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Answer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="destructive" size="sm" onClick={() => removeFaq(index)}>
                  Remove FAQ
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendFaq({ question: "", answer: "" })}
            >
              Add FAQ
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save All Content"
          )}
        </Button>
      </form>
    </Form>
  );
}

    