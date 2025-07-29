import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import FuzzyText from '../FuzzyText/FuzzyText';
import Galaxy from '../Galaxy/Galaxy';
import GradientText from '../GradientText/GradientText'
const Home = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={0.5}
          enableHover={true}
        >
          Login First
        </FuzzyText>
      </div>
    );
  }

  return (

    <div className="relative w-full h-screen">
      <Galaxy
        mouseRepulsion={true}
        mouseInteraction={true}
        density={1.5}
        glowIntensity={0.5}
        saturation={0.8}
        hueShift={240}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 space-y-10 px-4 ">
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={3}
          showBorder={false}
          className="text-7xl font-bold text-white mb-4 "
        >
          Welcome to BubbleCode
        </GradientText>
        <div className="text-center max-w-3xl">
          <p className="text-lg text-gray-200">
            BubbleCode is your go-to online judge platform for practicing coding problems, tracking your progress,
            and challenging your peers. Hone your skills across difficulty levels and climb the leaderboard!
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 ">
          <button className="relative inline-flex items-center justify-center p-0.5 mt-4 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
            <Link to="/problems" className="px-6 py-3 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Start Practicing
            </Link>
          </button>
          <button className="relative inline-flex items-center justify-center p-0.5 mt-4 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
            <Link to="/leaderboard" className="px-6 py-3 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              View Leaderboard
            </Link>
          </button>
          <button className="relative inline-flex items-center justify-center p-0.5 mt-4 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
            <Link to="/createGroup" className="px-6 py-3 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Create Group
            </Link>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;