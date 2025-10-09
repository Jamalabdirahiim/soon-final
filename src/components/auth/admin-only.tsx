
"use client";

import React from 'react';

/**
 * A client component that acts as a gatekeeper for admin-only content.
 * SECURITY DISABLED: This component will render its children unconditionally.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to render.
 * @returns {React.ReactNode} The children content.
 */
export function AdminOnly({ children }: { children: React.ReactNode }) {
  // Security check is temporarily disabled for quick management.
  // The component will always render the content passed to it.
  return <>{children}</>;
}
