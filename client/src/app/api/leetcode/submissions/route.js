
export async function POST ( req ){
     console.log("Request received for recent submissions");
  try {
      const body = await req.json();
      console.log("Request body:", body); 
      const{username , count} = body;

      if(!username){
          return new Response(
              JSON.stringify({error:'Username is required'}),
              {status:400}
          );
      }
      if(!count){
          return new Response(
              JSON.stringify({error:'Count is required'}),
              {status:400}
          );
      }

       const data = await fetchRecentWithDescriptions(username, count); 
     
      // console.log("Fetched data:", data); 
        return new Response(JSON.stringify(data), {
            status:200,
            headers:{'Content-Type':'application/json'},
        });
    
  }catch (error) {
      console.error("Error fetching recent submissions:", error);
      return new Response(
          JSON.stringify({error:'Failed to fetch recent submissions'}),
          {status:500}
      );
  }
}


async function fetchRecentWithDescriptions(username, count = 5) {
    const submissions = await fetchRecentSubmissions(username, count);
  //  console.log("Fetched submissions:", submissions); // Log the fetched submissions for debugging
    const detailedResults = await Promise.all(
      submissions.map(async (submission) => {
        const details = await fetchProblemDescription(submission.titleSlug);
        return {
          number : details.questionFrontendId,
          titleSlug: submission.titleSlug,
          title: submission.title,
          status: submission.status,
          lang: submission.lang,
          difficulty: details.difficulty,
          // description: details.content, 
          tags: details.topicTags.map(t => t.name),
          submissionTime: submission.timestamp,
        };
      })
    );
  
    return detailedResults;
  }


 async function fetchProblemDescription(titleSlug) {
    // const query = {
    //   query: `
    //     query questionData($titleSlug: String!) {
    //       question(titleSlug: $titleSlug) {
    //         questionFrontendId
    //         title
    //         content
    //         difficulty
    //         likes
    //         dislikes
    //         topicTags {
    //           name
    //           slug
    //         }
    //       }
    //     }
    //   `,
    //   variables: {
    //     titleSlug,
    //   },
    // };
  
    const query = {
      query: `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionFrontendId
            difficulty
            topicTags {
              name
              slug
            }
          }
        }
      `,
      variables: {
        titleSlug,
      },
    };

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });
  
    const data = await response.json();
    // console.log("Problem description data:", data); // Log the API response for debugging
    return data.data.question;
  }
  


  async function fetchRecentSubmissions(username, count = 5) {
    const query = {
      query: `
        query recentAcSubmissions($username: String!, $limit: Int!) {
          recentAcSubmissionList(username: $username, limit: $limit) {
            title
            titleSlug
            timestamp
            statusDisplay
            lang
          }
        }
      `,
      variables: {
        username,
        limit: count,
      },
    };
  
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });
  
    const data = await response.json();
    // console.log("Recent Submissions:", JSON.stringify(data, null, 2));

    if (!data?.data?.recentAcSubmissionList) {
      throw new Error("Invalid response structure from LeetCode");
    }
  
    // Normalize field names
    return data.data.recentAcSubmissionList.map(sub => ({
      title: sub.title,
      titleSlug: sub.titleSlug,
      timestamp: sub.timestamp,
      status: sub.statusDisplay,
      lang: sub.lang,
    }));
  }
  

  