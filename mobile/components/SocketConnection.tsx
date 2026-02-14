import { useSocketStore } from "@/lib/socket";
import { useAuth } from "@clerk/clerk-expo";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const SocketConnection = () => {
    const { getToken, isSignedIn, isLoaded } = useAuth();
    const { connect, isConnected, socket } = useSocketStore();
    const queryClient = useQueryClient();
    
    useEffect(() => {
      // Only attempt connection if authenticated and not already connected
      if (isLoaded && isSignedIn && !isConnected) {
        // PASS THE FUNCTION 'getToken' ITSELF, do not call it here.
        connect(getToken, queryClient);
      }
    }, [isSignedIn, isLoaded, isConnected]);

  return null;
};

export default SocketConnection;