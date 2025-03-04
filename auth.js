import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { api } from "./service/api"

import jwt from 'jsonwebtoken'

// Function to validate JWT token

const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    return { valid: true, expired: false, decoded }
  } catch (error) {
    return { 
      valid: false, 
      expired: error.name === 'TokenExpiredError', 
      decoded: null 
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session:{
    strategy: "jwt",
    maxAge: 60
  },
  providers: [Credentials({
    credentials: {
      email: {},
      password: {},
    },
  authorize: async (credentials) => {
    try{
      const response = await api.post("/login", credentials);
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
      console.error("error", error);
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
        return token;
    },
    async session({session, token}) {
      const validated = validateToken(token.accessToken)
      console.log(validated)

      if(session.expires){
        session.expires = new Date(0).toISOString()
      }
      
      session.user = {
        ...session.user,
        token: token.accessToken,
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
      };

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