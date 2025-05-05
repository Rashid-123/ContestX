
import { NextResponse } from 'next/server';
import axios from 'axios';
import {redis} from "@/lib/redis";

const CACHE_KEY = "contest_data";
const CACHE_TIME = 60 * 15 ;
export async function GET(request) {
  console.log("Request received for contests");
  try {

    // const cachedContests = await redis.get(CACHE_KEY);
    // if (cachedContests) {
    //   console.log("Data served from cache");
    //   return NextResponse.json({ contests: cachedContests, cached: true });
    // }

    const [codechefResponse, codeforcesResponse, leetcodeResponse] = await Promise.all([
      fetchCodeChefContests(),
      fetchCodeforcesContests(),
      fetchLeetCodeContests()
    ]);


    const allContests = [
      ...codechefResponse,
      ...codeforcesResponse,
      ...leetcodeResponse
    ];

    
    allContests.sort((a, b) => new Date(b.startime) - new Date(a.startime));

    // await redis.set(CACHE_KEY , allContests , {ex:CACHE_TIME});

    return NextResponse.json({ contests: allContests });
  } catch (error) {
    console.error('Error fetching contests:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch contest data'
      },
      { status: 500 }
    );
  }
}

//--------------------  Function to fetch CodeChef contests --------------------------
async function fetchCodeChefContests() {
  try {
    const response = await axios.get(
      'https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all'
    );

    const data = response.data;

    // Format past contests (limit to 20)
    const pastContests = data.past_contests.slice(0, 20).map(contest => ({
      code: contest.contest_code,
      name: contest.contest_name,
      platform: "CodeChef",
      type: "Regular",
      startime: new Date(contest.contest_start_date_iso),
      endtime: new Date(contest.contest_end_date_iso),
      duration: parseInt(contest.contest_duration)
    }));

    const futureContests = data.future_contests.map(contest => ({
      code: contest.contest_code,
      name: contest.contest_name,
      platform: "CodeChef",
      type: 'Regular',
      startime: new Date(contest.contest_start_date_iso),
      endtime: new Date(contest.contest_end_date_iso),
      duration: parseInt(contest.contest_duration)
    }));

    return [...futureContests, ...pastContests];
  } catch (error) {
    console.error('Error fetching CodeChef contests:', error);
    return [];
  }
}

// Function to fetch Codeforces contests
async function fetchCodeforcesContests() {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');

    if (response.data.status !== "OK") {
      throw new Error("Codeforces API returned non-OK status");
    }

    const contests = response.data.result.slice(0, 30);
    
    // Format the contests in the desired structure with only the required fields
    return contests.map(contest => {
      const startTime = new Date(contest.startTimeSeconds * 1000);
      const endTime = new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000);
      
      return {
        code: contest.id.toString(),
        name: contest.name,
        platform: "Codeforces",
        type: contest.type,
        startime: startTime,
        endtime: endTime,
        duration: contest.durationSeconds / 60
      };
    });
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error);
    return [];
  }
}

// Function to fetch LeetCode contests
async function fetchLeetCodeContests() {
  try {
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
    return data.map(contest => {
      const startTime = new Date(contest.startTime * 1000);
      const endTime = new Date((contest.startTime + contest.duration) * 1000);
      
      return {
        code: contest.titleSlug,
        name: contest.title,
        platform: "LeetCode",
        type: contest.title.includes("Weekly") ? "Weekly" : "Biweekly",
        startime: startTime,
        endtime: endTime,
        duration: contest.duration / 60
      };
    });
  } catch (error) {
    console.error('Error fetching LeetCode contests:', error);
    return [];
  }
}