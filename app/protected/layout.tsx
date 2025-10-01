// app/layout.tsx (server component)
import { redirect } from "next/navigation";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {

  // block all pages except login if not authenticated
  if (false) {
    redirect("/login");
  }

  return (
    
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* optional shared navbar or sidebar for protected pages */}
      {children}
    </div>
    
  );
}
