
// app/api/codechef/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

// Export a named GET function instead of default export
export async function GET() {
  try {
    // Fetch data from CodeChef API
    const response = await axios.get(
      'https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all'
    );

    const data = response.data;
    
    // Format past contests (limit to 20)
    const pastContests = data.past_contests.slice(0,20).map(contest => ({
        code: contest.contest_code,
        name: contest.contest_name,
        platform:"CodeChef",
        type:"Regular",
        startime: new Date(contest.contest_start_date_iso),
        endtime:new Date(contest.contest_end_date_iso),
        duration: parseInt(contest.contest_duration)
    }))

    const futureContests = data.future_contests
    .map(contest => ({
      code: contest.contest_code,
      name: contest.contest_name,
      platform:"CodeChef",
      type: 'Regular',
      startime: new Date(contest.contest_start_date_iso),
      endtime:new Date(contest.contest_end_date_iso),
      duration: parseInt(contest.contest_duration)
    }));

    const merged = [...futureContests , ...pastContests];


    // Return both past and future contests using NextResponse
    return NextResponse.json({contests : merged});
  } catch (error) {
    console.error('Error fetching CodeChef contests:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch contest data from CodeChef'
      },
      { status: 500 }
    );
  }
}