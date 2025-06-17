import React from "react";
import AppHeader from "./AppHeader";
import AppBackground from "./AppBackground";
import AppFooter from "./AppFooter";
import TestStageManager from "./TestStageManager";
import { useAuth } from "@/lib/auth";
import { useAppStage } from "@/hooks/useAppStage";
import { useOAuthRedirect } from "@/hooks/useOAuthRedirect";

const Home: React.FC = () => {
  const { signOut } = useAuth();
  const {
    stage,
    setStage,
    testHistory,
    showProfileButton,
    showHistoryButton,
    isLoading,
    error,
    loadTestHistory,
    clearError,
  } = useAppStage();

  // Handle OAuth redirects
  useOAuthRedirect(setStage);

  const handleViewTestHistory = () => {
    setStage("history");
  };

  const handleViewProfile = () => {
    setStage("profile");
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy text-white relative">
      <AppBackground />

      <div className="w-full max-w-4xl mx-auto relative z-10 p-4 flex-1 flex flex-col">
        {stage !== "auth" && (
          <AppHeader
            showHistoryButton={showHistoryButton}
            showProfileButton={showProfileButton}
            onViewTestHistory={handleViewTestHistory}
            onViewProfile={handleViewProfile}
            onSignOut={handleSignOut}
          />
        )}

        <TestStageManager
          stage={stage}
          setStage={setStage}
          testHistory={testHistory}
          onTestHistoryUpdate={loadTestHistory}
          isLoading={isLoading}
        />

        <AppFooter />
      </div>
    </div>
  );
};

export default Home;
