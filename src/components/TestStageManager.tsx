import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TestConfiguration from "./TestConfiguration";
import QuestionScreen from "./QuestionScreen";
import ResultsScreen from "./ResultsScreen";
import AuthScreen from "./auth/AuthScreen";
import TestHistory from "./TestHistory";
import UserProfile from "./UserProfile";
import LoadingSpinner from "./LoadingSpinner";
import { useTestState } from "@/hooks/useTestState";
import { useStatsCalculation } from "@/hooks/useStatsCalculation";
import { useAuth } from "@/lib/auth";
import { TestResult } from "@/types";
import { AppStage } from "@/hooks/useAppStage";

interface TestStageManagerProps {
  stage: AppStage;
  setStage: (stage: AppStage) => void;
  testHistory: TestResult[];
  onTestHistoryUpdate: () => Promise<void>;
  isLoading: boolean;
}

// Animation variants for stage transitions
const stageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    scale: 1.05,
    y: -20,
  },
};

const stageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3,
};

const TestStageManager: React.FC<TestStageManagerProps> = ({
  stage,
  setStage,
  testHistory,
  onTestHistoryUpdate,
  isLoading,
}) => {
  const { user, isAnonymous } = useAuth();
  const {
    questionCount,
    currentQuestionIndex,
    questions,
    userAnswers,
    startTest,
    answerQuestion,
    restartTest,
    newTest,
    loadHistoryTest,
    isLoading: testLoading,
    error: testError,
  } = useTestState();

  const stats = useStatsCalculation(testHistory, user?.id);

  const handleStartTest = async (count: number) => {
    await startTest(count);
    setStage("questions");
  };

  const handleAnswer = (questionId: number, answer: boolean) => {
    answerQuestion(questionId, answer);

    if (currentQuestionIndex < questionCount - 1) {
      // Continue to next question
    } else {
      // Test completed
      setStage("results");

      // Refresh test history if user is logged in
      if (user && !isAnonymous) {
        onTestHistoryUpdate();
      }
    }
  };

  const handleRestartTest = async () => {
    await restartTest();
    setStage("questions");
  };

  const handleNewTest = () => {
    newTest();
    setStage("configuration");
  };

  const handleViewTestResult = (testId: string) => {
    const test = testHistory.find((t) => t.id === testId);
    if (test) {
      loadHistoryTest(test);
      setStage("results");
    }
  };

  const handleAuthSuccess = () => {
    setStage("configuration");
  };

  // Show loading spinner for test operations
  if (testLoading || isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial="initial"
          animate="in"
          exit="out"
          variants={stageVariants}
          transition={stageTransition}
          className="w-full flex items-center justify-center"
        >
          {stage === "auth" && <AuthScreen onSuccess={handleAuthSuccess} />}

          {stage === "configuration" && (
            <TestConfiguration onStartTest={handleStartTest} />
          )}

          {stage === "questions" && (
            <QuestionScreen
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questionCount}
              onAnswer={handleAnswer}
              onComplete={() => setStage("results")}
            />
          )}

          {stage === "results" && (
            <ResultsScreen
              questions={questions.map((q) => ({
                ...q,
                userAnswer: userAnswers[q.id] || false,
              }))}
              onRestartTest={handleRestartTest}
              onNewTest={handleNewTest}
            />
          )}

          {stage === "history" && (
            <TestHistory
              testHistory={testHistory}
              onViewResult={handleViewTestResult}
              onNewTest={handleNewTest}
            />
          )}

          {stage === "profile" && (
            <UserProfile
              testCount={stats.testCount}
              averageScore={stats.averageScore}
              totalQuestions={stats.totalQuestions}
              correctAnswers={stats.correctAnswers}
              subjectsToKeep={stats.subjectsToKeep}
              subjectsToImprove={stats.subjectsToImprove}
              studyResources={stats.studyResources}
              onClose={() => setStage("configuration")}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TestStageManager;
