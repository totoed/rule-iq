import { useMemo, useEffect, useState } from "react";
import { TestResult } from "@/types";
import { fetchStudyResources } from "@/lib/resources";

interface SubjectScore {
  subject: string;
  score: number;
}

interface CategoryScore {
  category: string;
  score: number;
  total: number;
  correct: number;
}

interface StatsResult {
  testCount: number;
  averageScore: number;
  totalQuestions: number;
  correctAnswers: number;
  subjectsToKeep: SubjectScore[];
  subjectsToImprove: SubjectScore[];
  categoryPerformance: CategoryScore[];
  strongCategories: CategoryScore[];
  weakCategories: CategoryScore[];
  studyResources: Record<string, any>;
}

export const useStatsCalculation = (
  testHistory: TestResult[],
  userId?: string | null,
): StatsResult => {
  const [studyResources, setStudyResources] = useState<Record<string, any>>({});

  const stats = useMemo(() => {
    if (testHistory.length === 0) {
      return {
        testCount: 0,
        averageScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        subjectsToKeep: [],
        subjectsToImprove: [],
        categoryPerformance: [],
        strongCategories: [],
        weakCategories: [],
      };
    }

    const testCount = testHistory.length;
    const totalScore = testHistory.reduce((sum, test) => {
      return sum + (test.score / test.totalQuestions) * 100;
    }, 0);

    // Calculate total questions and correct answers
    let totalQuestions = 0;
    let correctAnswers = 0;

    // Track performance by subject and category
    const subjectPerformance: Record<
      string,
      { total: number; correct: number }
    > = {};

    const categoryPerformance: Record<
      string,
      { total: number; correct: number }
    > = {};

    testHistory.forEach((test) => {
      totalQuestions += test.totalQuestions;
      correctAnswers += test.score;

      // Process subject and category performance
      test.questions.forEach((question) => {
        // Subject performance
        if (question.subject) {
          if (!subjectPerformance[question.subject]) {
            subjectPerformance[question.subject] = {
              total: 0,
              correct: 0,
            };
          }

          subjectPerformance[question.subject].total += 1;
          if (question.userAnswer === question.correctAnswer) {
            subjectPerformance[question.subject].correct += 1;
          }
        }

        // Category performance
        if (question.category) {
          if (!categoryPerformance[question.category]) {
            categoryPerformance[question.category] = {
              total: 0,
              correct: 0,
            };
          }

          categoryPerformance[question.category].total += 1;
          if (question.userAnswer === question.correctAnswer) {
            categoryPerformance[question.category].correct += 1;
          }
        }
      });
    });

    // Calculate percentage for each subject
    const subjectScores = Object.entries(subjectPerformance).map(
      ([subject, data]) => {
        const { total, correct } = data;
        const percentage = Math.round((correct / total) * 100);
        return { subject, percentage, total };
      },
    );

    // Sort subjects by performance
    const sortedSubjects = [...subjectScores].sort(
      (a, b) => b.percentage - a.percentage,
    );

    // Get top 3 and bottom 3 subjects (with at least 3 questions)
    const subjectsToKeep = sortedSubjects
      .filter((s) => s.total >= 3 && s.percentage >= 70)
      .slice(0, 3)
      .map((s) => ({ subject: s.subject, score: s.percentage }));

    const subjectsToImprove = sortedSubjects
      .filter((s) => s.total >= 3)
      .reverse()
      .slice(0, 3)
      .filter((s) => s.percentage < 70)
      .map((s) => ({ subject: s.subject, score: s.percentage }));

    // Calculate category performance
    const categoryScores = Object.entries(categoryPerformance).map(
      ([category, data]) => {
        const { total, correct } = data;
        const percentage = Math.round((correct / total) * 100);
        return { category, score: percentage, total, correct };
      },
    );

    // Sort categories by performance
    const sortedCategories = [...categoryScores].sort(
      (a, b) => b.score - a.score,
    );

    // Get strong and weak categories (with at least 3 questions)
    const strongCategories = sortedCategories
      .filter((c) => c.total >= 3 && c.score >= 75)
      .slice(0, 5);

    const weakCategories = sortedCategories
      .filter((c) => c.total >= 3 && c.score < 65)
      .reverse()
      .slice(0, 5);

    return {
      testCount,
      averageScore: Math.round(totalScore / testCount),
      totalQuestions,
      correctAnswers,
      subjectsToKeep,
      subjectsToImprove,
      categoryPerformance: categoryScores,
      strongCategories,
      weakCategories,
    };
  }, [testHistory]);

  // Load study resources for subjects that need improvement
  useEffect(() => {
    const loadStudyResources = async () => {
      const subjectsToImproveNames = stats.subjectsToImprove.map(
        (s) => s.subject,
      );
      if (subjectsToImproveNames.length > 0) {
        const resources = await fetchStudyResources(
          subjectsToImproveNames,
          userId,
        );
        setStudyResources(resources);
      }
    };

    loadStudyResources();
  }, [stats.subjectsToImprove, userId]);

  return {
    ...stats,
    studyResources,
  };
};
