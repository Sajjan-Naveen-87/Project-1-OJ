import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import GooeyNav from '../GooeyNav/GooeyNav';
import { AuthContext } from './AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import defaultProfileImage from '../../assets/ProfileImage/general-profile-image.png';

const Navbar = (props) => {
  const items = [
    { label: "BubbleCode", href: "/home" },
    { label: "Practice", href: "/problems" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Create Group", href: "/createGroup" },
    { label: "Join Group", href: "/joinGroup" },
  ];

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [profileImage, setProfileImage] = useState(defaultProfileImage);

  useEffect(() => {
    if (isLoggedIn && username) {
      axios.get(`http://127.0.0.1:8000/api/v1/accounts/profile/${username}/`)
        .then(res => {
          if (res.data.image) {
            setProfileImage(`http://127.0.0.1:8000${res.data.image}`);
          }
        })
        .catch(err => console.error('Error fetching profile image:', err));
    }
  }, [isLoggedIn, username]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="w-full z-10 px-4 bg-dark sm:px-6 md:px-8 py-4 fixed ">
      <div className="flex items-center justify-between w-full">
        <GooeyNav
          items={items}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={10}
          initialActiveIndex={props.idx}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
        {isLoggedIn && (
          <div className="flex items-center gap-4">
            <Link to={`/profile/${username}`}>
              <img className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-100 dark:ring-gray-200" src={profileImage || defaultProfileImage} alt='Profile' />
            </Link>
            <button
              onClick={handleLogout}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
            >
              <span className="px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Logout
              </span>
            </button>
          </div>
        )}
        {!isLoggedIn && (
          <div className="flex items-center gap-4">
            <Link to={`/`}>
              <button
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
            >
              <span className="px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Login
              </span>
            </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;