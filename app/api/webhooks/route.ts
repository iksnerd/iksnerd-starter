import { Webhook } from "svix";
import { headers } from "next/headers";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import {
  createClerkUserInFirebase,
  deleteClerkUserInFirebase,
  getClerkUserFromFirebase,
  updateClerkUserInFirebase,
} from "@/lib/application/create-clerk-user-in-firebase";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  const { id, organization_memberships } = evt.data as UserJSON;

  const userOrgMembership = organization_memberships
    ? organization_memberships[0]
    : null;
  const eventType = evt.type;

  const orgId = userOrgMembership ? userOrgMembership.id : "";
  console.log("orgId:", orgId);

  if (eventType === "user.created" && id) {
    const { first_name, last_name, email_addresses } = evt.data as UserJSON;
    console.log("userId:", id);
    await createClerkUserInFirebase({
      userData: {
        email: email_addresses[0].email_address,
        name:
          first_name && last_name
            ? `${first_name} ${last_name}`
            : "default name",
      },
      userId: id,
    });
  }

  if (eventType === "user.updated" && id) {
    const { first_name, last_name, email_addresses } = evt.data as UserJSON;
    const firebaseUser = await getClerkUserFromFirebase(id);

    if (!firebaseUser) {
      return new Response("User not found in Firebase", { status: 404 });
    }

    await updateClerkUserInFirebase({
      userData: {
        email: email_addresses[0].email_address,
        name:
          first_name && last_name
            ? `${first_name} ${last_name}`
            : "default name",
      },
      userId: id,
    });
  }

  if (eventType === "user.deleted" && id) {
    // TODO delete associated data in Firebase ?
    await deleteClerkUserInFirebase(id);
  }

  return new Response("Webhook received", { status: 200 });
}
