import { useState } from 'react';
import SplashCursor from './components/SplashCursor/SplashCursor';
import Footer from './components/Created/Footer';
import Navbar from './components/Created/Navbar';
import HomePageToRegisterOrLogin from './components/Created/HomePage/HomePageToRegisterOrLogin';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './components/Created/AuthProvider';
import Problems from './components/Created/ProblemsPage/Problems';
import Compiler from './components/Created/Compiler/Compiler';
import Profile from './components/Created/Profile/Profile';
import { useParams } from 'react-router-dom';
import EditProfile from './components/Created/Profile/EditProfile';
import Leaderboard from './components/Created/LeaderBoard/LeaderBoard';
import Home from './components/Created/Home';
import FuzzyText from './components/FuzzyText/FuzzyText';
import ComingSoon from './components/FuzzyText/ComingSoon';
function App() {
  const [activeIdx, setActiveIdx] = useState(0);
  const ProfileWrapper = () => {
    const { username } = useParams();
    return <Profile username={username} />;
  };

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <SplashCursor />
          <div className="min-h-screen flex flex-col">
            <Navbar idx={activeIdx} />
            {/* Add padding to prevent overlap */}
            <main className="flex-grow pt-16 bg-gray-950 text-white">
              <Routes>
                <Route path="/" element={<HomePageToRegisterOrLogin />} />
                <Route path="/home" element={<Home />} />
                <Route path="/problems" element={<Problems />} />
                <Route path="/problems/:id" element={<Compiler />} />
                <Route path="/profile/:username" element={<ProfileWrapper />} />
                <Route path="/profile/:username/update" element={<EditProfile />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/createGroup" element={<ComingSoon />} />
                <Route path="/joinGroup" element={<ComingSoon />} />
                <Route path="*" element={<Navigate to="/home" replace />} /> {/*Handling Invalid pages */}
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;