'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const LeetCodeContext = createContext();

// Custom hook to use the context
export const useLeetCode = () => {
  const context = useContext(LeetCodeContext);
  if (!context) {
    throw new Error('useLeetCode must be used within a LeetCodeProvider');
  }
  return context;
};

// Provider component
export const LeetCodeProvider = ({ children }) => {
  const [calendarData, setCalendarData] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [username, setUsername] = useState(null);
  
  // Function to fetch calendar data
  const fetchCalendarData = async (username) => {
    if (!username) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/leetcode/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`);
      }

      const result = await res.json();
      
      // Process the calendar data
      const parsedData = [];
      let calendarData = result;

      // If the API didn't parse the JSON string, check if we need to
      if (result.submissionCalendar && typeof result.submissionCalendar === 'string') {
        try {
          calendarData = JSON.parse(result.submissionCalendar);
        } catch (parseError) {
          throw new Error('Failed to parse calendar data');
        }
      }

      // Process the data
      for (const [timestamp, count] of Object.entries(calendarData)) {
        try {
          // Parse timestamp as number
          const unixTimestamp = Number(timestamp);

          // Skip if not a valid number
          if (isNaN(unixTimestamp)) continue;

          // Create a date from the timestamp
          const date = new Date(unixTimestamp * 1000);

          // Format the date and add to parsed data
          parsedData.push({
            date: date.toISOString().split('T')[0], // YYYY-MM-DD format
            count: Number(count) || 0,
          });
        } catch (err) {
          console.warn(`Skipping invalid timestamp: ${timestamp}`, err);
        }
      }

      setCalendarData(parsedData);

    } catch (error) {
      console.error('Error fetching calendar data:', error);
      setError(`Failed to load LeetCode calendar data: ${error.message}`);
    }
  };

  // Function to fetch submissions
  const fetchSubmissions = async (username, count = 30) => {
    if (!username) return;

    try {
      const res = await fetch('/api/leetcode/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, count }),
      });

      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`);
      }

      const data = await res.json();
      setSubmissions(data);

    } catch (error) {
      console.error('Failed to fetch recent submissions:', error);
      setError(error.message || 'Failed to load LeetCode submissions');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch all LeetCode data
  const fetchLeetCodeData = async (newUsername, forceRefresh = false) => {
    // If not forcing a refresh and we already have data for this user and it was fetched recently
    // (within the last hour) then don't fetch again
    const currentTime = new Date().getTime();
    if (
      !forceRefresh &&
      username === newUsername && 
      lastFetchTime && 
      (currentTime - lastFetchTime < 3600000) && 
      calendarData.length > 0 &&
      submissions.length > 0
    ) {
      return;
    }

    setUsername(newUsername);
    setIsLoading(true);
    
    try {
      // Fetch both types of data in parallel
      await Promise.all([
        fetchCalendarData(newUsername),
        fetchSubmissions(newUsername)
      ]);
      
      // Update last fetch time
      setLastFetchTime(currentTime);
    } catch (error) {
      console.error('Error fetching LeetCode data:', error);
      setError(`Failed to load LeetCode data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to manually refresh the data
  const refreshData = async () => {
    if (username) {
      // Call fetchLeetCodeData with forceRefresh=true to bypass cache
      await fetchLeetCodeData(username, true);
    }
  };

  const value = {
    calendarData,
    submissions,
    isLoading,
    leetcodeError: error,
    fetchLeetCodeData,
    refreshData,
    lastFetchTime
  };

  return (
    <LeetCodeContext.Provider value={value}>
      {children}
    </LeetCodeContext.Provider>
  );
};



