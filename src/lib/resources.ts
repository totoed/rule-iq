import { supabase } from "./supabase";
import type { StudyResource } from "../types";

// Fetch study resources for specific subjects
export const fetchStudyResources = async (
  subjects: string[],
  userId?: string | null,
): Promise<Record<string, StudyResource[]>> => {
  try {
    // Try to fetch from Supabase using the edge function for personalized resources
    try {
      // If we have a userId, use the personalized edge function
      if (userId) {
        const { data, error } = await supabase.functions.invoke(
          "supabase-functions-get-personalized-resources",
          {
            body: { subjects, userId },
          },
        );

        if (error) throw error;
        return data;
      }

      // Otherwise use the regular table query
      const { data, error } = await supabase
        .from("study_resources")
        .select("*")
        .in("subject", subjects);

      if (error) throw error;

      // Group resources by subject
      const resourcesBySubject: Record<string, StudyResource[]> = {};

      subjects.forEach((subject) => {
        resourcesBySubject[subject] = data
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

      return resourcesBySubject;
    } catch (supabaseError) {
      console.error(
        "Supabase fetch failed, using mock resources:",
        supabaseError,
      );
      throw supabaseError;
    }
  } catch (error) {
    console.log("Using mock study resources");
    // Fallback to mock resources if database fetch fails
    return getMockStudyResources(subjects);
  }
};

// Mock study resources as fallback
const getMockStudyResources = (
  subjects: string[],
): Record<string, StudyResource[]> => {
  const allMockResources: Record<string, StudyResource[]> = {
    Dribbling: [
      {
        id: "dribbling-1",
        subject: "Dribbling",
        title: "Basketball Dribbling Rules Explained",
        description:
          "A comprehensive guide to all dribbling rules and violations",
        url: "https://www.basketball-reference.com/about/rules.html",
        type: "article",
      },
      {
        id: "dribbling-2",
        subject: "Dribbling",
        title: "Advanced Dribbling Techniques",
        description:
          "Video tutorials on legal dribbling moves and common violations",
        url: "https://www.youtube.com/watch?v=v4RxBdvlw3U",
        type: "video",
      },
    ],
    Defense: [
      {
        id: "defense-1",
        subject: "Defense",
        title: "Defensive Rules in Basketball",
        description: "Learn about legal defensive positions and techniques",
        url: "https://www.usab.com/youth/news/2012/08/five-basic-basketball-defensive-concepts.aspx",
        type: "article",
      },
      {
        id: "defense-2",
        subject: "Defense",
        title: "Understanding Blocking and Charging",
        description: "Detailed explanation of blocking vs. charging fouls",
        url: "https://www.breakthroughbasketball.com/defense/blockingfouls.html",
        type: "article",
      },
    ],
    Footwork: [
      {
        id: "footwork-1",
        subject: "Footwork",
        title: "Mastering Basketball Footwork",
        description:
          "Detailed explanation of pivot foot rules and traveling violations",
        url: "https://www.breakthroughbasketball.com/fundamentals/footwork.html",
        type: "video",
      },
      {
        id: "footwork-2",
        subject: "Footwork",
        title: "Pivot Foot Rules Explained",
        description:
          "Clear examples of legal and illegal footwork in basketball",
        url: "https://www.basketball-reference.com/about/rules.html",
        type: "article",
      },
    ],
    Boundaries: [
      {
        id: "boundaries-1",
        subject: "Boundaries",
        title: "Court Boundaries and Violations",
        description: "Understanding the boundary lines and related rules",
        url: "https://www.basketball-reference.com/about/rules.html",
        type: "article",
      },
      {
        id: "boundaries-2",
        subject: "Boundaries",
        title: "Out of Bounds Rules in Basketball",
        description: "Comprehensive guide to out of bounds situations",
        url: "https://official.nba.com/rule-no-8-out-of-bounds-and-throw-in/",
        type: "article",
      },
    ],
    Timeouts: [
      {
        id: "timeouts-1",
        subject: "Timeouts",
        title: "Timeout Rules in Basketball",
        description: "When and how timeouts can be called during a game",
        url: "https://official.nba.com/rule-no-5-scoring-and-timing/",
        type: "article",
      },
      {
        id: "timeouts-2",
        subject: "Timeouts",
        title: "Strategic Use of Timeouts",
        description: "Learn when and how to use timeouts effectively",
        url: "https://www.basketball-reference.com/about/rules.html",
        type: "video",
      },
    ],
    Fouls: [
      {
        id: "fouls-1",
        subject: "Fouls",
        title: "Basketball Fouls Explained",
        description: "Different types of fouls and their consequences",
        url: "https://www.basketball-reference.com/about/rules.html#fouls",
        type: "course",
      },
      {
        id: "fouls-2",
        subject: "Fouls",
        title: "Technical and Flagrant Fouls",
        description:
          "Understanding the difference between technical and flagrant fouls",
        url: "https://official.nba.com/rule-no-12-fouls-and-penalties/",
        type: "article",
      },
    ],
    Traveling: [
      {
        id: "traveling-1",
        subject: "Traveling",
        title: "Traveling Violations Explained",
        description: "Detailed breakdown of traveling rules with examples",
        url: "https://official.nba.com/rule-no-10-violations-and-penalties/",
        type: "video",
      },
      {
        id: "traveling-2",
        subject: "Traveling",
        title: "Common Traveling Misconceptions",
        description: "Clearing up confusion about traveling rules",
        url: "https://www.basketball-reference.com/about/rules.html",
        type: "article",
      },
    ],
    Goaltending: [
      {
        id: "goaltending-1",
        subject: "Goaltending",
        title: "Goaltending and Basket Interference",
        description: "Understanding when a block is legal vs. goaltending",
        url: "https://official.nba.com/rule-no-11-basket-interference-goaltending/",
        type: "article",
      },
      {
        id: "goaltending-2",
        subject: "Goaltending",
        title: "Basket Interference Rules",
        description: "Visual guide to legal and illegal basket interference",
        url: "https://www.youtube.com/watch?v=TvGayLBB2Sk",
        type: "video",
      },
    ],
  };

  // Filter to only requested subjects
  const result: Record<string, StudyResource[]> = {};
  subjects.forEach((subject) => {
    if (allMockResources[subject]) {
      result[subject] = allMockResources[subject];
    } else {
      // Provide generic resources for subjects not in our mock data
      result[subject] = [
        {
          id: `${subject.toLowerCase()}-1`,
          subject: subject,
          title: `Introduction to ${subject}`,
          description: `A comprehensive beginner's guide to ${subject}`,
          url: "https://www.basketball-reference.com/about/rules.html",
          type: "article",
        },
      ];
    }
  });

  return result;
};
