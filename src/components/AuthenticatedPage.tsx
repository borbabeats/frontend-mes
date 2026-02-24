"use client";

import { Authenticated } from "@refinedev/core";
import { Suspense } from "react";

interface AuthenticatedPageProps {
  children: React.ReactNode;
  resourceKey?: string;
}

export function AuthenticatedPage({ children, resourceKey = "default" }: AuthenticatedPageProps) {
  return (
    <Suspense>
      <Authenticated key={resourceKey} redirectOnFail="/login">
        {children}
      </Authenticated>
    </Suspense>
  );
}
