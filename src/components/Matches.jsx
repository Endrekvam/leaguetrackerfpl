import { useState, useEffect } from 'react';


// Main Matches Component
const Matches = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [teams, setTeams] = useState({});
  const [fixtures, setFixtures] = useState({
    finished: [],
    live: [],
    upcoming: [],
  });

  // Fetch and Process Data
  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch API data
        const [gameweekRes, fixturesRes] = await Promise.all([
          fetch("https://fplproxy.vercel.app/api/bootstrap-static"),
          fetch("https://fplproxy.vercel.app/api/fixtures/"),
        ]);

        if (!gameweekRes.ok || !fixturesRes.ok) {
          throw new Error("Failed to fetch one or more resources");
        }

        const gameweekData = await gameweekRes.json();
        const fixturesData = await fixturesRes.json();

        // Extract current gameweek
        const currentGameweek = gameweekData.events.find(event => event.is_current)?.id || 1;

        // Map team IDs to names
        const teamsMap = gameweekData.teams.reduce((map, team) => {
          map[team.id] = team.name;
          return map;
        }, {});

        // Organize fixtures by status
        const fixturesByStatus = {
          finished: fixturesData.filter(f => f.event === currentGameweek && f.finished),
          live: fixturesData.filter(f => f.event === currentGameweek && f.started && !f.finished),
          upcoming: fixturesData.filter(f => f.event === currentGameweek && !f.started),
        };

        // Update state
        setCurrentWeek(currentGameweek);
        setTeams(teamsMap);
        setFixtures(fixturesByStatus);
      } catch (err) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 mt-4">Gameweek {currentWeek}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-6">
        <FixtureSection title="Finished" fixtures={fixtures.finished} teams={teams}/>
        <FixtureSection title="Live" fixtures={fixtures.live} teams={teams}/>
        <FixtureSection title="Upcoming" fixtures={fixtures.upcoming} teams={teams}/>
      </div>
    </div>
  );
};

// FixtureSection Component
const FixtureSection = ({ title, fixtures, teams, bgColor }) => (
  <div>
    <h2 className={`text-xl font-semibold mb-2 text-center ${bgColor}`}>{title}</h2>
    {fixtures.length === 0 ? (
      <p className="text-center">No {title.toLowerCase()} fixtures</p>
    ) : (
      fixtures.map(fixture => <FixtureCard key={fixture.id} fixture={fixture} teams={teams} />)
    )}
  </div>
);

// FixtureCard Component
const FixtureCard = ({ fixture, teams }) => {
  const homeTeam = teams[fixture.team_h] || "Unknown Team";
  const awayTeam = teams[fixture.team_a] || "Unknown Team";

  return (
    <div className="p-4 rounded-lg shadow-md bg-gray-300 hover:bg-gray-100 cursor-pointer text-center my-4">
      <h3 className="text-lg font-bold">{homeTeam} vs {awayTeam}</h3>
      <p className="text-gray-600">
        {fixture.team_h_score !== null && fixture.team_a_score !== null
          ? `${fixture.team_h_score} - ${fixture.team_a_score}`
          : "Not Started"}
      </p>
    </div>
  );
};

export default Matches;
