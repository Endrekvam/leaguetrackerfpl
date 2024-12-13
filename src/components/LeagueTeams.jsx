import { useState, useEffect } from "react";

const LeagueTeams = () => {
  const [leagueName, setLeagueName] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch league data when the component mounts
  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://fplproxy.vercel.app/api/leagues-classic/911605/standings/`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch league data.");
        }

        const data = await response.json();

        setLeagueName(data.league.name);

        const teamsData = data.standings.results.map((team) => ({
          teamName: team.entry_name,
          ownerName: team.player_name,
        }));

        setTeams(teamsData);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueData();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div className="flex flex-col justify-between min-h-full bg-gray-100 p-4 rounded-lg shadow-md">

      {loading && <p className="text-blue-500">Loading league data...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {teams.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">{leagueName}</h2>
          <ul className="space-y-4">
            {teams.map((team, index) => (
              <li
                key={index}
                className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
              >
                <p className="text-lg font-semibold">{team.teamName}</p>
                <p className="text-gray-600">{team.ownerName}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeagueTeams;
