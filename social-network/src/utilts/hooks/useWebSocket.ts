import { useEffect } from "react";
import { websocketService } from "@/utilts/websocket/websocket";

export const useWebSocket = (token: string) => {
  useEffect(() => {
    if (!token) return;
    websocketService.connect(token);

    return () => {
      websocketService.close();
    };
  }, [token]);
};

