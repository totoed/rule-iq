import { supabase } from "./supabase";

interface QuestionImport {
  text: string;
  correctAnswer: boolean;
  subject?: string;
}

/**
 * Import questions in bulk from a CSV file
 * CSV format should be: text,correctAnswer,subject
 * Example: "Is the sky blue?",true,Science
 */
export const importQuestionsFromCSV = async (
  csvFile: File,
): Promise<{ success: number; failed: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split("\n").filter((line) => line.trim());

        // Skip header row if it exists
        const startIndex = lines[0].includes("text,correctAnswer") ? 1 : 0;

        const questions: QuestionImport[] = [];

        for (let i = startIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Handle CSV parsing with potential quoted values
          const parts: string[] = [];
          let inQuotes = false;
          let currentPart = "";

          for (let j = 0; j < line.length; j++) {
            const char = line[j];

            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
              parts.push(currentPart);
              currentPart = "";
            } else {
              currentPart += char;
            }
          }

          parts.push(currentPart); // Add the last part

          // Clean up quotes from parts
          const cleanParts = parts.map((part) =>
            part.replace(/^"|"$/g, "").trim(),
          );

          if (cleanParts.length >= 2) {
            questions.push({
              text: cleanParts[0],
              correctAnswer: cleanParts[1].toLowerCase() === "true",
              subject: cleanParts[2] || undefined,
            });
          }
        }

        // Insert questions in batches
        let successCount = 0;
        let failedCount = 0;
        const batchSize = 50;

        for (let i = 0; i < questions.length; i += batchSize) {
          const batch = questions.slice(i, i + batchSize);
          const { error } = await supabase.from("questions").insert(
            batch.map((q) => ({
              text: q.text,
              correct_answer: q.correctAnswer,
              subject: q.subject || null,
            })),
          );

          if (error) {
            console.error("Error inserting batch:", error);
            failedCount += batch.length;
          } else {
            successCount += batch.length;
          }
        }

        resolve({ success: successCount, failed: failedCount });
      } catch (error) {
        console.error("Error processing CSV:", error);
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsText(csvFile);
  });
};
