import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import SpotDetail from './pages/SpotDetail';
import AddSpot from './pages/AddSpot';
import Profile from './pages/Profile';
import './index.css';

const queryClient = new QueryClient();

/**
 * LEARNING NOTE:
 * This is the root component where we set up all our "Providers".
 * Providers allow child components to access global state (Auth, Data Fetching, Routing).
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-white selection:bg-accent/30">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/spots/:id" element={<SpotDetail />} />
              <Route path="/add-spot" element={<AddSpot />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
