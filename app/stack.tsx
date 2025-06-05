import { StackServerApp } from "@stackframe/stack"

export const stackServerApp = new StackServerApp({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  tokenStore: {
    accessToken: "",
    refreshToken: "",
  },
})
