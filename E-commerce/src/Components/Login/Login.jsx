import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import loginImage from './lo.jpg';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { login, isLoggedIn, userNameDisplay, logout } = useContext(AuthContext);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error || 'Login failed');
            } else if (error.request) {
                setErrorMessage('No response received from server');
            } else {
                setErrorMessage('Request failed to be sent');
            }
        }
    };
    console.log(userNameDisplay)

    return (
        <div className="py-16 mt-20">
            <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                <div className="hidden lg:block lg:w-1/2 bg-cover" style={{ backgroundImage: `url(${loginImage})` }}></div>
                <div className="w-full p-8 lg:w-1/2">
                    <h2 className="text-2xl font-medium text-black text-center">JACKIE SMITH</h2>
                    {isLoggedIn ? (
                        <>
                            <p className="text-xl text-gray-600 text-center">Welcome back, {isLoggedIn? userNameDisplay:"USER"}!</p>

                            <button onClick={logout} className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600 mt-4">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-xl text-gray-600 text-center">Welcome back!</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="border-b w-1/5 lg:w-1/4"></span>
                                <p className="text-xs text-center text-gray-500 uppercase">or login with Username</p>
                                <span className="border-b w-1/5 lg:w-1/4"></span>
                            </div>
                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="mt-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">User Name</label>
                                    <input
                                        className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <div className="flex justify-between">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                        <Link to="/forgot-password" className="text-xs text-gray-500">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <input
                                        className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {errorMessage && <p className="error">{errorMessage}</p>}
                                <div className="mt-8">
                                    <button
                                        type="submit"
                                        className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                                    >
                                        Login
                                    </button>
                                </div>
                            </form>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="border-b w-1/5 md:w-1/4"></span>
                                <Link to="/register" className="text-xs text-gray-500 uppercase">
                                    or sign up
                                </Link>
                                <span className="border-b w-1/5 md:w-1/4"></span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
