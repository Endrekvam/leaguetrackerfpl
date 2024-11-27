import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Matches = () => {
  const [currentWeek, setCurrentWeek] = useState(null);
  const [fixtures, setFixtures] = useState([]);
  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedFixture, setExpandedFixture] = useState(null);

  useEffect(() => {
    const fetchGameweekAndFixtures = async () => {
      try {
        setLoading(true);

        // Midlertidlig proxy for github pages
        
        const [gameweekResponse, fixturesResponse] = await Promise.all([
          fetch("https://fplproxy.vercel.app/api/bootstrap-static"),
          fetch("https://fplproxy.vercel.app/api/fixtures/")
        ]);
        
       
        if (!gameweekResponse.ok || !fixturesResponse.ok) {
          throw new Error('Failed to fetch one or more resources');
        }

        const gameweekData = await gameweekResponse.json();
        const fixturesData = await fixturesResponse.json();

        let currentWeek = 1;
        gameweekData.events.forEach(event => {
          if (event.is_current) {
            currentWeek = event.id;
          }
        });
       
        const teamsMap = {};
        gameweekData.teams.forEach(team => {
          teamsMap[team.id] = team.name;
        });

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

  const handleExpandFixture = (fixtureId) => {
    setExpandedFixture(expandedFixture === fixtureId ? null : fixtureId);
  };

  const getTeamName = (teamId) => teams[teamId] || 'Unknown Team';

  const fixtureSections = {
    fullTime: fixtures.filter(fixture => fixture.finished),
    live: fixtures.filter(fixture => fixture.started && !fixture.finished),
    upcoming: fixtures.filter(fixture => !fixture.started)
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300">
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-20 my-4">
        <h2 className="text-xl font-bold mb-6 text-center">Gameweek {currentWeek}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Full Time Fixtures */}
          <FixtureSection
            title="Finished"
            fixtures={fixtureSections.fullTime}
            bgColor="bg-gray-400"
            expandedFixture={expandedFixture}
            handleExpandFixture={handleExpandFixture}
            getTeamName={getTeamName}
          />

          {/* Live Fixtures */}
          <FixtureSection
            title="Live"
            fixtures={fixtureSections.live}
            bgColor="bg-green-400"
            expandedFixture={expandedFixture}
            handleExpandFixture={handleExpandFixture}
            getTeamName={getTeamName}
          />

          {/* Upcoming Fixtures */}
          <FixtureSection
            title="Upcoming"
            fixtures={fixtureSections.upcoming}
            bgColor="bg-blue-200"
            expandedFixture={expandedFixture}
            handleExpandFixture={handleExpandFixture}
            getTeamName={getTeamName}
          />

        </div>
      </main>
    </div>
  );
};

const FixtureSection = ({ title, fixtures, bgColor, expandedFixture, handleExpandFixture, getTeamName }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
    {fixtures.length === 0 ? (
      <p className="text-center">No {title.toLowerCase()} fixtures</p>
    ) : (
      <div className="space-y-2">
        {fixtures.map((fixture) => (
          <FixtureCard
            key={fixture.id}
            fixture={fixture}
            bgColor={bgColor}
            isExpanded={expandedFixture === fixture.id}
            onExpand={() => handleExpandFixture(fixture.id)}
            getTeamName={getTeamName}
          />
        ))}
      </div>
    )}
  </div>
);

const FixtureCard = ({ fixture, bgColor, isExpanded, onExpand, getTeamName }) => (
  <div
    className={`${bgColor} p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition text-center ${
      isExpanded ? 'bg-white' : ''
    }`}
    onClick={onExpand}
  >
    <h4 className="text-lg font-bold">
      {getTeamName(fixture.team_h)} - {getTeamName(fixture.team_a)}
    </h4>
    <p className="text-gray-600">
      {fixture.team_h_score} - {fixture.team_a_score}
    </p>
    <p>{fixture.finished ? 'Full Time' : fixture.kickoff_time}</p>
    {isExpanded && (
      <div className="mt-2 text-sm text-left">
        <p className="font-semibold">Details:</p>
        {/* Placeholder for additional details */}
      </div>
    )}
  </div>
);

FixtureSection.propTypes = {
  title: PropTypes.string.isRequired,
  fixtures: PropTypes.arrayOf(PropTypes.object).isRequired,
  bgColor: PropTypes.string.isRequired,
  expandedFixture: PropTypes.number,
  handleExpandFixture: PropTypes.func.isRequired,
  getTeamName: PropTypes.func.isRequired
};

FixtureCard.propTypes = {
  fixture: PropTypes.object.isRequired,
  bgColor: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func.isRequired,
  getTeamName: PropTypes.func.isRequired
};

export default Matches;
