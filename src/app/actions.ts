"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { Resend } from 'resend';

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = 'axmedc.xakiim@gmail.com';

export async function submitContactForm(values: z.infer<typeof formSchema>) {
  try {
    const validatedData = formSchema.parse(values);

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: TO_EMAIL,
      subject: `New Contact Form Submission from ${validatedData.name}`,
      html: `
        <p>You have a new message from your website contact form:</p>
        <ul>
          <li><strong>Name:</strong> ${validatedData.name}</li>
          <li><strong>Email:</strong> ${validatedData.email}</li>
        </ul>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
      `,
    });
    
    return { success: true, message: "Form submitted successfully!" };
  } catch (error) {
    console.error("Form submission error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.errors };
    }
    return { success: false, message: "An unexpected error occurred while sending the message." };
  }
}

export async function revalidateHome() {
  revalidatePath('/');
}
