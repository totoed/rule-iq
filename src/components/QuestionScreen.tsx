import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface Question {
  id: number;
  text: string;
  correctAnswer: boolean;
}

interface QuestionScreenProps {
  questions?: Question[];
  currentQuestionIndex?: number;
  onAnswer?: (questionId: number, answer: boolean) => void;
  onComplete?: (answers: Record<number, boolean>) => void;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  questions = [
    { id: 1, text: "Is the sky blue?", correctAnswer: true },
    { id: 2, text: "Is the Earth flat?", correctAnswer: false },
    { id: 3, text: "Is water wet?", correctAnswer: true },
    { id: 4, text: "Do penguins fly?", correctAnswer: false },
    { id: 5, text: "Is the sun a planet?", correctAnswer: false },
  ],
  currentQuestionIndex = 0,
  onAnswer = () => {},
  onComplete = () => {},
}) => {
  const totalQuestions = questions.length;

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestionIndex >= totalQuestions) {
      onComplete({});
    }
  }, [currentQuestionIndex, totalQuestions, onComplete]);

  if (!currentQuestion || currentQuestionIndex >= totalQuestions) {
    return (
      <div className="text-center text-white p-8">
        <h2 className="text-2xl font-bold mb-4">All questions completed!</h2>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswer = (answer: boolean) => {
    console.log("Answer clicked:", answer, "for question:", currentQuestion.id);
    onAnswer(currentQuestion.id, answer);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-4 sm:p-6 bg-navy text-white rounded-lg shadow-md w-full max-w-[800px] mx-auto border border-blue-700">
      <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-blue-500">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-blue-500">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-blue-700" />
      </div>

      <div className="mb-10 text-center w-full px-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white">
          {currentQuestion.text}
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
        <Button
          onClick={() => handleAnswer(true)}
          className="w-full sm:w-32 h-14 sm:h-12 text-lg rounded-full sm:rounded-md bg-blue-600 hover:bg-blue-700 text-white"
          variant="default"
        >
          Yes
        </Button>
        <Button
          onClick={() => handleAnswer(false)}
          className="w-full sm:w-32 h-14 sm:h-12 text-lg rounded-full sm:rounded-md border-blue-500 text-blue-500 hover:bg-blue-700 hover:text-white"
          variant="outline"
        >
          No
        </Button>
      </div>
    </div>
  );
};

export default QuestionScreen;
