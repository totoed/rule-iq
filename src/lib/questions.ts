import { supabase } from "./supabase";
import type { Question, TestResult } from "../types";

// Add a new question to the database
export const addQuestion = async (question: {
  text: string;
  correctAnswer: boolean;
  subject?: string;
  category?: string;
}): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from("questions")
      .insert({
        text: question.text,
        correct_answer: question.correctAnswer,
        subject: question.subject || null,
        category: question.category || null,
      })
      .select("id")
      .single();

    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error("Error adding question:", error);
    return null;
  }
};

// Update an existing question
export const updateQuestion = async (
  id: number,
  updates: {
    text?: string;
    correctAnswer?: boolean;
    subject?: string;
    category?: string;
  },
): Promise<boolean> => {
  try {
    const updateData: any = {};
    if (updates.text !== undefined) updateData.text = updates.text;
    if (updates.correctAnswer !== undefined)
      updateData.correct_answer = updates.correctAnswer;
    if (updates.subject !== undefined) updateData.subject = updates.subject;
    if (updates.category !== undefined) updateData.category = updates.category;

    const { error } = await supabase
      .from("questions")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating question:", error);
    return false;
  }
};

// Delete a question
export const deleteQuestion = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase.from("questions").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting question:", error);
    return false;
  }
};

// Fetch a specific number of random questions from the database
export const fetchRandomQuestions = async (
  count: number = 25,
): Promise<Question[]> => {
  try {
    // Try to fetch from Supabase, but use local questions if it fails
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("id, text, correct_answer, subject, category")
        .order("random()")
        .limit(count);

      if (error) throw error;

      // Transform the data to match our Question interface
      return data.map((q: any) => ({
        id: q.id,
        text: q.text,
        correctAnswer: q.correct_answer,
        subject: q.subject,
        category: q.category,
        userAnswer: null,
      }));
    } catch (supabaseError) {
      console.error(
        "Supabase fetch failed, using local questions:",
        supabaseError,
      );
      throw supabaseError; // Re-throw to use fallback
    }
  } catch (error) {
    console.log("Using local questions");
    // Fallback to local questions if database fetch fails
    return getLocalQuestions(count);
  }
};

// Save test results to the database
export const saveTestResult = async (
  result: Omit<TestResult, "id">,
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from("test_results")
      .insert({
        user_id: result.userId,
        date: result.date,
        score: result.score,
        total_questions: result.totalQuestions,
        questions: result.questions,
      })
      .select("id")
      .single();

    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error("Error saving test result:", error);
    // Return a mock ID for development
    return `local-${Date.now()}`;
  }
};

// Fetch test history for a user
export const fetchTestHistory = async (
  userId: string,
): Promise<TestResult[]> => {
  try {
    const { data, error } = await supabase
      .from("test_results")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;

    return data.map((result: any) => ({
      id: result.id,
      userId: result.user_id,
      date: result.date,
      score: result.score,
      totalQuestions: result.total_questions,
      questions: result.questions,
    }));
  } catch (error) {
    console.error("Error fetching test history, using mock data:", error);
    // Return mock test history for development
    return [
      {
        id: "mock-1",
        userId: userId,
        date: new Date().toISOString(),
        score: 18,
        totalQuestions: 25,
        questions: getLocalQuestions(25).map((q) => ({
          ...q,
          userAnswer: Math.random() > 0.5,
        })),
      },
      {
        id: "mock-2",
        userId: userId,
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        score: 20,
        totalQuestions: 25,
        questions: getLocalQuestions(25).map((q) => ({
          ...q,
          userAnswer: Math.random() > 0.5,
        })),
      },
    ];
  }
};

// Local questions as fallback
const getLocalQuestions = (count: number): Question[] => {
  const questionBank = [
    { text: "Is the sky blue?", correctAnswer: true, subject: "Science" },
    { text: "Is the Earth flat?", correctAnswer: false, subject: "Science" },
    { text: "Is water wet?", correctAnswer: true, subject: "Science" },
    { text: "Do penguins fly?", correctAnswer: false, subject: "Biology" },
    {
      text: "Is the sun a planet?",
      correctAnswer: false,
      subject: "Astronomy",
    },
    {
      text: "Is Mount Everest the tallest mountain?",
      correctAnswer: true,
      subject: "Geography",
    },
    {
      text: "Is a tomato a vegetable?",
      correctAnswer: false,
      subject: "Biology",
    },
    {
      text: "Is gold a chemical element?",
      correctAnswer: true,
      subject: "Chemistry",
    },
    {
      text: "Do all mammals lay eggs?",
      correctAnswer: false,
      subject: "Biology",
    },
    {
      text: "Is the Great Wall of China visible from space?",
      correctAnswer: false,
      subject: "Geography",
    },
    {
      text: "Is the Pacific Ocean the largest ocean?",
      correctAnswer: true,
      subject: "Geography",
    },
    { text: "Is a whale a fish?", correctAnswer: false, subject: "Biology" },
    {
      text: "Is the Mona Lisa painted by Leonardo da Vinci?",
      correctAnswer: true,
      subject: "Art",
    },
    {
      text: "Is the capital of Australia Sydney?",
      correctAnswer: false,
      subject: "Geography",
    },
    {
      text: "Is the human body made up of more than 60% water?",
      correctAnswer: true,
      subject: "Biology",
    },
    {
      text: "Is Jupiter the closest planet to the sun?",
      correctAnswer: false,
      subject: "Astronomy",
    },
    { text: "Is a koala a bear?", correctAnswer: false, subject: "Biology" },
    {
      text: "Is the Eiffel Tower in London?",
      correctAnswer: false,
      subject: "Geography",
    },
    {
      text: "Is oxygen the most abundant element in Earth's atmosphere?",
      correctAnswer: false,
      subject: "Chemistry",
    },
    {
      text: "Is the speed of light faster than the speed of sound?",
      correctAnswer: true,
      subject: "Physics",
    },
    {
      text: "Is the Amazon the longest river in the world?",
      correctAnswer: false,
      subject: "Geography",
    },
    {
      text: "Is honey the only food that doesn't spoil?",
      correctAnswer: true,
      subject: "Biology",
    },
    {
      text: "Is the Statue of Liberty made of copper?",
      correctAnswer: true,
      subject: "History",
    },
    {
      text: "Is a group of lions called a pack?",
      correctAnswer: false,
      subject: "Biology",
    },
    {
      text: "Is the human eye capable of seeing all colors in the spectrum?",
      correctAnswer: false,
      subject: "Biology",
    },
    {
      text: "Is the Great Barrier Reef the largest coral reef system?",
      correctAnswer: true,
      subject: "Geography",
    },
    {
      text: "Is the Sahara the largest desert in the world?",
      correctAnswer: true,
      subject: "Geography",
    },
    {
      text: "Is a spider an insect?",
      correctAnswer: false,
      subject: "Biology",
    },
    {
      text: "Is the heart the largest organ in the human body?",
      correctAnswer: false,
      subject: "Biology",
    },
    {
      text: "Is the moon larger than Pluto?",
      correctAnswer: true,
      subject: "Astronomy",
    },
    { text: "Is a banana a berry?", correctAnswer: true, subject: "Biology" },
    {
      text: "Is the Nile River in Asia?",
      correctAnswer: false,
      subject: "Geography",
    },
    {
      text: "Is the atomic number of gold 79?",
      correctAnswer: true,
      subject: "Chemistry",
    },
    {
      text: "Is the Taj Mahal in New Delhi?",
      correctAnswer: false,
      subject: "Geography",
    },
    { text: "Is a dolphin a mammal?", correctAnswer: true, subject: "Biology" },
    {
      text: "Is the Mona Lisa in the Louvre Museum?",
      correctAnswer: true,
      subject: "Art",
    },
    {
      text: "Is the currency of Japan the Yuan?",
      correctAnswer: false,
      subject: "Economics",
    },
    {
      text: "Is the human skeleton made up of more than 300 bones?",
      correctAnswer: false,
      subject: "Biology",
    },
    {
      text: "Is the chemical symbol for silver Ag?",
      correctAnswer: true,
      subject: "Chemistry",
    },
    {
      text: "Is the Colosseum located in Rome?",
      correctAnswer: true,
      subject: "Geography",
    },
    {
      text: "Is the capital of Canada Toronto?",
      correctAnswer: false,
      subject: "Geography",
    },
    {
      text: "Is the piano a string instrument?",
      correctAnswer: true,
      subject: "Music",
    },
    {
      text: "Is the Tropic of Cancer in the Southern Hemisphere?",
      correctAnswer: false,
      subject: "Geography",
    },
    {
      text: "Is the chemical formula for water H2O?",
      correctAnswer: true,
      subject: "Chemistry",
    },
    {
      text: "Is the Leaning Tower of Pisa in Florence?",
      correctAnswer: false,
      subject: "Geography",
    },
    {
      text: "Is the largest bone in the human body the femur?",
      correctAnswer: true,
      subject: "Biology",
    },
    {
      text: "Is the official language of Brazil Portuguese?",
      correctAnswer: true,
      subject: "Geography",
    },
    {
      text: "Is the currency of the United Kingdom the Euro?",
      correctAnswer: false,
      subject: "Economics",
    },
    {
      text: "Is the smallest planet in our solar system Mercury?",
      correctAnswer: true,
      subject: "Astronomy",
    },
    {
      text: "Is the capital of South Korea Seoul?",
      correctAnswer: true,
      subject: "Geography",
    },
  ];

  // Shuffle and select questions
  const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((q, index) => ({
    id: index + 1,
    ...q,
    userAnswer: null,
  }));
};
