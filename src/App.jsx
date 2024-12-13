import './App.css'
import Matches from './components/Matches';
import LeagueTeams from './components/LeagueTeams';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-gray-800 p-4 text-gray-300 text-center">
        <h1 className="text-3xl font-bold">FPL League Tracker</h1>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row items-start lg:items-center justify-center gap-6 p-4">
        <div className="flex-1 flex flex-col justify-between">
          <Matches />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <LeagueTeams />
        </div>
      </main>

      <footer className="w-full bg-gray-800 p-4 text-gray-300 text-center">
        <p>&copy; 2024 Finn Diffen</p>
      </footer>
    </div>
  );
}

export default App;
