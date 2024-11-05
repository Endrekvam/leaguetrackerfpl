import { useState, useEffect } from 'react';

const Matches = () => {
  const [currentWeek, setCurrentWeek] = useState(null);
  const [fixtures, setFixtures] = useState([]);
  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch gameweek, teams, and fixture information
    const fetchGameweekAndFixtures = async () => {
      try {
        setLoading(true);

        // Make both API calls concurrently
        const [gameweekResponse, fixturesResponse] = await Promise.all([
          fetch("/bootstrap-static"),
          fetch("/fixtures")
        ]);

        if (!gameweekResponse.ok || !fixturesResponse.ok) {
          throw new Error('Failed to fetch one or more resources');
        }

        const gameweekData = await gameweekResponse.json();
        const fixturesData = await fixturesResponse.json();

        // Find the current gameweek
        let currentWeek = 1;
        gameweekData.events.forEach(event => {
          if (event.is_current) {
            currentWeek = event.id;
          }
        });
       
        // Extract and store team names with their IDs for easy lookup
        const teamsMap = {};
        gameweekData.teams.forEach(team => {
          teamsMap[team.id] = team.name;
        });

        // Filter fixtures for the current gameweek
        const currentWeekFixtures = fixturesData.filter(fixture => fixture.event === currentWeek);

        setCurrentWeek(currentWeek);
        setFixtures(currentWeekFixtures);
        setTeams(teamsMap);

      } catch (error) {
        setError('Error fetching gameweek or fixtures data: ' + error.message);
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameweekAndFixtures();
  }, []);

  // Helper function to get team name by ID
  const getTeamName = (teamId) => teams[teamId] || 'Unknown Team';

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
    <h1 className="text-center font-bold mb-4">Gameweek HEHHUHH {currentWeek}</h1>
      <ul>
        {fixtures.map(fixture => (
          <li key={fixture.id} className="mb-3 text-center">
            <div className="font-semibold">
              {getTeamName(fixture.team_h)} - {getTeamName(fixture.team_a)}
            </div>
            <div className="text-gray-600">
              {fixture.team_h_score} - {fixture.team_a_score}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Matches;
