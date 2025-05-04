import axios from "axios";

const formatEvents = async (username) => {
  try {
    const res = await axios.get(`https://api.github.com/users/${username}/events/public`);
    const events = res.data;

    const formatted = events.map((event) => {
      const repoName = event.repo?.name;
      const repoUrl = `https://github.com/${repoName}`;
      const type = event.type;

      switch (type) {
        case "PushEvent":
          return {
            type,
            repo: repoName,
            detail: `${event.payload.commits?.length || 0} commit(s) pushed`,
            link: repoUrl,
            created_at: event.created_at,
          };

        case "PullRequestEvent":
          const pr = event.payload.pull_request;
          return pr ? {
            type,
            repo: repoName,
            detail: `PR ${event.payload.action}: ${pr.title}`,
            link: pr.html_url,
            created_at: event.created_at,
          } : null;

        case "IssuesEvent":
          const issue = event.payload.issue;
          return issue ? {
            type,
            repo: repoName,
            detail: `Issue ${event.payload.action}: ${issue.title}`,
            link: issue.html_url,
            created_at: event.created_at,
          } : null;

        case "IssueCommentEvent":
          const comment = event.payload.comment;
          return comment ? {
            type,
            repo: repoName,
            detail: `Commented on issue: ${event.payload.issue.title}`,
            link: comment.html_url,
            created_at: event.created_at,
          } : null;

        case "WatchEvent":
          return {
            type,
            repo: repoName,
            detail: `Starred the repository`,
            link: repoUrl,
            created_at: event.created_at,
          };

        case "ForkEvent":
          const forkee = event.payload.forkee;
          return forkee ? {
            type,
            repo: repoName,
            detail: `Forked to ${forkee.full_name}`,
            link: `https://github.com/${forkee.full_name}`,
            created_at: event.created_at,
          } : null;

        default:
          return null; // Unhandled event types are ignored
      }
    });

    return formatted.filter((event) => event !== null);
  } catch (error) {
    console.error("Error fetching GitHub events:", error);
    return [];
  }
};

export default formatEvents;
