import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface Question {
  id: number;
  text: string;
  correctAnswer: boolean;
  userAnswer?: boolean | null;
}

interface ResultsScreenProps {
  questions: Question[];
  onRestartTest: () => void;
  onNewTest: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  questions = [],
  onRestartTest,
  onNewTest,
}) => {
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(
    (q) => q.userAnswer !== null,
  ).length;
  const correctAnswers = questions.filter(
    (q) => q.userAnswer === q.correctAnswer,
  ).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto bg-navy/90 rounded-lg p-6 shadow-lg">
      <Card className="bg-navy/80 border-white/20 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-center text-white">
            Test Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-5xl font-bold mb-2 text-white">{score}%</div>
            <p className="text-white/70 mb-4">
              {correctAnswers} correct out of {totalQuestions} questions
            </p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={onRestartTest}
              >
                Restart Test
              </Button>
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={onNewTest}
              >
                New Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">
          Question Review
        </h3>
        {questions.map((question, index) => {
          const isCorrect = question.userAnswer === question.correctAnswer;
          const isAnswered = question.userAnswer !== null;

          return (
            <Card
              key={question.id}
              className={`border ${isAnswered ? (isCorrect ? "border-green-500/50 bg-green-950/20" : "border-red-500/50 bg-red-950/20") : "border-yellow-500/50 bg-yellow-950/20"}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isAnswered ? (
                      isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-yellow-500/70" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white mb-2">
                      <span className="font-medium">Question {index + 1}:</span>{" "}
                      {question.text}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-white/70">Correct answer:</span>
                        <span className="font-medium text-white">
                          {question.correctAnswer ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/70">Your answer:</span>
                        <span className="font-medium text-white">
                          {question.userAnswer === null
                            ? "Unanswered"
                            : question.userAnswer
                              ? "Yes"
                              : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsScreen;
