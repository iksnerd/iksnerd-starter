
You are an expert in our tech stack: TypeScript, Node.js, Next.js (App Router), React, Tailwind CSS, Shadcn UI, Radix UI, Clerk, Firebase, Hygraph (GraphQL), Qdrant, and React Query.

## Project Architecture

This project uses a **Hexagonal (Ports and Adapters) Architecture**. This separates the core application logic from outside concerns like databases, APIs, and frameworks.

-   `core/`: Contains the core business logic.
    -   `entities/`: Plain TypeScript objects representing the core data structures (e.g., `User`).
    -   `ports/`: Interfaces that define contracts for services and repositories. This is the boundary of the application core.
-   `services/`: Implements the business logic defined by the ports. They orchestrate data flow and interact with repositories.
-   `repositories/`: Implements the data access logic defined by the repository ports. They handle communication with databases and external APIs.
-   `infrastructure/`: Contains concrete implementations and clients for external services like Firebase, Hygraph (CMS), and Qdrant (Vector DB).
-   `app/`: The Next.js routing layer. It should be lean and primarily responsible for routing and rendering UI components.
-   `components/`: Shared React components.
-   `hooks/`: Shared React hooks.
-   `lib/`: Utility functions and shared logic.

## Data Fetching & State Management

-   **React Server Components (RSC):** Use RSCs for initial data fetching on page load. Fetch data directly within server components to leverage Next.js SSR and minimize client-side JavaScript.
-   **React Query:** Use for all client-side data fetching and caching. This is ideal for mutations (e.g., form submissions) and queries that depend on user interaction.
-   **Clerk:** Manages user authentication state. Use Clerk's hooks and components for accessing user data and managing sessions.
-   **`nuqs`:** Use for managing state in URL search parameters. It's lightweight and great for state that should be bookmarkable and shareable.

## Code Style & Conventions

-   **Architectural Purity:** Follow the hexagonal architecture strictly. Keep business logic out of `app/` and `components/`.
-   **Programming Style:** Write concise, functional, and declarative TypeScript. Avoid classes and prefer iteration and modularization over code duplication.
-   **File Structure:** Within a file, the preferred order is: exported component, subcomponents, helpers, static content, and finally, type definitions.
-   **Naming:**
    -   Use `kebab-case` for directories and files (e.g., `components/auth-wizard`).
    -   Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`).
    -   Favor named exports for components.
-   **TypeScript:**
    -   Use TypeScript everywhere.
    -   Prefer `interface` over `type` for defining object shapes.
    -   Avoid `enum`; use object literals or maps instead.
-   **Syntax:**
    -   Use the `function` keyword for pure functions.
    -   Avoid unnecessary curly braces in conditionals.
-   **UI & Styling:**
    -   Build UI with **Shadcn UI**, **Radix UI**, and **Tailwind CSS**.
    -   Design with a **mobile-first** approach using Tailwind's responsive modifiers.

## Performance Optimization

-   **Minimize Client Components:** Keep `'use client'` components small and push them down the component tree. Favor RSCs and Next.js SSR.
-   **Suspense:** Wrap client components in `<Suspense>` with a meaningful loading fallback (e.g., a skeleton loader).
-   **Dynamic Loading:** Use `next/dynamic` for components that are not critical for the initial render.
-   **Image Optimization:** Always use `next/image` to optimize images (WebP format, size data, lazy loading).
-   **Web Vitals:** Strive to optimize Core Web Vitals (LCP, CLS, FID).

---

*Follow the official Next.js documentation for best practices on Data Fetching, Rendering, and Routing.*
