import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const[username,setUsername] = useState('')
    const[password,setPassword] = useState('')
    const[error,setError]=useState('')
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log('form submitted with',username,password)
        try {
            await axios.get('/accounts/login/',{withCredentials:true})

            const response = await axios.post('accounts/login/',{ username,password},{
                headers: { 'X-CSRFToken':getCsrfToken(),
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                withCredentials:true
            });
            navigate('/transactions');

        } catch(err){
            console.log(err)
            setError('Invalid Credentials.Please Try again.')
        }
    }
    const getCsrfToken = ()=>{
        const name = 'csrftoken';
        const cookies = document.cookie.split(';');
        for (let cookie of cookies){
            const [key,value] = cookie.trim().split('=');
            if (key === name) return value;
        }
        return '';
    }
    
  return (
     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
      <p className="mt-4">
        Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
      </p>
    </div>
  )
}

export default Login
