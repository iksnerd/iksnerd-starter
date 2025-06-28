import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/api/webhooks(.*)",
]);
const isAdminRoute = createRouteMatcher(["/admin-panel(.*)", "/api/chat(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  const userAuth = await auth();

  // Admin Panel Checks

  const isAdmin = userAuth.orgRole?.includes("org:admin");
  const isAdminOrganization = userAuth.orgSlug?.includes("admin");
  //
  if (isAdminRoute(req)) {
    if (!isAdmin && isAdminOrganization) {
      await auth.protect();
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
