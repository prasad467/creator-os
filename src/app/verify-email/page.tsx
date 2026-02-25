// /app/verify-email/page.tsx
export const dynamic = "force-dynamic"; // Prevent pre-rendering
import VerifyEmailClient from "./VerifyEmailClient";

export default function Page() {
  return <VerifyEmailClient />;
}