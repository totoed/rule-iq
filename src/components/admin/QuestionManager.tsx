import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Plus, Trash2, Save, Search } from "lucide-react";
import { addQuestion, updateQuestion, deleteQuestion } from "@/lib/questions";
import { supabase } from "@/lib/supabase";
import type { Question } from "@/types";

const subjects = [
  "Dribbling",
  "Defense",
  "Footwork",
  "Boundaries",
  "Timeouts",
  "Fouls",
  "Traveling",
  "Goaltending",
  "General",
];

const QuestionManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // New question form state
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    correctAnswer: false,
    subject: "",
  });

  // Edit question state
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("questions")
        .select("id, text, correct_answer, subject", { count: "exact" });

      // Apply filters
      if (searchTerm) {
        query = query.ilike("text", `%${searchTerm}%`);
      }

      if (selectedSubject) {
        query = query.eq("subject", selectedSubject);
      }

      // Pagination
      const pageSize = 10;
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, count, error } = await query
        .order("id", { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Transform the data to match our Question interface
      const formattedQuestions = data.map((q: any) => ({
        id: q.id,
        text: q.text,
        correctAnswer: q.correct_answer,
        subject: q.subject,
      }));

      setQuestions(formattedQuestions);
      setTotalPages(Math.ceil((count || 0) / pageSize));
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [searchTerm, currentPage, selectedSubject]);

  const handleAddQuestion = async () => {
    if (!newQuestion.text.trim()) return;

    try {
      await addQuestion({
        text: newQuestion.text,
        correctAnswer: newQuestion.correctAnswer,
        subject: newQuestion.subject || undefined,
      });

      // Reset form and refresh questions
      setNewQuestion({
        text: "",
        correctAnswer: false,
        subject: "",
      });
      fetchQuestions();
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleUpdateQuestion = async (id: number) => {
    const question = questions.find((q) => q.id === id);
    if (!question) return;

    try {
      await updateQuestion(id, {
        text: question.text,
        correctAnswer: question.correctAnswer,
        subject: question.subject,
      });
      setEditingId(null);
      fetchQuestions();
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await deleteQuestion(id);
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const updateQuestionField = (id: number, field: string, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Question Database Manager</CardTitle>
          <CardDescription>
            Add, edit, or delete questions for the basketball rules test
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="browse">
            <TabsList className="mb-4">
              <TabsTrigger value="browse">Browse Questions</TabsTrigger>
              <TabsTrigger value="add">Add New Question</TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select
                    value={selectedSubject || "all"}
                    onValueChange={(value) =>
                      setSelectedSubject(value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {loading ? (
                  <div className="text-center py-8">Loading questions...</div>
                ) : questions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No questions found. Try adjusting your filters or add new
                    questions.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question) => (
                      <Card key={question.id} className="relative">
                        <CardContent className="pt-6">
                          {editingId === question.id ? (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor={`question-${question.id}`}>
                                  Question Text
                                </Label>
                                <Input
                                  id={`question-${question.id}`}
                                  value={question.text}
                                  onChange={(e) =>
                                    updateQuestionField(
                                      question.id,
                                      "text",
                                      e.target.value,
                                    )
                                  }
                                  className="mt-1"
                                />
                              </div>

                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`correct-${question.id}`}
                                  checked={question.correctAnswer}
                                  onCheckedChange={(checked) =>
                                    updateQuestionField(
                                      question.id,
                                      "correctAnswer",
                                      !!checked,
                                    )
                                  }
                                />
                                <Label htmlFor={`correct-${question.id}`}>
                                  Correct Answer is "Yes"
                                </Label>
                              </div>

                              <div>
                                <Label htmlFor={`subject-${question.id}`}>
                                  Subject
                                </Label>
                                <Select
                                  value={question.subject || ""}
                                  onValueChange={(value) =>
                                    updateQuestionField(
                                      question.id,
                                      "subject",
                                      value,
                                    )
                                  }
                                >
                                  <SelectTrigger
                                    id={`subject-${question.id}`}
                                    className="mt-1"
                                  >
                                    <SelectValue placeholder="Select subject" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {subjects.map((subject) => (
                                      <SelectItem key={subject} value={subject}>
                                        {subject}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex justify-end space-x-2 mt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleUpdateQuestion(question.id)
                                  }
                                  className="flex items-center gap-1"
                                >
                                  <Save className="h-4 w-4" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex justify-between">
                                <div className="flex-1">
                                  <p className="font-medium">{question.text}</p>
                                  <div className="flex items-center mt-2 text-sm">
                                    <span className="font-medium mr-2">
                                      Correct Answer:
                                    </span>
                                    <span>
                                      {question.correctAnswer ? "Yes" : "No"}
                                    </span>
                                  </div>
                                </div>
                                {question.subject && (
                                  <span className="text-xs bg-muted px-2 py-1 rounded-full ml-2 h-fit">
                                    {question.subject}
                                  </span>
                                )}
                              </div>

                              <div className="flex justify-end space-x-2 mt-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingId(question.id)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteQuestion(question.id)
                                  }
                                  className="flex items-center gap-1"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center space-x-2 mt-6">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <span className="flex items-center px-3">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="add">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-question">Question Text</Label>
                  <Input
                    id="new-question"
                    value={newQuestion.text}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, text: e.target.value })
                    }
                    placeholder="Enter a yes/no question"
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new-correct"
                    checked={newQuestion.correctAnswer}
                    onCheckedChange={(checked) =>
                      setNewQuestion({
                        ...newQuestion,
                        correctAnswer: !!checked,
                      })
                    }
                  />
                  <Label htmlFor="new-correct">Correct Answer is "Yes"</Label>
                </div>

                <div>
                  <Label htmlFor="new-subject">Subject</Label>
                  <Select
                    value={newQuestion.subject}
                    onValueChange={(value) =>
                      setNewQuestion({ ...newQuestion, subject: value })
                    }
                  >
                    <SelectTrigger id="new-subject" className="mt-1">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleAddQuestion}
                  className="mt-4 flex items-center gap-1"
                  disabled={!newQuestion.text.trim()}
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionManager;
