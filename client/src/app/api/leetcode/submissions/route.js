


async function fetchRecentWithDescriptions(username, count = 5) {
    const submissions = await fetchRecentSubmissions(username, count); // make sure this function is defined elsewhere
  
    const detailedResults = await Promise.all(
      submissions.map(async (submission) => {
        const details = await fetchProblemDescription(submission.titleSlug);
        return {
          title: details.title,
          status: submission.status,
          lang: submission.lang,
          difficulty: details.difficulty,
          description: details.content, 
          tags: details.topicTags.map(t => t.name),
        };
      })
    );
  
    return detailedResults;
  }


 async function fetchProblemDescription(titleSlug) {
    const query = {
      query: `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            title
            content
            difficulty
            likes
            dislikes
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
    return data.data.question;
  }
  

  