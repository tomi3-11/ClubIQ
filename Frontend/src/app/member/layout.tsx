import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const role = user.publicMetadata.role;
  if (role !== "user") {
    redirect("/auth/sso");
  }

  return <>{children}</>;
}
