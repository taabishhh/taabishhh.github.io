"use client";

import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <div className="email">
      <a href={`mailto:${email}`} className="email__addr">
        {email}
      </a>
      <button type="button" onClick={copy} className="email__copy" aria-live="polite">
        {copied ? "copied ✓" : "copy"}
      </button>
    </div>
  );
}
