// app/api/codeforces/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // Fetch data from Codeforces API
    const response = await axios.get('https://codeforces.com/api/contest.list');

    if (response.data.status !== "OK") {
      throw new Error("Codeforces API returned non-OK status");
    }

    const contests = response.data.result.slice(0 , 25);
    
    // Format the contests in the desired structure with only the required fields
    const formattedContests = contests.map(contest => {
      const startTime = new Date(contest.startTimeSeconds * 1000);
      const endTime = new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000);
      
      return {
        code: contest.id.toString(),
        name: contest.name,
        platform: "Codeforces",
        type: contest.type,
        startime: startTime.toISOString(),
        endtime: endTime.toISOString(),
        duration: contest.durationSeconds / 60
      };
    });

    // Return the contests using NextResponse
    return NextResponse.json({ contests: formattedContests });
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch contest data from Codeforces'
      },
      { status: 500 }
    );
  }
}