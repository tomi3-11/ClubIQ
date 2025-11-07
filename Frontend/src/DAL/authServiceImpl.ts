"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function setRole(userId: string, role: string): Promise<void> {
  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: { role },
    });
    console.log({ message: res.publicMetadata });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err));
  }
}

export async function removeRole(userId: string): Promise<void> {
  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: { role: null },
    });
    console.log({ message: res.publicMetadata });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err));
  }
}
