"use server"
import { signIn } from "../../../auth";
import { redirect } from "next/navigation";

export async function signInForm(formData) {
    // try {
      const email = formData.get("email");
      const password = formData.get("password");

      // Validate input
      if (!email || !password) {
        return { error: "Email and password are required" };
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })


      
        redirect("/dashboard");


      // if (!result) {
      //   return { error: "Authentication failed" };
      // }

      // if (result.error) {
      //   console.error("Authentication error:", result.error);
      //   return { error: "Invalid credentials" };
      // }

    // } catch (error) {
    //   console.error("Login error:", error);
    //   // Only log actual errors, not redirect "errors"
    //   if (error.message !== 'NEXT_REDIRECT') {
    //     console.error("Login error:", {
    //       message: error.message,
    //       type: error.type,
    //       code: error.code
    //     });
    //   }
      
    //   return { error: "Authentication failed. Please try again." };
    // }
}