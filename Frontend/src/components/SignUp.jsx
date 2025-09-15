import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; 
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';


const SignUp = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [modalMessage, setModalMessage] = useState(null);
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email.trim()))
      newErrors.email = "Enter a valid email address.";

    if (!firstName.trim()) newErrors.firstName = "First name cannot be empty.";
    if (!lastName.trim()) newErrors.lastName = "Last name cannot be empty.";

    if (!password.trim()) newErrors.password = "Password is required.";
    else if (password.trim().length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await fetch('https://gptcloneapp.onrender.com/api/auth/register', {
        method: "POST",
        headers: {
          "content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: {
            firstName: firstName.trim(),
            lastName: lastName.trim()
          },
          email: email.trim(),
          password: password.trim()
        }),
        credentials: 'include'
      })

     if (!response.ok) {
        const errData = await response.json();
        setModalMessage(errData.message || "Registration failed. Try again.");
        return;
      }
      navigate('/')
    } catch (err) {
       setModalMessage("Something went wrong. Please try again.");
    }

  };

  return (
    <div className="login-container">
       {modalMessage && (
        <Modal message={modalMessage} onClose={() => setModalMessage(null)} />
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        {errors.api && <p className="error-text">{errors.api}</p>}

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
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="Enter your firstname"
          />
          {errors.firstName && <p className="error-text">{errors.firstName}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Enter your lastname"
          />
           {errors.lastName && <p className="error-text">{errors.lastName}</p>}
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
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
        <button type="submit" className="login-btn">Create an Account</button>
        <div className='text-center'>Already have an account?
          <Link to='/login'> Sign In</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
