import React from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { TestResult } from "@/types";
import { ChevronRight, Clock } from "lucide-react";

interface TestHistoryProps {
  testHistory: TestResult[];
  onViewResult: (testId: string) => void;
  onNewTest: () => void;
}

const TestHistory = ({
  testHistory = [],
  onViewResult = () => {},
  onNewTest = () => {},
}: TestHistoryProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-background p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">Your Test History</h2>
        <Button onClick={onNewTest}>Take New Test</Button>
      </div>

      {testHistory.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              You haven't taken any tests yet.
            </p>
            <Button onClick={onNewTest}>Take Your First Test</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {testHistory.map((test) => (
            <Card key={test.id} className="hover:bg-muted/50 transition-colors">
              <CardHeader className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">
                      Score: {test.score} / {test.totalQuestions}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {format(new Date(test.date), "PPP 'at' p")}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={() => onViewResult(test.id)}
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestHistory;
