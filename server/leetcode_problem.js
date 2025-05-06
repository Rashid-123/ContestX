import fetch from "node-fetch";
import fs from "fs";
import pLimit from "p-limit";
import striptags from "striptags";

const CONCURRENCY_LIMIT = 5;
const OUTPUT_FILE = "leetcode_problems.json";

// Step 1: Get list of problem titleSlugs
const getAllTitleSlugs = async () => {
  const query = `
    query getProblemList($limit: Int, $skip: Int) {
      problemsetQuestionListV2(limit: $limit, skip: $skip) {
        questions {
          questionFrontendId
          titleSlug
        }
      }
    }
  `;

  const variables = { limit: 500, skip: 0 };

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  // console.log("For Title slug :", JSON.stringify(data, null, 2)); // Log the API response for debugging 
  if (data.errors) {
    console.error("Error fetching problems:", data.errors);
    return [];
  }

  return data.data.problemsetQuestionListV2.questions;
};

// Step 2: Get full problem details
const getProblemDetails = async (titleSlug) => {
  const query = `
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionFrontendId
        title
        titleSlug
        content
        difficulty
        topicTags {
          name
          slug
        }
      }
    }
  `;

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { titleSlug } }),
  });

  const data = await response.json();
  //  console.log("For Problem details :", JSON.stringify(data, null, 2)); // Log the API response for debugging
  if (!data.data || !data.data.question) {
    throw new Error(`Failed to fetch details for ${titleSlug}`);
  }
  
  const q = data.data.question;
   
  return {
    number: Number(q.questionFrontendId),
    title: q.title,
    titleSlug: q.titleSlug,
    difficulty: q.difficulty,
    tags: q.topicTags.map(tag => tag.name),
    description: striptags(q.content).replace(/\s+/g, ' ').trim(),

  };
};

// Step 3: Orchestrate everything and save to JSON file
(async () => {
  console.log("📥 Fetching title slugs...");
  const problems = await getAllTitleSlugs();
    console.log(`📥 Fetched ${problems.length} problems`);
    // console.log("Problems:", problems); // Log the problems for debugging
  const limit = pLimit(CONCURRENCY_LIMIT);

  const detailedProblems = await Promise.all(
    problems.map((problem, index) =>
      limit(async () => {
        try {
          const detail = await getProblemDetails(problem.titleSlug);
          // console.log(detail); // Log the problem details for debugging
          // console.log(`✅ Fetched: ${detail.title} (${index + 1}/${problems.length})`);
          return detail;
        } catch (err) {
          console.error(`❌ Error for ${problem.titleSlug}: ${err.message}`);
          return null;
        }
      })
    )
  );

  const cleanList = detailedProblems.filter(Boolean);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cleanList, null, 2), "utf-8");
  console.log(`🎉 Saved ${cleanList.length} problems to ${OUTPUT_FILE}`);
})();
