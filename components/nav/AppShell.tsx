'use client';

import React from "react";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <AppHeader />
      {children}
      <BottomNav />
    </>
  );
}
