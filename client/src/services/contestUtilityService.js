export function getContestStatus(contest, currentTime) {
  const startTime = new Date(contest.startime);
  const endTime = new Date(contest.endtime);

  if (currentTime < startTime) {
    return 'upcoming';
  } else if (currentTime >= startTime && currentTime <= endTime) {
    return 'ongoing';
  } else {
    return 'past';
  }
}

export function getTimeRemaining(targetTime, currentTime) {
  const timeDiff = targetTime.getTime() - currentTime.getTime();
  
  if (timeDiff <= 0) {
    return '00:00:00';
  }

  // Convert to hours, minutes, seconds
  const totalSeconds = Math.floor(timeDiff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function enhanceContestsWithStatus(contests, currentTime) {
  return contests.map(contest => {
    const status = getContestStatus(contest, currentTime);
    const startTime = new Date(contest.startime);
    const endTime = new Date(contest.endtime);
    
    let timeRemaining = '';
    if (status === 'upcoming') {
      timeRemaining = getTimeRemaining(startTime, currentTime);
    } else if (status === 'ongoing') {
      timeRemaining = getTimeRemaining(endTime, currentTime);
    }

    return {
      ...contest,
      status,
      timeRemaining,
      formattedStartTime: startTime.toLocaleString(),
      formattedEndTime: endTime.toLocaleString()
    };
  });
}

export function sortContestsByStatus(contests) {
  // Define priority order for statuses
  const statusPriority = {
    'ongoing': 0,
    'upcoming': 1,
    'past': 2
  };

  // Sort contests by status priority and then by start time
  return [...contests].sort((a, b) => {
    // First, sort by status priority
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }
    
    // If same status, sort by start time (upcoming and ongoing: earlier first, past: latest first)
    const aTime = new Date(a.startime).getTime();
    const bTime = new Date(b.startime).getTime();
    
    if (a.status === 'past') {
      return bTime - aTime; // Latest first for past contests
    } else {
      return aTime - bTime; // Earlier first for upcoming and ongoing
    }
  });
}

export function filterContestsByPlatform(contests, platform) {
  if (!platform) return contests;
  return contests.filter(contest => contest.platform === platform);
}

export function filterContestsByStatus(contests, status) {
  if (!status) return contests;
  return contests.filter(contest => contest.status === status);
}