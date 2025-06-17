import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Slider } from "./ui/slider";
import BasketballIcon from "./BasketballIcon";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";

interface TestConfigurationProps {
  onStartTest?: (questionCount: number) => void;
}

const TestConfiguration = ({
  onStartTest = () => {},
}: TestConfigurationProps) => {
  const [questionCount, setQuestionCount] = useState<number>(25);

  const handleStartTest = () => {
    console.log("Start test clicked with", questionCount, "questions");
    onStartTest(questionCount);
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] w-full bg-navy p-6 relative">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 text-white">
        <CardHeader className="text-center">
          <Link
            to="/"
            className="flex justify-center mb-2 hover:opacity-90 transition-opacity"
          >
            <BasketballIcon size="md" />
          </Link>
          <CardTitle className="text-2xl text-white">
            RULE TEST GENERATOR
          </CardTitle>
          <CardDescription className="text-white/80">
            Configure your test settings below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Number of Questions:</span>
              <span className="font-bold text-lg bg-white/20 px-3 py-1 rounded-md">
                {questionCount}
              </span>
            </div>
            <Slider
              value={[questionCount]}
              min={10}
              max={50}
              step={5}
              onValueChange={(value) => {
                console.log("Slider value changed:", value);
                setQuestionCount(value[0]);
              }}
              className="py-4"
            />

            <div className="flex justify-between text-xs text-white/60">
              <span>10</span>
              <span>50</span>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-lg border border-white/10">
            <h3 className="font-medium mb-2">Test Information</h3>
            <ul className="text-sm space-y-1 list-disc list-inside text-white/80">
              <li>
                You will be presented with {questionCount} random yes/no
                questions
              </li>
              <li>Answer each question to the best of your ability</li>
              <li>Your final score will be shown at the end</li>
              <li>You can restart or create a new test when finished</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <button
            onClick={handleStartTest}
            className="h-10 rounded-md px-8 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer font-medium text-sm transition-transform hover:scale-105 hover:shadow-lg"
            style={{
              transition: "all 0.2s ease",
            }}
            type="button"
          >
            START TEST
          </button>
        </CardFooter>
      </Card>

      {/* Basketball court lines background with pointer-events-none to allow clicks */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[300px] border-b border-white/20 rounded-b-[50%]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[300px] border-t border-white/20 rounded-t-[50%]"></div>
        <div className="absolute left-0 top-1/4 bottom-1/4 w-[100px] border-r border-white/20"></div>
        <div className="absolute right-0 top-1/4 bottom-1/4 w-[100px] border-l border-white/20"></div>
      </div>
    </div>
  );
};

export default TestConfiguration;
