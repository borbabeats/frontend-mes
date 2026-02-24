"use client";

import { Authenticated } from "@refinedev/core";
import { ThemedLayout } from "@refinedev/mui";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <Authenticated key="dashboard-layout" redirectOnFail="/login">
        <ThemedLayout Title={() => null}>
          {children}
        </ThemedLayout>
      </Authenticated>
    </Suspense>
  );
}
