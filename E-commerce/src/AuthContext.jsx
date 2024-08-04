import React, { createContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userNameDisplay, setUserNameDisplay] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://127.0.0.1:8000/api/user/', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setUserNameDisplay(response.data.username);
                setUser(response.data);
                setIsLoggedIn(true);
            })
            .catch(error => console.log('Error fetching user details:', error));
        }
    }, []);

    const login = (username, password) => {
        return axios.post('http://127.0.0.1:8000/api/login/', { username, password })
            .then(response => {
                const token = response.data.token.access;
                localStorage.setItem('token', token);
                setUser({ id: response.data.user_id, username });
                setUserNameDisplay(username);
                setIsLoggedIn(true);
            });
    };

    const googleLogin = (response) => {
        axios.post('http://127.0.0.1:8000/api/auth/google/', { access_token: response.credential })
            .then(res => {
                const token = res.data.token.access;
                localStorage.setItem('token', token);
                setUser({ id: res.data.user_id, username: res.data.username });
                setUserNameDisplay(res.data.username);
                setIsLoggedIn(true);
            })
            .catch(error => console.log('Error during Google login:', error));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserNameDisplay('');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userNameDisplay, user, login, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
