import { useAuthCallback } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";

const AuthSync = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { mutate: syncUser } = useAuthCallback();
  const hasSynced = useRef(false); // this is used to not run useeffect more than once

  useEffect(() => {
    if (isSignedIn && user && !hasSynced.current) {
      hasSynced.current = true;

      // Build the payload your backend expects
    const userPayload = {
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        image: user.imageUrl,
      };

      syncUser(userPayload, {
        onSuccess: (data) => {
          console.log("User synced with backend: ", data?.name);
        },
        onError: (error) => {
            console.log("User synced Failed: ", error);
          },
      });
    }

    if (!isSignedIn) {
      hasSynced.current = false;
    }
  }, [isSignedIn, user, syncUser]);

  return null;
};

export default AuthSync;
