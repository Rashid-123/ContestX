// app/api/leetcode/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // Fetch data from LeetCode GraphQL API
    const response = await axios.post(
      'https://leetcode.com/graphql',
      {
        operationName: 'upcomingContests',
        query: `query upcomingContests { 
          upcomingContests { 
            title 
            titleSlug 
            startTime 
            duration 
            __typename 
          }
        }`
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data.data.upcomingContests;
    
    // Format the contests in the desired structure
    const formattedContests = data.map(contest => {
      const startTime = new Date(contest.startTime * 1000); // Convert Unix timestamp to Date
      const endTime = new Date((contest.startTime + contest.duration) * 1000);
      
      return {
        code: contest.titleSlug,
        name: contest.title,
        platform: "LeetCode",
        type: contest.title.includes("Weekly") ? "Weekly" : "Biweekly",
        startime: startTime.toISOString(), // Convert to ISO format
        endtime: endTime.toISOString(),    // Convert to ISO format
        duration: contest.duration / 60     // Convert seconds to minutes
      };
    });

    // Return the contests using NextResponse
    return NextResponse.json({ contests: formattedContests });
  } catch (error) {
    console.error('Error fetching LeetCode contests:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch contest data from LeetCode'
      },
      { status: 500 }
    );
  }
}