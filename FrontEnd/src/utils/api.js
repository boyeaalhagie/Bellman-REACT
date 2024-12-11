export const calculateShortestPath = async (start, end, userRoute) => {
  const payload = { start, end, userRoute };
  console.log('Sending payload to API:', payload); // Log the payload

  try {
      const response = await fetch('/api/calculate-shortest-path', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
      });

      if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      console.log('Response from API:', data); // Log the API response
      return data;
  } catch (error) {
      console.error('Error calculating path:', error); // Log the error
      throw new Error('Failed to calculate shortest path');
  }
};
