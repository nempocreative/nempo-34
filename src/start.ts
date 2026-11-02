import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
import { setResponseHeader } from "@tanstack/react-start/server";
import { SECURITY_HEADERS } from "@/lib/security-policy";

const securityMiddleware = createMiddleware().server(async ({ next }) => {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    setResponseHeader(name, value);
  }
  const result = await next();
  if (result instanceof Response) {
    const headers = new Headers(result.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
    return new Response(result.body, { status: result.status, statusText: result.statusText, headers });
  }
  return result;
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [securityMiddleware, errorMiddleware, csrfMiddleware],
}));
