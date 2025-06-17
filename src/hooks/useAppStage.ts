import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { TestResult } from "@/types";
import { fetchTestHistory } from "@/lib/questions";
import { useToast } from "@/components/Toast";

export type AppStage =
  | "auth"
  | "configuration"
  | "questions"
  | "results"
  | "history"
  | "profile";

interface UseAppStageReturn {
  stage: AppStage;
  setStage: (stage: AppStage) => void;
  testHistory: TestResult[];
  showProfileButton: boolean;
  showHistoryButton: boolean;
  isLoading: boolean;
  error: string | null;
  loadTestHistory: () => Promise<void>;
  clearError: () => void;
}

export const useAppStage = (): UseAppStageReturn => {
  const { user, isAnonymous } = useAuth();
  const { addToast } = useToast();

  const [stage, setStage] = useState<AppStage>("auth");
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [showProfileButton, setShowProfileButton] = useState(false);
  const [showHistoryButton, setShowHistoryButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadTestHistory = useCallback(async () => {
    if (!user || isAnonymous) return;

    try {
      setIsLoading(true);
      setError(null);
      const history = await fetchTestHistory(user.id);
      setTestHistory(history);
    } catch (err) {
      const errorMessage = "Failed to load test history";
      setError(errorMessage);
      addToast({
        type: "error",
        title: "Error",
        description: errorMessage,
      });
      console.error("Error loading test history:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAnonymous, addToast]);

  // Handle auth status changes and button visibility
  useEffect(() => {
    if (user || isAnonymous) {
      // Default to configuration stage unless overridden
      if (stage === "auth") {
        setStage("configuration");
      }

      setShowProfileButton(true);

      if (user && !isAnonymous) {
        setShowHistoryButton(true);
        loadTestHistory();
        console.log("User authenticated:", user);
      } else {
        setShowHistoryButton(false);
        setTestHistory([]);
      }
    } else {
      // Only reset to auth if we're not already there
      if (stage !== "auth") {
        setStage("auth");
      }
      setShowProfileButton(false);
      setShowHistoryButton(false);
      setTestHistory([]);
    }
  }, [user, isAnonymous, stage, loadTestHistory]);

  return {
    stage,
    setStage,
    testHistory,
    showProfileButton,
    showHistoryButton,
    isLoading,
    error,
    loadTestHistory,
    clearError,
  };
};
