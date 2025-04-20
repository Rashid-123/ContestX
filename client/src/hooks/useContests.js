// hooks/useContests.js
import { useState, useEffect } from 'react';
import { fetchContests } from '../services/contestService';
import {
  enhanceContestsWithStatus,
  sortContestsByStatus,
  filterContestsByPlatform,
  filterContestsByStatus
} from '../services/contestUtilityService';

export function useContests() {
  const [rawContests, setRawContests] = useState([]);
  const [processedContests, setProcessedContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filters, setFilters] = useState({
    filterType: 'all',
    platform: null,
    status: null
  });

  // Fetch initial data

  useEffect(() => {
    const loadContests = async () => {
      console.log("inside hook for contest data")
      try {
        setLoading(true);
        // const cached = localStorage.getItem('contests');
        // if (cached) {
        //   console.log("fetching the Cached data")
        //   const { data, expiresAt } = JSON.parse(cached);
        //   if (Date.now() < expiresAt) {
        //     setRawContests(data);
        //     setProcessedContests(data);
        //     setLoading(false);
        //     return;
        //   }
        // }
        //IF NO CACHED DATA THEN FETCH FROM API
        const data = await fetchContests();
        setRawContests(data);
        setProcessedContests(data);

        //cache the data for 15 minutes
        localStorage.setItem('contests', JSON.stringify({
          data, expiresAt: Date.now() + 1000 * 60 * 15 // 15 minutes
        }));
        setError(null);
      } catch (err) {
        setError('Failed to load contests');
      } finally {
        setLoading(false);
      }
    };

    loadContests();
  }, [])

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Process contests with status and time whenever raw data or current time changes
  useEffect(() => {
    if (rawContests.length > 0) {
      let enhanced = enhanceContestsWithStatus(rawContests, currentTime);

      // Apply filters based on filter type
      if (filters.filterType === 'platform' && filters.platform) {
        enhanced = filterContestsByPlatform(enhanced, filters.platform);
        enhanced = sortContestsByStatus(enhanced);
      } else if (filters.filterType === 'status' && filters.status) {
        enhanced = filterContestsByStatus(enhanced, filters.status);
      } else {
        // Default sorting by status (ongoing, upcoming, past)
        enhanced = sortContestsByStatus(enhanced);
      }

      setProcessedContests(enhanced);
    }
  }, [rawContests, currentTime, filters]);

  // Filter functions
  const filterByPlatform = (platform) => {
    setFilters({
      filterType: 'platform',
      platform,
      status: null
    });
  };

  const filterByStatus = (status) => {
    setFilters({
      filterType: 'status',
      platform: null,
      status
    });
  };

  const clearFilters = () => {
    setFilters({
      filterType: 'all',
      platform: null,
      status: null
    });
  };

  // Group contests by status for display
  const groupedContests = {
    ongoing: processedContests.filter(contest => contest.status === 'ongoing'),
    upcoming: processedContests.filter(contest => contest.status === 'upcoming'),
    past: processedContests.filter(contest => contest.status === 'past')
  };

  // Get unique platforms for filter options
  const availablePlatforms = [...new Set(rawContests.map(contest => contest.platform))];

  return {
    rawContests,
    contests: processedContests,
    groupedContests,
    loading,
    error,
    filters,
    availablePlatforms,
    filterByPlatform,
    filterByStatus,
    clearFilters
  };
}