import './App.css'
import Matches from './components/Matches';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-gray-800 p-4 text-gray-300 text-center">
        <h1 className="text-3xl font-bold">FPL League Tracker</h1>
      </header>
      
      <main className="flex-grow flex items-center justify-center">
        <Matches />
      </main>

      <footer className="w-full bg-gray-800 p-4 text-gray-300 text-center">
        <p>&copy; 2024 Finn Diffen</p>
      </footer>
    </div>
  )
}

export default App
