import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Galaxy from '../../Galaxy/Galaxy';
const Leaderboard = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/v1/leaderboard/')
            .then(res => setData(res.data))
            .catch(err => console.error("Error loading leaderboard", err));
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <Galaxy
                mouseRepulsion={true}
                mouseInteraction={false}
                density={1.5}
                glowIntensity={0.5}
                saturation={0.8}
                hueShift={240}
            />
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10 max-w-3xl w-full mx-auto p-6 bg-gray-900 text-white rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-4 text-center">🏆 Leaderboard</h1>
                <table className="w-full text-left table-auto border border-gray-700">
                    <thead className="bg-gray-800 text-gray-300">
                        <tr>
                            <th className="p-2">Rank</th>
                            <th className="p-2">Username</th>
                            <th className="p-2">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((entry) => (
                            <tr key={entry.rank} className="border-t border-gray-700 hover:bg-gray-800">
                                <td className="p-2">{entry.rank}</td>
                                <td className="p-2">@{entry.username}</td>
                                <td className="p-2 text-green-400 font-semibold">{entry.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;