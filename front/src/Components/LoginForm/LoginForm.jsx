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
    const [plants, setPlants] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const plantsData = await fetchPlants();
                setPlants(plantsData);

                const departmentsData = await fetchDepartments();
                setDepartments(departmentsData);

                const teamsData = await fetchTeams();
                setTeams(teamsData);

                const rolesData = await fetchRoles();
                setRoles(rolesData);
            } catch (error) {
                setError('Failed to load data');
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        // Reset error and success messages when toggling between login and register
        setError('');
        setSuccess('');
    }, [isRegister]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (isRegister) {
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }

            try {
                const data = await registerUser({ email, password, fullName, plant, department, team, role });
                setSuccess('Registration successful!');
                setTimeout(() => {
                    setIsRegister(false);
                }, 1000);
            } catch (err) {
                if (err.response && err.response.data) {
                    const serverErrors = err.response.data.errors;
                    setError(serverErrors.join(' '));
                } else {
                    setError('Registration failed. Please try again.');
                }
            }
        } else {
            try {
                const data = await loginUser(email, password);
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role); // Store role information
                console.log('JWT Token:', data.token);
                console.log('User Role:', data.role);
                setSuccess('Login successful!');
                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            } catch (err) {
                setError('Login failed. Please check your email and password.');
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
                        type="text"
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
                <button type='submit'>{isRegister ? 'Register' : 'Login'}</button>
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
