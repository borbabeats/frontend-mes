"use client";

import { Suspense, useEffect } from "react";
import { Authenticated, useIsAuthenticated } from "@refinedev/core";
import { useRouter } from "next/navigation";

function HomeRedirect() {
  const { data: authData, isLoading } = useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && authData?.authenticated) {
      router.push("/dashboard");
    }
  }, [authData, isLoading, router]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return null;
}

export default function IndexPage() {
  return (
    <Suspense>
      <Authenticated key="authenticated" 
        redirectOnFail={"/login"}
      >
        <HomeRedirect />
      </Authenticated>
    </Suspense>
  );
}
