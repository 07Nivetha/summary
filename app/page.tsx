"use client"; // Required for Framer Motion
import React, { useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";

export default function Home() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    // If user is signed in, redirect to dashboard
    if (user && user.id) {
      // console.log("user = ", user);
      
      
        router.replace("/dashboard");
      } 
        
    // If user is not signed in, redirect to Stack's built-in sign-in page
    else {
      router.replace("/handler/sign-in?after_auth_return_to=%2F");
    }
  }, [user, router]);

  // If user is signed in, don't render anything (redirect is in progress)
  if (user && user.id) return null;

  return (<></>);
}