export async function POST(req) {
  console.log("Request received for submission calendar");
  try {

    const body = await req.json();
    const { username } = body;
    
    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        { status: 400 }
      );
    }
    
    const query = `
      query getUserSubmissionCalendar($username: String!) {
        matchedUser(username: $username) {
          submissionCalendar
        }
      }
    `;
    
    const graphqlResponse = await fetch('https://leetcode.com/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });
    
    const data = await graphqlResponse.json();
    
    // console.log(data);
    if (!graphqlResponse.ok || data.errors) {
      return new Response(
        JSON.stringify({ error: data.errors || 'Invalid response from LeetCode' }),
        { status: 400 }
      );
    }
    
    // Parse the submissionCalendar JSON string into an object
    // This is the key fix - parse the string before returning
    if (data.data?.matchedUser?.submissionCalendar) {
      try {
        const calendarData = JSON.parse(data.data.matchedUser.submissionCalendar);
        
        // Return the parsed object directly
        return new Response(JSON.stringify(calendarData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error("Error parsing submission calendar:", parseError);
        return new Response(
          JSON.stringify({ error: 'Failed to parse submission calendar data' }),
          { status: 500 }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'No submission calendar data found' }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching calendar:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch calendar data' }),
      { status: 500 }
    );
  }
}