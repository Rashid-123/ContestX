
import {redis} from "@/lib/redis"; // Adjust based on your project setup
import { NextResponse } from 'next/server';

// Helper to get TTL until next midnight UTC
function getSecondsUntilNextUTCMidnight() {
  const now = new Date();
  const nextMidnightUTC = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1
  ));
  return Math.floor((nextMidnightUTC.getTime() - now.getTime()) / 1000);
}

export async function POST(req) {
  console.log("Request received for POD");

  const todayUTC = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const cacheKey = `leetcodePOD:${todayUTC}`;

  try {
    const cached = await redis.get(cacheKey); // This is the value fetched from Redis

    if (cached) {
      console.log("Serving POD from cache");
      let dataToReturn;

      // Check if 'cached' is already a JavaScript object
      // This is the most likely scenario causing your error.
      if (typeof cached === 'object' && cached !== null) {
        dataToReturn = cached; // Use the object directly
      } else if (typeof cached === 'string') {
        // If it's a string, attempt to parse it.
        // This handles cases where the Redis client *doesn't* auto-parse.
        try {
          dataToReturn = JSON.parse(cached);
        } catch (parseError) {
          console.error("Failed to parse cached string as JSON:", parseError);
          // If parsing fails, treat it as if cache is invalid and proceed to fetch fresh data.
          dataToReturn = null;
        }
      } else {
        // Handle unexpected types, treat as no valid cache
        console.warn("Unexpected type for cached data:", typeof cached);
        dataToReturn = null;
      }

      if (dataToReturn) {
        // If we have valid data (either direct object or successfully parsed string)
        return NextResponse.json(dataToReturn, { status: 200 });
      }
    }

    // If no valid cache was found (or parsing failed), proceed to fetch fresh data
    // GraphQL query for POD
    const query = {
      query: `
        query questionOfToday {
          activeDailyCodingChallengeQuestion {
            date
            userStatus
            link
            question {
              acRate
              difficulty
              freqBar
              questionFrontendId
              isFavor
              isPaidOnly
              status
              title
              titleSlug
              hasVideoSolution
              hasSolution
              topicTags {
                name
                id
                slug
              }
            }
          }
        }
      `,
    };

    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });

    const data = await res.json(); // 'data' is now a JavaScript object from LeetCode API

    // Stringify the JavaScript object to store it as a string in Redis
    const dataToCache = JSON.stringify(data);

    // Set in Redis with TTL until next UTC midnight
    const ttl = getSecondsUntilNextUTCMidnight();
    await redis.set(cacheKey, dataToCache, { ex: ttl });

    // Return the original JavaScript object using NextResponse.json()
    // It will stringify it and send with Content-Type: application/json
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error fetching POD:", error);
    // Ensure error responses are also valid JSON
    return NextResponse.json(
      { error: error.message || "Failed to fetch POD" },
      { status: 500 }
    );
  }
}