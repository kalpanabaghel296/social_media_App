import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
import { createUser } from '../../../../../actions/user.action';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Create new Svix instance with the signing secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If headers are missing, return an error response
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Parse request body
  const payload = await req.json();

  let evt: WebhookEvent;

  // Verify the webhook signature
  try {
    evt = wh.verify(JSON.stringify(payload), {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  // Process the webhook event
  const { id } = evt.data as { id: string };
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { email_addresses, image_url, first_name, last_name, username } = evt.data;

    const user = {
      clerkId: id,
      email: email_addresses?.[0]?.email_address || '', // Safely access the email address
      photo: image_url || '', // Provide a fallback
      firstName: first_name || '', // Provide a fallback
      lastName: last_name || '', // Provide a fallback
      username: username || '', // Provide a fallback
    };

    console.log('Creating user:', user);

    // Create the user in your database
    const newUser = await createUser(user);

    if (newUser) {
      // Update Clerk user's metadata using Clerk SDK
      await (await clerkClient()).users.updateUser(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return NextResponse.json({
      message: 'New user created',
      user: newUser,
    });
  }

  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log('Webhook payload:', payload);

  return new Response('Webhook received', { status: 200 });
}