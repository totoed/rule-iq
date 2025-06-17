import React from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  LogOut,
  User,
  CheckCircle,
  XCircle,
  BookOpen,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Progress } from "./ui/progress";

interface SubjectScore {
  subject: string;
  score: number;
}

interface UserProfileProps {
  testCount: number;
  averageScore: number;
  totalQuestions?: number;
  correctAnswers?: number;
  subjectsToKeep?: SubjectScore[];
  subjectsToImprove?: SubjectScore[];
  studyResources?: Record<string, any>;
  onClose: () => void;
}

const UserProfile = ({
  testCount = 0,
  averageScore = 0,
  totalQuestions = 0,
  correctAnswers = 0,
  subjectsToKeep = [],
  subjectsToImprove = [],
  studyResources = {},
  onClose = () => {},
}: UserProfileProps) => {
  const { user, signOut, isAnonymous } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  // Determine if user signed in with a provider
  const getAuthProvider = () => {
    if (!user || isAnonymous) return null;

    // Check email domain for Microsoft accounts
    if (
      user.email.endsWith("@outlook.com") ||
      user.email.endsWith("@hotmail.com") ||
      user.email.endsWith("@live.com") ||
      user.email.endsWith("@microsoft.com")
    ) {
      return "Microsoft";
    }

    // Check email domain for Google accounts
    if (
      user.email.endsWith("@gmail.com") ||
      user.email.endsWith("@googlemail.com")
    ) {
      return "Google";
    }

    return null;
  };

  const authProvider = getAuthProvider();

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-center mb-4">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          {isAnonymous ? "Guest User" : user?.name || user?.email}
        </CardTitle>
        <CardDescription className="text-center">
          {isAnonymous ? "Using the app anonymously" : user?.email}
          {authProvider && !isAnonymous && (
            <span className="block mt-1 text-xs font-medium text-muted-foreground">
              Signed in with {authProvider}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-3xl font-bold">{testCount}</p>
            <p className="text-sm text-muted-foreground">Tests Taken</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-3xl font-bold">{averageScore}%</p>
            <p className="text-sm text-muted-foreground">Average Score</p>
          </div>
        </div>

        {/* Questions Statistics */}
        {totalQuestions > 0 && (
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Questions Answered</span>
              </div>
              <span className="text-sm font-medium">
                {correctAnswers} / {totalQuestions}
              </span>
            </div>
            <Progress
              value={(correctAnswers / totalQuestions) * 100}
              className="h-2 mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Correct: {correctAnswers}</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="h-3 w-3 text-red-500" />
                <span>Incorrect: {totalQuestions - correctAnswers}</span>
              </div>
            </div>
          </div>
        )}

        {/* Subjects to Keep */}
        {subjectsToKeep.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <h3 className="text-sm font-medium">Subjects to Keep</h3>
            </div>
            <div className="space-y-2">
              {subjectsToKeep.map((subject, index) => (
                <div key={index} className="bg-green-50 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">
                      {subject.subject}
                    </span>
                    <span className="text-sm text-green-700">
                      {subject.score}%
                    </span>
                  </div>
                  <Progress value={subject.score} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subjects to Improve */}
        {subjectsToImprove.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-medium">Subjects to Improve</h3>
            </div>
            <div className="space-y-2">
              {subjectsToImprove.map((subject, index) => (
                <div key={index} className="bg-amber-50 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">
                      {subject.subject}
                    </span>
                    <span className="text-sm text-amber-700">
                      {subject.score}%
                    </span>
                  </div>
                  <Progress value={subject.score} className="h-1.5" />
                </div>
              ))}
            </div>

            {/* Study Resources */}
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="text-md font-semibold text-blue-800">
                  Recommended Study Resources
                </h3>
              </div>

              <div className="space-y-3">
                {subjectsToImprove.map((subject) => (
                  <div
                    key={`resources-${subject.subject}`}
                    className="bg-white rounded-md p-3 shadow-sm border border-blue-100"
                  >
                    <h4 className="font-medium text-blue-700 mb-2">
                      {subject.subject}
                    </h4>
                    <div className="space-y-2">
                      {studyResources[subject.subject] ? (
                        studyResources[subject.subject]
                          .slice(0, 2)
                          .map((resource: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div
                                className={`${idx % 2 === 0 ? "bg-blue-100" : "bg-purple-100"} p-1 rounded-full mt-0.5`}
                              >
                                {resource.type === "book" && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 ${idx % 2 === 0 ? "text-blue-600" : "text-purple-600"}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                  </svg>
                                )}
                                {resource.type === "video" && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 ${idx % 2 === 0 ? "text-blue-600" : "text-purple-600"}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
                                )}
                                {resource.type === "course" && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 ${idx % 2 === 0 ? "text-blue-600" : "text-purple-600"}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                                    />
                                  </svg>
                                )}
                                {resource.type === "article" && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 ${idx % 2 === 0 ? "text-blue-600" : "text-purple-600"}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${idx % 2 === 0 ? "text-blue-600" : "text-purple-600"} hover:underline font-medium text-sm`}
                                >
                                  {resource.title}
                                </a>
                                <p className="text-xs text-gray-600">
                                  {resource.description}
                                </p>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          Loading resources...
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-right">
                      <button className="text-xs text-blue-600 hover:underline">
                        View all resources →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isAnonymous && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm">
            <p className="font-medium text-yellow-800 mb-1">Using as Guest</p>
            <p className="text-yellow-700">
              Your test history will not be saved after you leave. Create an
              account to save your progress.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          {isAnonymous ? "Exit Guest Mode" : "Sign Out"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
