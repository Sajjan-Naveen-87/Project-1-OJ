import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthProvider, { AuthContext } from './AuthProvider';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setLoginError('');
    setSuccess(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userdata = { username, password };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', userdata);
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('username', username);
      setIsLoggedIn(true);
      navigate('/home');
      setErrors({});
    } catch (error) {
      setLoginError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userdata = { username, email, password };

    try {
      await axios.post('http://127.0.0.1:8000/api/v1/register/', userdata);
      setSuccess(true);
      setErrors({});
    } catch (error) {
      console.log(error.response?.data);
      setErrors(error.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-md border-white border-2 rounded-lg p-6 sm:p-8 w-[90%] max-w-md text-white transition-all duration-500 ease-in-out">
      <h3 className="font-bold text-xl sm:text-2xl mb-4 text-center">
        {isLogin ? "Get Started !!" : "Create Account"}
      </h3>

      <form
        onSubmit={isLogin ? handleLogin : handleSignin}
        className="flex flex-col space-y-2 items-center justify-center w-full"
      >
        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          className="px-4 py-2 w-full bg-transparent border border-white rounded focus:outline-none focus:ring-2 focus:ring-white"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {errors.username && <p className="text-yellow-500">{errors.username}</p>}

        {/* Email for Sign Up */}
        {!isLogin && (
          <>
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 w-full bg-transparent border border-white rounded focus:outline-none focus:ring-2 focus:ring-white"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="text-yellow-500">{errors.email}</p>}
          </>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 w-full bg-transparent border border-white rounded focus:outline-none focus:ring-2 focus:ring-white"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="text-yellow-500">{errors.password}</p>}
        {loginError && isLogin && <p className="text-yellow-500">{loginError}</p>}

        {/* Submit or Loading */}
        {!loading ? (
          <input
            type="submit"
            value={isLogin ? "Login" : "Register"}
            className="bg-white text-black font-semibold py-2 px-4 rounded hover:bg-blue-400 transition w-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full py-2 bg-white text-black border border-gray-300 rounded">
            <svg
              className="w-5 h-5 mr-2 text-gray-500 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="5"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            <span>Loading...</span>
          </div>
        )}

        {/* Success Message */}
        {success && !isLogin && (
          <p className="text-green-400 font-semibold text-center">
            Registration successful! 🎉 You can now log in.
          </p>
        )}

        {/* Toggle Button */}
        <button
          type="button"
          onClick={handleToggle}
          className="text-white underline hover:text-blue-300 transition mt-2"
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;