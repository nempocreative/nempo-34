import { createFileRoute } from "@tanstack/react-router";
import { backupAccessDenied } from "@/lib/security-policy";

// Fail closed: the imported app has no verified administrator authentication.
// Do not enable exports until a server-side administrator check is implemented.
export const Route = createFileRoute("/api/backup")({
  server: { handlers: { GET: async () => backupAccessDenied() } },
});