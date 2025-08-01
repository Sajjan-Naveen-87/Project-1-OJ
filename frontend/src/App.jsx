import HomePageToRegisterOrLogin from './components/Created/HomePage/HomePageToRegisterOrLogin';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './components/Created/AuthProvider';
import Problems from './components/Created/ProblemsPage/Problems';
import Compiler from './components/Created/Compiler/Compiler';
import Profile from './components/Created/Profile/Profile';
import EditProfile from './components/Created/Profile/EditProfile';
import Leaderboard from './components/Created/LeaderBoard/LeaderBoard';
import Home from './components/Created/Home';
import ComingSoon from './components/FuzzyText/ComingSoon';
import Layout from './components/Created/Layout';

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Routes that should not have the main Navbar/Footer */}
            <Route path="/" element={<HomePageToRegisterOrLogin />} />

            {/* Routes that share the main layout */}
            <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/problems" element={<Problems />} />
                <Route path="/problems/:id" element={<Compiler />} />
                {/* Note: The Profile component can get the username directly with the useParams hook */}
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/profile/:username/update" element={<EditProfile />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/createGroup" element={<ComingSoon />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>

  );
}

export default App;