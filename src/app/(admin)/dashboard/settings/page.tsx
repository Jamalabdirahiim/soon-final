
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
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

const navLinkSchema = z.object({
  label: z.string().min(1, "Link label is required"),
  href: z.string().min(1, "Link URL is required"),
});

const contactSchema = z.object({
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Address is required"),
});

const settingsSchema = z.object({
  navLinks: z.array(navLinkSchema),
  contact: contactSchema,
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const settingsDocRef = firestore ? doc(firestore, 'site-content', 'content') : null;
  const { data: settingsData, loading: isLoadingSettings } = useDoc<SettingsFormValues>(settingsDocRef);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      navLinks: [],
      contact: { phone: '', email: '', address: '' },
    },
  });

  const { fields: navLinkFields, append: appendNavLink, remove: removeNavLink } = useFieldArray({
    control: form.control,
    name: "navLinks",
  });

  React.useEffect(() => {
    if (settingsData) {
      form.reset({
        navLinks: settingsData.navLinks || [],
        contact: settingsData.contact || { phone: '', email: '', address: '' },
      });
    }
  }, [settingsData, form]);

  const onSubmit = async (data: SettingsFormValues) => {
    if (!settingsDocRef) return;
    try {
      await setDoc(settingsDocRef, data, { merge: true });
      toast({
        title: "Settings Updated",
        description: "Your site settings have been saved successfully.",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem saving your settings.",
      });
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Navigation Links</CardTitle>
            <CardDescription>Manage the links in your website's header and footer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {navLinkFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                <FormField
                  control={form.control}
                  name={`navLinks.${index}.label`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Link Text</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Services" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`navLinks.${index}.href`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Link URL</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., #services" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="destructive" size="icon" onClick={() => removeNavLink(index)}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Remove Link</span>
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendNavLink({ label: "", href: "" })}
            >
              Add Navigation Link
            </Button>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Update the contact details displayed in the footer and contact section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="contact.phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="+252 61 123 4567" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="contact.email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input placeholder="info@soon.so" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="contact.address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Office Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Makka Al Mukarama Road, Mogadishu, Somalia" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Settings...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </form>
    </Form>
  );
}
