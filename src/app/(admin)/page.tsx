
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SoonLogo } from "@/components/soon-logo";
import { login } from "./actions";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function AdminLoginPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "admin@soon.so", password: "password" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const result = await login(formData);

      if (result && !result.success) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.error || "Invalid credentials. Please try again.",
        });
      }
      // If login is successful, the server action will redirect automatically.
      // No need for client-side redirection here.
    } catch (error) {
       // The redirect() function throws an error to signal the navigation, 
       // so we catch it here to prevent it from bubbling up.
       // We only show a toast for actual login failures.
       if ((error as any)?.digest?.startsWith('NEXT_REDIRECT')) {
         console.log('Redirecting...');
       } else {
         toast({
            variant: "destructive",
            title: "Login Failed",
            description: "An unexpected error occurred. Please try again.",
         });
       }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <SoonLogo />
          </div>
          <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@soon.so" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <p className="mt-4 text-xs text-muted-foreground">
        Demo credentials: admin@soon.so / password
      </p>
    </div>
  );
}
