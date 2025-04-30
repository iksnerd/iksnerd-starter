This is a [Next.js](https://nextjs.org) project bootstrapped with [
`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fhello-world)

## Setup



### Firebase Setup
- Create a Firebase project
- Create an App in the Firebase project
- Copy the `firebaseConfig` object from your Firebase project settings after creating the app
- Paste the `firebaseConfig` object in `/infrastructure/firebase/client.ts`
- Enable Firestore
- Enable Authentication
- Enable Google Authentication

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
- Enable Firestore
- Enable Authentication
- Enable Google Authentication
- Enable Email/Password Authentication
- Enable Anonymous Authentication
- Enable Storage

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
- Call the endpoint in order to get the schema
- A new file will be created in the root directory with the name `cms-schema.graphql`
- Initialize the HyGraph project Content Api default settings in order to get access to the Content API


### Admin Panel
- Enable organization in Clerk
- 
### Styling

#### Favicons

- Add favicons to the `public` directory. You can use [Favicon Generator](https://realfavicongenerator.net/) to generate
  favicons for different platforms.

#### Icons

- use the icons.tsx file to add icons to the project.

### Metadata

### Data Fetching

### Authentication

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
