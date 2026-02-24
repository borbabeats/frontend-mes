
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated } from "@refinedev/core";

export default function LoginLayout({
  children,
}: React.PropsWithChildren) {
  const { data: authData, isLoading } = useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && authData?.authenticated) {
      router.push("/dashboard");
    }
  }, [authData, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}