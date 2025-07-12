This is a [Next.js](https://nextjs.org) project bootstrapped with [
`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fiksnerd%2Fiksnerd-starter&env=NEXT_PUBLIC_USE_MOCK_DATA,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,NEXT_PUBLIC_CLERK_SIGN_IN_URL,NEXT_PUBLIC_CLERK_SIGN_UP_URL,NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,FIREBASE_SERVICE_ACCOUNT,CLERK_WEBHOOK_SIGNING_SECRET,RESEND_API_KEY&envDescription=API%20keys%20needed%20for%20the%20services&redirect-url=https%3A%2F%2Fwww.iksnerd.xyz%2F&production-deploy-hook=Isknerd%20Starter%20Deploy&demo-title=Iksnerd%20Starter%20Demo&demo-url=https%3A%2F%2Fiksnerd-starter.vercel.app%2F)
## Setup

### Firebase Setup
- Create a Firebase project
- Create an App in the Firebase project
- Enable Firestore
- Enable Authentication
- Enable Google Authentication
- Enable Firebase Storage

### Clerk Setup
- Create a Clerk project
- Paste tne env variables in the `.env.local` file
- Enable Firebase integration in the Clerk project
- Setup Webhook - https://clerk.com/docs/webhooks/sync-data

#### Client
- Create a Firebase project
- Create an App in the Firebase project
- Copy the  `firebaseConfig` object from your Firebase project settings after creating the app
- Paste the `firebaseConfig` object in `/infrastructure/firebase/client.ts`

#### Admin SDK
- Go to the Firebase project settings
- Go to the Service accounts tab
- Generate a new private key
- Download the JSON file
- Move the JSON file to the `infrastructure/firebase` directory

Copy the `firebaseConfig` object from your Firebase project settings and replace the placeholder in
`src/lib/firebase.ts`.

### CMS setup - HyGraph
- Create a HyGraph project
- Go to the HyGraph project settings
- Get the Endpoints
- Copy the endpoint for the GraphQL API - (High Performance Content API)
- Paste the endpoint in the  `graphql.config.yaml` file in the root directory
- Call the endpoint to get the schema
- A new file will be created in the root directory with the name `cms-schema.graphql`
- Initialize the HyGraph project Content Api default settings to get access to the Content API

### Vector Database Setup - Qdrant

[Qdrant](https://qdrant.tech) is a vector database that can be used to store and search vectors.

[Local](https://qdrant.tech/documentation/quickstart/) is a self-hosted version of Qdrant that can be run in a Docker container.

```bash
docker run -p 6333:6333 -p 6334:6334 \
    -v "$(pwd)/qdrant_storage:/qdrant/storage:z" \
    qdrant/qdrant
```

### Admin Panel
- Enable organization in Clerk

### Styling
- This project uses [Geist](https://vercel.com/font) for styling.
- You can customize the theme in the `app/layout.tsx` file by modifying the `geist` object.
- You can also use the `geist` object to customize the theme in the `app/globals.css` file.

#### Components
- The components are located in the `app/components` directory.
- The ai components are located in the `app/components/ui/kibo-ui` directory.

[shadcn/ui](https://ui.shadcn.com) is used for the UI components in this project.
- The components are located in the `app/components/ui` directory.

[kibo-ui](https://www.kibo-ui.com/components/ai-branches) is used for the AI components in this project.
- The components are located in the `app/components/ui/kibo-ui` directory.


Use the following command to add / update shadcn/ui components to the project:
```bash
npx shadcn@latest add -a -y -o
```

#### Icons
- use the icons.tsx file to add icons to the project.

### Metadata

#### Favicons
- Add favicons to the `public` directory. You can use [Favicon Generator](https://realfavicongenerator.net/) to generate
  favicons for different platforms.

### Authentication
- This project uses [Clerk](https://clerk.com) for authentication.
- The data is synced with Firebase Authentication via Clerk's Firebase integration.
- We use webhooks to sync data between Clerk and Firebase. (see the app/api/webhooks.ts file)

### Ai Providers
- This project uses [Ollama](https://ollama.com) for local AI development.
- You can use the Ollama CLI to run local models and generate embeddings.

### State management, Data Fetching, and Forms
- We use nuqs [Nuqs](https://nuqs.47ng.com) for url state management.
- we use [Zustand](https://pmnd.rs/zustand) for global state management.
- We use [React Query](https://tanstack.com/query/latest/docs/react/overview) for data fetching and caching.
- We use [React Hook Form](https://react-hook-form.com) for form management.
- We use [Zod](https://zod.dev) for schema validation.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically
optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions
are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for
more details.
