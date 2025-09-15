import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; 
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false)
  const [modalMessage, setModalMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
   setSubmitting(true)
    try {
      const response = await fetch('https://gptcloneapp.onrender.com/api/auth/login', {
        method: "POST",
        headers: {
          "content-Type": "application/json"
        },
        body: JSON.stringify({
          email, password
        }),
        credentials: 'include'
      })

      const data = await response.json();
      if(!response.ok){
         setSubmitting(false)
        setModalMessage(errData.message || "Registration failed. Try again.");
         return
      }
      navigate('/')
     
    } catch(err){
     setModalMessage("Something went wrong. Please try again.");
      setSubmitting(false)
    }
      };

  return (
    <div className="login-container">
       {modalMessage && (
              <Modal message={modalMessage} onClose={() => setModalMessage(null)} />
            )}
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="login-btn">{submitting ? "Signing in" : "Login"}</button>
        <div className='text-center'>Need an account?
          <Link to='/register'> Create one</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
