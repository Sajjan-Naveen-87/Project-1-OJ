import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import FuzzyText from '../../FuzzyText/FuzzyText';

const EditProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [token, setToken] = useState(""); // If using JWT
    const LoginUsername = localStorage.getItem('username');
    if (LoginUsername != username) {
        return (
            <div className="flex items-center justify-center h-screen">
                <FuzzyText
                    baseIntensity={0.2}
                    hoverIntensity={0.5}
                    enableHover={true}
                >
                    404 Invalid Access
                </FuzzyText>
            </div>
        );
    }
    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken"); // ✅ Fixed token key
        if (storedToken) setToken(storedToken);
    }, []);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        profession: '',
        about: '',
        public_account: false,
        image: null,
    });

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/v1/accounts/profile/${LoginUsername}/`)
            .then(res => {
                setProfile(res.data);
                setFormData({
                    first_name: res.data.first_name || '',
                    last_name: res.data.last_name || '',
                    gender: res.data.gender || '',
                    profession: res.data.profession || '',
                    about: res.data.about || '',
                    public_account: res.data.public_account,
                    image: null,
                });
            })
            .catch(err => console.error(err));
    }, [username]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && !file.type.startsWith("image/")) {
            alert("Please upload a valid image file (jpg, jpeg, png, etc.)");
            return;
        }
        setFormData(prev => ({
            ...prev,
            image: file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Important to prevent page reload

        const data = new FormData();
        data.append("first_name", formData.first_name);
        data.append("last_name", formData.last_name);
        data.append("gender", formData.gender);
        data.append("profession", formData.profession);
        data.append("about", formData.about);
        data.append("public_account", formData.public_account);
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            await axios.put(
                `http://127.0.0.1:8000/api/v1/accounts/profile/${username}/update/`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                }
            );
            alert("Profile updated!");
            navigate(`/profile/${username}`);
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Update failed.");
        }
    };

    if (!profile) return <div className="text-center text-gray-300">Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-xl mt-10 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

            <label>First Name</label>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded" />

            <label>Last Name</label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded" />

            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>

            <label>Profession</label>
            <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded" />

            <label>About</label>
            <textarea name="about" value={formData.about} onChange={handleChange} rows="4" className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded" />

            <label>
                <input type="checkbox" name="public_account" checked={formData.public_account} onChange={handleChange} />
                <span className="ml-2">Make account public</span>
            </label>

            <div className="my-4">
                <label htmlFor="updateImage">Upload New Profile Picture</label>
                <input
                    type="file"
                    name="image"
                    id="updateImage"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleFileChange}
                    className="block mt-2"
                />
            </div>

            <button type="submit"
                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
            >
                <span className="px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                    Save Changes
                </span>
            </button>
        </form>
    );
};

export default EditProfile;