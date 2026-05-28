import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SSO() {
  //check if they are admin or regular user
  //redirect accordingly
  const user = await currentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const role = user.publicMetadata.role;
  if (role === "admin") {
    redirect("/admin/dashboard");
  } else if (role === "user") {
    redirect("/member/dashboard");
  } else {
    throw new Error("User role is not defined");
  }

  return null;
}
