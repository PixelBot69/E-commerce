import React, { useState, useContext } from 'react';
import axios from 'axios';
import loginImage from './lo1.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../../AuthContext';

function Register() {
    const navigate = useNavigate();
    const { login, googleLogin } = useContext(AuthContext);
   
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registeredUsername, setRegisteredUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleGoogleSuccess = (response) => {
        googleLogin(response);
    };

    const handleGoogleFailure = (response) => {
        console.log('Google login failed:', response);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', {
                username,
                email,
                password,
            });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setRegisteredUsername(username);
            setUsername('');
            setEmail('');
            setPassword('');
            login(username, password);
            navigate('/');
        } catch (error) {
            setErrorMessage(error.response.data.error || 'Registration failed');
        }
    };

    return (
        <div className="py-16 mt-20">
            <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                <div className="hidden lg:block lg:w-1/2 bg-cover" style={{ backgroundImage: `url(${loginImage})` }}></div>
                <div className="w-full p-8 lg:w-1/2">
                    <h2 className="text-2xl font-medium text-black text-center">JACKIE SMITH</h2>
                    <p className="text-xl text-gray-600 text-center">Welcome</p>
                    <GoogleLogin clientId={clientID} onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
                    <div className="mt-4 flex items-center justify-between">
                        <span className="border-b w-1/5 lg:w-1/4"></span>
                        <a href="#" className="text-xs text-center text-gray-500 uppercase">or REGISTER with email</a>
                        <span className="border-b w-1/5 lg:w-1/4"></span>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                            <input className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">User Name</label>
                            <input className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                            </div>
                            <input className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        <div className="mt-8">
                            <button type="submit" className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600">Register</button>
                        </div>
                    </form>
                    {registeredUsername && (
                        <div className="mt-4 text-center">
                            <p>Registered successfully as: {registeredUsername}</p>
                            <Link to="/login" className="text-xs text-gray-500 uppercase">Proceed to login</Link>
                        </div>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                        <span className="border-b w-1/5 md:w-1/4"></span>
                        <Link to="/login" className="text-xs text-gray-500 uppercase">or sign in</Link>
                        <span className="border-b w-1/5 md:w-1/4"></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
