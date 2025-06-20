"use client";
import Providers from "@/components/providers";
import { FeedbackModal } from "@/components/Modals/FeedbackModal";
import { ErrorBoundary } from "./ErrorBoundary";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Providers>
        {children}
        <FeedbackModal />
      </Providers>
    </ErrorBoundary>
  );
}
