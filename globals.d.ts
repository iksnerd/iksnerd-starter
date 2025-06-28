declare global {
  interface UserPublicMetadata extends globalThis.UserPublicMetadata {
    googleGenerativeAIUsage: GoogleGenerativeAIUsage[];
  }
}
