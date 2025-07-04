import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); // Ensure useState is defined
  const navigate = useNavigate();

  // Fetch CSRF token on mount
  useEffect(() => {
    axios.get('/signup/', { withCredentials: true })
      .then(() => {
        const token = getCsrfToken();
        if (token) {
          setCsrfToken(token); // Use setCsrfToken here
        } else {
          setError('Failed to fetch CSRF token.');
        }
      })
      .catch(err => {
        console.error('CSRF fetch error:', err);
        setError('Failed to connect to server.');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password1 !== password2) {
      setError('Passwords do not match.');
      return;
    }
    if (!csrfToken) {
      setError('CSRF token not available.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password1', password1);
      formData.append('password2', password2);
      formData.append('csrfmiddlewaretoken', csrfToken);

      await axios.post('/signup/', formData, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
      });
      navigate('/transactions');
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      setError('Signup failed. Username may already exist or invalid input.');
    }
  };

  const getCsrfToken = () => {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) return value;
    }
    return '';
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>
      <p className="mt-4">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </p>
    </div>
  );
}

export default Signup;