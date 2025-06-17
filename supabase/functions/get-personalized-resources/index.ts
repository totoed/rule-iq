import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { subjects, userId } = await req.json();

    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      throw new Error("Invalid subjects array");
    }

    // Create a Supabase client with the project URL and anon key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get resources for the specified subjects
    const { data: resources, error: resourcesError } = await supabase
      .from("study_resources")
      .select("*")
      .in("subject", subjects);

    if (resourcesError) throw resourcesError;

    // If userId is provided, get user's test history to personalize recommendations
    let personalizedResources = resources;

    if (userId) {
      const { data: testResults, error: testResultsError } = await supabase
        .from("test_results")
        .select("questions")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(5);

      if (testResultsError) throw testResultsError;

      if (testResults && testResults.length > 0) {
        // Analyze test results to find most problematic subjects
        const subjectPerformance = {};

        testResults.forEach((result) => {
          const questions = result.questions;

          questions.forEach((question) => {
            if (!question.subject) return;

            if (!subjectPerformance[question.subject]) {
              subjectPerformance[question.subject] = { total: 0, correct: 0 };
            }

            subjectPerformance[question.subject].total += 1;
            if (question.userAnswer === question.correctAnswer) {
              subjectPerformance[question.subject].correct += 1;
            }
          });
        });

        // Calculate percentage for each subject
        const subjectScores = Object.entries(subjectPerformance).map(
          ([subject, data]) => {
            const { total, correct } = data as {
              total: number;
              correct: number;
            };
            const percentage = Math.round((correct / total) * 100);
            return { subject, percentage, total };
          },
        );

        // Sort resources to prioritize those for subjects with lower scores
        personalizedResources = resources.sort((a, b) => {
          const aScore =
            subjectScores.find((s) => s.subject === a.subject)?.percentage ||
            100;
          const bScore =
            subjectScores.find((s) => s.subject === b.subject)?.percentage ||
            100;
          return aScore - bScore; // Lower scores first
        });
      }
    }

    // Group resources by subject
    const resourcesBySubject = {};
    subjects.forEach((subject) => {
      resourcesBySubject[subject] = personalizedResources
        .filter((resource) => resource.subject === subject)
        .map((resource) => ({
          id: resource.id,
          subject: resource.subject,
          title: resource.title,
          description: resource.description,
          url: resource.url,
          type: resource.type,
        }));
    });

    return new Response(JSON.stringify(resourcesBySubject), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
