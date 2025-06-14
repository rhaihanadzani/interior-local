"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

const AppShell = ({ children }) => {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
};
export default AppShell;
