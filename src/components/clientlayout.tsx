"use client";
import { usePrivySession } from "@/hooks/usePrivySession";
import Providers from "@/components/providers";
import { FeedbackModal } from "@/components/Modals/FeedbackModal";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { session } = usePrivySession();
  return (
    <Providers initialState={session as any}>
      {children}
      <FeedbackModal />
    </Providers>
  );
}
