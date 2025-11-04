// packages/ui/src/lib/html-utils.ts
"use client";

import DOMPurify from 'isomorphic-dompurify';

export function stripHtml(html: string): string {
  if (!html) return "";
  // Usa a biblioteca
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}

export function sanitizeHtml(html: string): string {
  if (!html) return "";
  // Usa a biblioteca
  return DOMPurify.sanitize(html, {
    FORBID_ATTR: ['style', 'class'], // Proíbe style e class
    FORBID_TAGS: ['script', 'iframe', 'object'] // Proíbe tags perigosas
  });
}