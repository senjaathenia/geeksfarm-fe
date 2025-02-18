/* eslint-disable @typescript-eslint/no-explicit-any */

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { api } from "./service/api"

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  session:{
    strategy: "jwt",
  },
  providers: [Credentials({
    credentials: {
      email: {},
      password: {},
      role: {},
    },
  authorize: async (credentials) => {
    try{
      console.log("credentials", credentials);
      const response = await api.post("/login", credentials);
      console.log("response", response);
      const data = response.data;

      if (data) {
        const user = {
          id: data.data.user.id.toString(),
          email: data.data.user.email,
          name: data.data.user.name,
          image: null,
          permissions: data.data.user.permissions,
          role: data.data.user.role,
          token: data.data.token,
        };
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error", error);
      console.error("Login failed:", error);
      return null;
    }
  },
  }),],
  pages: {
    signIn: "/login",  // Halaman login custom
    signOut: "/login", // Halaman logout custom
  },    
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.SECRET,
  },
  callbacks: {
    async jwt({user, token}) {
        if (user) {
            token.accessToken = user.token;
            token.id = user.id;
            token.email = user.email;
            token.name = user.name;
            token.role = user.role;
        }
        console.log("JWT Token:", token); // Debug token
        return token;
    },
    async session({session, token}) {
      session.user = {
        ...session.user,
        token: token.accessToken,
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
      };
        console.log("session", session);
        return session;
    },
    authorized: async ({ auth}) => {
      return !!auth;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  
  debug: process.env.NODE_ENV === "development",
})