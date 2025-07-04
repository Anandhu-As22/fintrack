import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const [isAuthenticated,setIsAuthenticated ] = useState(false)
    const navigate = useNavigate()


    useEffect(()=>{
        axios.get('/accounts/check-auth/')
            .then(response => setIsAuthenticated(response.data.isAuthenticated))
            .catch(()=> setIsAuthenticated(false));

    },[]);

    
    const handleLogout  = async (e) =>{
        e.preventDerfault();
        try{
            await axios.post('/accounts/logout/',{},{
                headers: { 'X-CSRFToken': getCsrfToken()}
            });
            setIsAuthenticated(false);
            navigate('/login');
        } catch (error){
            console.error('Logout failed:',error)
        }
    };

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
    <nav className='bg-blue-600 p4 text-white'>
        <div className="container mx-auto flex justify-between ">
            {console.log(isAuthenticated)}
            <div>
                <Link to="/"  className='text-xl font-bold'>Expense Tracker </Link>
            </div>
            <div className="space-x-4">
                {isAuthenticated ? (
                    <>
                    <Link to='/transactions' className='hover:underLine'>Transactions</Link>
                    <Link to='/transactions/add' className='hover:underLine'>Add Transactions</Link>
                    <Link to='/categories/add' className='hover:underLine'>Add category</Link>
                    <form onSubmit={handleLogout} className='inline'>
                        <button type='submit' className='hover:underline'>Logout</button>
                    </form>
                    </>
                ):(<>
                
                
                    <Link to="/login" className="hover:underline">Login</Link>
                    <Link to="/signup" className="hover:underline">Sign Up</Link>
            
                </>)}
            </div>
        </div>

    </nav>
  )
}

export default Navbar;

