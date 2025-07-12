import { EmailTemplate } from "@/components/email-templates/EmailTemplate";
import { Resend } from "resend";
import { ReactElement } from "react";
import { SendEmailPayload } from "@/core";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(req: NextRequest): Promise<Response> {
  const body = (await req.json()) as SendEmailPayload;

  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Hello world",
      react: EmailTemplate({ firstName: body.firstName }) as ReactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
