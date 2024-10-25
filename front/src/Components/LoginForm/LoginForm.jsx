import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { loginUser, registerUser } from '../../Services/userService';
import { useNavigate } from 'react-router-dom';
import { FaBriefcase } from "react-icons/fa6";
import { MdHomeWork } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { fetchDepartments, fetchTeams, fetchRoles, fetchPlants } from '../../Services/configurationService';

function LoginForm() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [plant, setPlant] = useState('');
    const [department, setDepartment] = useState('');
    const [team, setTeam] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false); // For showing loading indicators
    const [plants, setPlants] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true); // Show loading while data is fetched
                const plantsData = await fetchPlants();
                setPlants(plantsData);
                const departmentsData = await fetchDepartments();
                setDepartments(departmentsData);
                const teamsData = await fetchTeams();
                setTeams(teamsData);
                const rolesData = await fetchRoles();
                setRoles(rolesData);
                setLoading(false); // Hide loading after data is fetched
            } catch (error) {
                setError('Failed to load data.');
                setLoading(false);
            }
        };

        loadData();
    }, []);



    useEffect(() => {
        // Reset error and success messages when toggling between login and register
        setError('');
        setSuccess('');
    }, [isRegister]);

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

         
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (isRegister) {
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }

            if (password.length < 6) {
                setError('Password should be at least 6 characters.');
                return;
            }

            try {
                setLoading(true); // Show loading while registering
                const data = await registerUser({ email, password, fullName, plant, department, team, role });
                setSuccess('Registration successful! Redirecting...');
                setTimeout(() => {
                    setIsRegister(false);
                }, 1000);
            } catch (err) {
                setError('Registration failed. Please try again.');
            } finally {
                setLoading(false); // Hide loading after registration attempt
            }
        } else {
            try {
                setLoading(true); // Show loading while logging in
                const data = await loginUser(email, password);
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('userTeam', data.team)
                localStorage.setItem('userPlant', data.plant);
                console.log('JWT Token:', data.token);
                console.log('User Role:', data.role);
                console.log('User Team:', data.team);
                console.log('User Plant:', data.plant);
                setSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            } catch (err) {
                setError('Login failed. Please check your email and password.');
            } finally {
                setLoading(false); // Hide loading after login attempt
            }
        }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>{isRegister ? 'Register' : 'Login'}</h1>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FaUserAlt className='icon' />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FaLock className='icon' />
                </div>
                {isRegister && (
                    <>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <FaLock className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                            <FaUserAlt className='icon' />
                        </div>
                        <div className="input-box">
                            <select
                                value={plant}
                                onChange={(e) => setPlant(e.target.value)}
                                required
                            >
                                <option value="">Select Plant</option>
                                {plants.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <FaBriefcase className='icon' />
                        </div>
                        <div className="input-box">
                            <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                            <MdHomeWork className='icon' />
                        </div>
                        <div className="input-box">
                            <select
                                value={team}
                                onChange={(e) => setTeam(e.target.value)}
                                required
                            >
                                <option value="">Select Team</option>
                                {teams.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            <RiTeamFill className='icon' />
                        </div>
                        <div className="input-box">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <option value="">Select Role</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                            <FaUserAlt className='icon' />
                        </div>
                    </>
                )}
                <button type='submit' disabled={loading}>
                    {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
                </button>
                <div className="register-link">
                    <p>
                        {isRegister ? (
                            <>
                                Already have an account?
                                <a href="#!" onClick={() => setIsRegister(false)}>Login</a>
                            </>
                        ) : (
                            <>
                                Don't have an account?
                                <a href="#!" onClick={() => setIsRegister(true)}>Register</a>
                            </>
                        )}
                    </p>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;

