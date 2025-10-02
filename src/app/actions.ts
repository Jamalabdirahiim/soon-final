"use server";

import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function submitContactForm(values: z.infer<typeof formSchema>) {
  try {
    // Validate form values
    formSchema.parse(values);

    // Here you would typically send an email or save to a database
    // For this demo, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Form submitted successfully:", values);
    
    return { success: true, message: "Form submitted successfully!" };
  } catch (error) {
    console.error("Form submission error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.errors };
    }
    return { success: false, message: "An unexpected error occurred." };
  }
}
