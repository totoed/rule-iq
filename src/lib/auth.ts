import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";
import type { User } from "../types";

// Configure redirect URL based on environment
const getRedirectUrl = () => {
  // Check if we're in production and should use the custom domain
  if (import.meta.env.PROD) {
    // Use the custom domain for production
    return "https://www.refslife.com";
  }

  // For development or preview environments
  const origin = window.location.origin;

  // For Tempo development environment
  if (origin.includes("tempo-dev.app")) {
    return origin;
  }

  // For Vercel deployments, ensure we're using https
  let redirectUrl = origin;
  if (origin.includes("vercel.app")) {
    redirectUrl = origin.replace("http://", "https://");
  }

  console.log("OAuth Redirect URL:", redirectUrl);
  return redirectUrl;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ error: any; user: any }>;
  signOut: () => Promise<void>;
  isAnonymous: boolean;
  setIsAnonymous: (value: boolean) => void;
  signInWithProvider: (
    provider: "google" | "microsoft",
  ) => Promise<{ error: any }>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    console.log("Auth provider initialized");
    // Check for active session on load
    const checkSession = async () => {
      console.log("Checking for existing session");
      try {
        const { data } = await supabase.auth.getSession();

        console.log("Session data:", data);
        if (data.session?.user) {
          console.log("User found in session", data.session.user);
          const { id, email, created_at, user_metadata } = data.session.user;

          // Get user name from metadata, prioritizing different sources
          const userName =
            user_metadata?.name ||
            user_metadata?.full_name ||
            user_metadata?.user_name ||
            user_metadata?.preferred_username ||
            email?.split("@")[0] ||
            "";

          setUser({
            id,
            email: email || "",
            name: userName,
            createdAt: created_at,
          });
          setIsAnonymous(false);

          // Ensure user profile exists in database
          try {
            const { data: existingProfile } = await supabase
              .from("profiles")
              .select("id")
              .eq("id", id)
              .single();

            if (!existingProfile) {
              // Create profile if it doesn't exist
              await supabase.from("profiles").insert({
                id,
                name: userName,
                email: email || "",
              });
            }
          } catch (profileError) {
            console.error("Error checking/creating profile:", profileError);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    let authListener = { subscription: { unsubscribe: () => {} } };
    try {
      authListener = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { id, email, created_at, user_metadata } = session.user;

          // Get user name from metadata, prioritizing different sources
          const userName =
            user_metadata?.name ||
            user_metadata?.full_name ||
            user_metadata?.user_name ||
            user_metadata?.preferred_username ||
            email?.split("@")[0] ||
            "";

          setUser({
            id,
            email: email || "",
            name: userName,
            createdAt: created_at,
          });
          setIsAnonymous(false);

          // Ensure user profile exists in database
          if (event === "SIGNED_IN") {
            try {
              const { data: existingProfile } = await supabase
                .from("profiles")
                .select("id")
                .eq("id", id)
                .single();

              if (!existingProfile) {
                // Create profile if it doesn't exist
                await supabase.from("profiles").insert({
                  id,
                  name: userName,
                  email: email || "",
                });
              }
            } catch (profileError) {
              console.error("Error checking/creating profile:", profileError);
            }
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Error setting up auth listener:", error);
      setLoading(false);
    }

    return () => {
      try {
        authListener.subscription.unsubscribe();
      } catch (error) {
        console.error("Error unsubscribing from auth listener:", error);
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error("Error signing in:", error);
      return { error: { message: "Failed to sign in" } };
    }
  };

  const signInWithProvider = async (provider: "google" | "microsoft") => {
    try {
      // Get the appropriate redirect URL based on environment
      const redirectTo = getRedirectUrl();

      console.log(`Signing in with ${provider}, redirecting to: ${redirectTo}`);

      // Configure provider-specific options
      const providerOptions = {
        redirectTo,
        skipBrowserRedirect: false,
        ...(provider === "google" && {
          scopes: "openid profile email",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        }),
        ...(provider === "microsoft" && {
          scopes: "openid profile email User.Read",
        }),
      };

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === "microsoft" ? "azure" : provider,
        options: providerOptions,
      });

      if (error) {
        console.error(`OAuth error for ${provider}:`, error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      return {
        error: {
          message: `Failed to sign in with ${provider}. Please try again.`,
        },
      };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      // If successful, also store user profile in profiles table
      if (!error && data.user) {
        try {
          await supabase.from("profiles").insert({
            id: data.user.id,
            name,
            email,
          });
        } catch (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      return { error, user: data?.user };
    } catch (error) {
      console.error("Error signing up:", error);
      return { error: { message: "Failed to sign up" }, user: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAnonymous,
    setIsAnonymous,
    signInWithProvider,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};
