import React, { useEffect, useState } from 'react';
import axios from 'axios';
import defaultProfileImage from '../../../assets/ProfileImage/general-profile-image.png';
import { useNavigate } from 'react-router-dom';
import FuzzyText from '../../FuzzyText/FuzzyText';

const Profile = ({ username }) => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    const LoginUsername = localStorage.getItem('username');

    if (LoginUsername !== username) {
        return (
            <div className="flex items-center justify-center h-screen">
                <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true}>
                    404 Invalid Access
                </FuzzyText>
            </div>
        );
    }

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/v1/accounts/profile/${LoginUsername}/`)
            .then(res => setProfile(res.data))
            .catch(err => console.error('Error fetching profile:', err));
    }, [username]);

    if (!profile) return <div className="text-center mt-8 text-gray-300">Loading profile...</div>;

    const {
        user,
        first_name,
        last_name,
        gender,
        image,
        score,
        rank,
        problems_attempted,
        problems_solved,
        about,
        profession,
        public_account,
        groups_joined,
        date_of_joining
    } = profile;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-2xl shadow-xl mt-10 border border-gray-700">
            <div className="flex items-center justify-between space-x-6">
                <div className="flex items-center space-x-6">
                    <img
                        src={image ? `http://127.0.0.1:8000/${image}` : defaultProfileImage}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border"
                    />
                    <div>
                        <h2 className="text-3xl font-semibold text-white">{first_name} {last_name}</h2>
                        <p className="text-sm text-gray-400">@{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-lg text-gray-400 font-semibold">Rank</span>
                    <span className="text-3xl font-bold text-green-400 content-center">{rank}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
                <div>
                    <p><span className="font-medium text-gray-400">Gender:</span> {gender}</p>
                    <p><span className="font-medium text-gray-400">Profession:</span> {profession}</p>
                    <p><span className="font-medium text-gray-400">Public Account:</span> {public_account ? 'Yes' : 'No'}</p>
                    <p><span className="font-medium text-gray-400">Groups Joined:</span> {groups_joined || 'None'}</p>
                </div>
                <div>
                    <p><span className="font-medium text-gray-400">Score:</span> {score}</p>
                    <p><span className="font-medium text-gray-400">Problems Attempted:</span> {problems_attempted}</p>
                    <p><span className="font-medium text-gray-400">Problems Solved:</span> {problems_solved}</p>
                    <p><span className="font-medium text-gray-400">Accuracy Level:</span> {(problems_attempted > 0) ? `${((+problems_solved / +problems_attempted) * 100).toFixed(2)}%` : 'Attempt Questions First'}</p>
                </div>
            </div>

            <div className="mt-6">
                <p className="font-medium text-gray-400 mb-1">About:</p>
                <p className="text-sm text-gray-300">{about || 'No information provided.'}</p>
            </div>

            <div className="mt-4 text-xs text-gray-500">
                Member since: {new Date(date_of_joining).toLocaleDateString()}
            </div>

            <div className='flex gap-2'>
                <button
                onClick={() => navigate(`/profile/${username}/update`)}
                className="relative inline-flex items-center justify-center p-0.5 mt-4 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
            >
                <span className="px-5 py-2.5 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                    Edit Profile
                </span>
            </button>
            <button
                onClick={() => navigate(`/problems`)}
                className="relative inline-flex items-center justify-center p-0.5 mt-4 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
            >
                <span className="px-5 py-2.5 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                    Practice
                </span>
            </button>
            </div>
        </div>
    );
};

export default Profile;