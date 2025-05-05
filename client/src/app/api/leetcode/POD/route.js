
export async function POST ( req ){

    console.log("Request received for POD");
    try {
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
            `
          };
          
          const res = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
          });
          
          const data = await res.json();
          
          console.log("LeetCode POD Response:", JSON.stringify(data, null, 2));
        

          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });

          
    } catch (error) {
        console.error("Error fetching POD:", error);
        return new Response(
            JSON.stringify({error:'Failed to fetch POD'}),
            {status:500}
        );
        
    }
}