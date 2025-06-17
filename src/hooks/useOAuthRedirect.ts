import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

type TestStage =
  | "auth"
  | "configuration"
  | "questions"
  | "results"
  | "history"
  | "profile";

export const useOAuthRedirect = (setStage: (stage: TestStage) => void) => {
  useEffect(() => {
    // Check URL parameters first (query string)
    const urlParams = new URLSearchParams(window.location.search);
    const showProfile = urlParams.get("showProfile") === "true";

    // Then check if we have a hash in the URL (typical for OAuth redirects)
    const hasHash = window.location.hash && window.location.hash.length > 0;

    if (showProfile || hasHash) {
      console.log(
        "Detected potential OAuth redirect:",
        hasHash ? `hash: ${window.location.hash}` : "showProfile parameter",
      );

      // Force refresh auth state
      const checkSession = async () => {
        try {
          const { data } = await supabase.auth.getSession();
          console.log("Session after OAuth redirect:", data);
          if (data.session?.user) {
            // Clean up URL
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );
            // Show profile after successful OAuth login
            setStage("profile");
          }
        } catch (error) {
          console.error("Error checking session after OAuth redirect:", error);
        }
      };
      checkSession();
    }
  }, [setStage]);
};
