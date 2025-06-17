import { useState, useCallback } from "react";
import { Question, TestResult } from "@/types";
import { fetchRandomQuestions, saveTestResult } from "@/lib/questions";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/Toast";

type TestStage = "configuration" | "questions" | "results";

interface UseTestStateReturn {
  // State
  stage: TestStage;
  questionCount: number;
  currentQuestionIndex: number;
  questions: Question[];
  userAnswers: Record<number, boolean>;
  selectedTestId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setStage: (stage: TestStage) => void;
  startTest: (count: number) => Promise<void>;
  answerQuestion: (questionId: number, answer: boolean) => void;
  restartTest: () => Promise<void>;
  newTest: () => void;
  loadHistoryTest: (test: TestResult) => void;
  clearError: () => void;
}

export const useTestState = (): UseTestStateReturn => {
  const { user, isAnonymous } = useAuth();
  const { addToast } = useToast();

  // Core state
  const [stage, setStage] = useState<TestStage>("configuration");
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({});
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const startTest = useCallback(async (count: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const newQuestions = await fetchRandomQuestions(count);

      setQuestionCount(count);
      setQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setSelectedTestId(null);
      setStage("questions");
    } catch (err) {
      const errorMessage = "Failed to load questions. Please try again.";
      setError(errorMessage);
      addToast({
        type: "error",
        title: "Test Error",
        description: errorMessage,
      });
      console.error("Error starting test:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const answerQuestion = useCallback(
    (questionId: number, answer: boolean) => {
      const updatedAnswers = { ...userAnswers, [questionId]: answer };
      setUserAnswers(updatedAnswers);

      if (currentQuestionIndex < questionCount - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Test completed - prepare results
        const questionsWithAnswers = questions.map((q) => ({
          ...q,
          userAnswer:
            updatedAnswers[q.id] !== undefined ? updatedAnswers[q.id] : null,
        }));

        setQuestions(questionsWithAnswers);
        setStage("results");

        // Save test result if user is logged in
        if (user && !isAnonymous) {
          const correctAnswers = questionsWithAnswers.filter(
            (q) => q.userAnswer === q.correctAnswer,
          ).length;

          saveTestResult({
            userId: user.id,
            date: new Date().toISOString(),
            score: correctAnswers,
            totalQuestions: questionCount,
            questions: questionsWithAnswers,
          }).catch((err) => {
            console.error("Failed to save test result:", err);
            // Don't show error to user as test is still completed
          });
        }
      }
    },
    [
      userAnswers,
      currentQuestionIndex,
      questionCount,
      questions,
      user,
      isAnonymous,
    ],
  );

  const restartTest = useCallback(async () => {
    try {
      setIsLoading(true);
      setCurrentQuestionIndex(0);
      setUserAnswers({});

      // Generate new questions if this was from history
      if (selectedTestId) {
        const newQuestions = await fetchRandomQuestions(questionCount);
        setQuestions(newQuestions);
        setSelectedTestId(null);
      }

      setStage("questions");
    } catch (err) {
      const errorMessage = "Failed to restart test. Please try again.";
      setError(errorMessage);
      addToast({
        type: "error",
        title: "Restart Error",
        description: errorMessage,
      });
      console.error("Error restarting test:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTestId, questionCount]);

  const newTest = useCallback(() => {
    setSelectedTestId(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setError(null);
    setStage("configuration");
  }, []);

  const loadHistoryTest = useCallback((test: TestResult) => {
    setSelectedTestId(test.id);
    setQuestions(test.questions);
    setQuestionCount(test.totalQuestions);
    setStage("results");
  }, []);

  return {
    // State
    stage,
    questionCount,
    currentQuestionIndex,
    questions,
    userAnswers,
    selectedTestId,
    isLoading,
    error,

    // Actions
    setStage,
    startTest,
    answerQuestion,
    restartTest,
    newTest,
    loadHistoryTest,
    clearError,
  };
};
