// app/page.tsx
import { redirect } from "next/navigation";
/* import { getCurrentUser } from "@/src/application/getCurrentUser"; */

export default async function HomePage() {
  /* const user = await getCurrentUser(); // server-side check */

  // TODO: Replace with real auth check
  const isAuthenticated = false; // Replace with actual auth logic
  if (isAuthenticated) {
    redirect("/protected/dashboard"); // logged-in users go to dashboard
  } else {
    redirect("/login"); // not logged-in users go to login
  }

  return null; // nothing renders because of redirect
}