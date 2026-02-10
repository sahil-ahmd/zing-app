import { useAuthCallback } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as Sentry from "@sentry/react-native";

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
          Sentry.logger.info(Sentry.logger.fmt`User synced with backend: ${data.name}`, {
            userId: user.id,
            username: data.name,
          });
        },
        onError: (error) => {
            console.log("User synced Failed: ", error);
            Sentry.logger.error("Failed to sync user with backend", {
              userId: user.id,
              error: error instanceof Error ? error.message : String(error),
            });
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
