export async function fetchContests() {
  try {
    const response = await fetch('/api/contests');

    if (!response.ok) {
      throw new Error('Failed to fetch contests');
    }

     const data = await response.json();


     console.log(data)


      return data.contests;
  } catch (error) {
    console.error('Error fetching contests:', error);
    return [];
  }
}
