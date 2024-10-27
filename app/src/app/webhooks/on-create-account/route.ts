import type { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook, type WebhookRequiredHeaders } from "svix";
import { db } from "iara-shared/database";
import { users } from "iara-shared/database/schema";
import { env } from "~/env";

async function handler(request: Request) {
  const payload = (await request.json()) as string;

  const requiredHeader = {
    "svix-id": headers().get("svix-id"),
    "svix-timestamp": headers().get("svix-timestamp"),
    "svix-signature": headers().get("svix-signature"),
  };

  const wh = new Webhook(env.CLERK_WH_SECRET_KEY);

  let data: WebhookEvent;

  try {
    data = wh.verify(
      JSON.stringify(payload),
      requiredHeader as WebhookRequiredHeaders,
    ) as WebhookEvent;
  } catch (error) {
    console.error("create account webhook error: ", error);
    return new Response(null, { status: 400 });
  }

  switch (data.type) {
    case "user.created":
      await createAccountEvent(data.data);
      break;
    default:
      break;
  }

  return new Response("OK", { status: 201 });
}

export const POST = handler;

async function createAccountEvent(user: UserJSON) {
  const payload = {
    id: user.id,
    email: user.email_addresses.map(({ email_address }) => email_address)[0],
    name: `${user.first_name} ${user.last_name}`,
  };

  await db.insert(users).values({
    clerkId: payload.id,
    email: payload.email,
    name: payload.name,
  });
}
