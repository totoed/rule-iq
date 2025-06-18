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
    const error = urlParams.get("error");
    const errorDescription = urlParams.get("error_description");

    // Then check if we have a hash in the URL (typical for OAuth redirects)
    const hasHash = window.location.hash && window.location.hash.length > 0;
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const hashError = hashParams.get("error");

    // Handle OAuth errors
    if (error || hashError) {
      console.error("OAuth Error:", {
        error: error || hashError,
        description: errorDescription || hashParams.get("error_description"),
      });

      // Clean up URL and show auth screen
      window.history.replaceState({}, document.title, window.location.pathname);
      setStage("auth");
      return;
    }

    if (showProfile || hasHash || accessToken) {
      console.log("Detected OAuth redirect:", {
        showProfile,
        hasHash,
        accessToken: !!accessToken,
        hash: hasHash ? window.location.hash : null,
      });

      // Force refresh auth state with retry logic
      const checkSession = async (retries = 3) => {
        try {
          // Wait a bit for Supabase to process the OAuth callback
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const { data, error: sessionError } =
            await supabase.auth.getSession();

          if (sessionError) {
            console.error("Session error after OAuth:", sessionError);
            throw sessionError;
          }

          console.log("Session after OAuth redirect:", data);

          if (data.session?.user) {
            console.log("OAuth login successful:", {
              userId: data.session.user.id,
              email: data.session.user.email,
              provider: data.session.user.app_metadata?.provider,
            });

            // Clean up URL
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );

            // Show configuration screen after successful OAuth login
            setStage("configuration");
          } else if (retries > 0) {
            // Retry if no session found
            console.log(
              `No session found, retrying... (${retries} attempts left)`,
            );
            setTimeout(() => checkSession(retries - 1), 2000);
          } else {
            console.warn(
              "No session found after OAuth redirect, redirecting to auth",
            );
            setStage("auth");
          }
        } catch (error) {
          console.error("Error checking session after OAuth redirect:", error);
          if (retries > 0) {
            setTimeout(() => checkSession(retries - 1), 2000);
          } else {
            setStage("auth");
          }
        }
      };

      checkSession();
    }
  }, [setStage]);
};
