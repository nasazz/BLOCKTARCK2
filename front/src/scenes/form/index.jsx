  import React, { useEffect, useState } from 'react';
  import { useNavigate, useParams } from 'react-router-dom';
  import { Box, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
  import { getUserById, registerUser, updateUser } from '../../Services/userService';
  import { fetchPlants, fetchDepartments, fetchTeams, fetchRoles } from '../../Services/configurationService'; // Ensure these service functions are correctly implemented

  const Form = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [userData, setUserData] = useState({
      fullName: '',
      email: '',
      plant: '',
      department: '',
      team: '',
      role: '',
      password: '',
    });
    const [plants, setPlants] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
      const fetchData = async () => {
        try {
          const [plantsData, departmentsData, teamsData, rolesData] = await Promise.all([
            fetchPlants(),
            fetchDepartments(),
            fetchTeams(),
            fetchRoles(),
          ]);
          setPlants(plantsData);
          setDepartments(departmentsData);
          setTeams(teamsData);
          setRoles(rolesData);
        } catch (error) {
          console.error("Failed to fetch configuration data:", error);
        }
      };

      fetchData();

      if (userId) {
        const fetchUserData = async () => {
          try {
            const user = await getUserById(userId);
            setUserData(user);
          } catch (error) {
            console.error("Failed to fetch user data:", error);
          }
        };
        fetchUserData();
      }
    }, [userId]);

    const handleChange = (e) => {
      setUserData({
        ...userData,
        [e.target.name]: e.target.value,
      });
    };

    const validate = () => {
      const newErrors = {};
      if (userData.password && userData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
      }
      if (userData.password && !/[a-z]/.test(userData.password)) {
        newErrors.password = "Password must contain at least one lowercase letter.";
      }
      if (userData.password && !/[A-Z]/.test(userData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter.";
      }
      if (userData.password && !/[0-9]/.test(userData.password)) {
        newErrors.password = "Password must contain at least one number.";
      }
      if (userData.password && !/[\W_]/.test(userData.password)) {
        newErrors.password = "Password must contain at least one special character.";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validate()) {
          return;
      }
      try {
          if (userId) {
              await updateUser(userId, userData);
          } else {
              await registerUser(userData);
          }
          navigate('/team');
      } catch (error) {
          console.error("Failed to save user data:", error); // Log the error for debugging
          if (error.response && error.response.data) {
              const serverErrors = error.response.data.errors || []; // Fallback to an empty array
              const newErrors = {};
              serverErrors.forEach(err => {
                  if (err.code.includes("Password")) {
                      newErrors.password = newErrors.password ? `${newErrors.password} ${err.description}` : err.description;
                  }
              });
              setErrors(newErrors);
          }
      }
  };
    return (
      <Box m="20px">
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.fullName}
            helperText={errors.fullName}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={userData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Plant</InputLabel>
            <Select
              name="plant"
              value={userData.plant || ''}
              onChange={handleChange}
              error={!!errors.plant}
            >
              {plants.map((plant) => (
                <MenuItem key={plant.id} value={plant.name}>
                  {plant.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={userData.department || ''}
              onChange={handleChange}
              error={!!errors.department}
            >
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.name}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Team</InputLabel>
            <Select
              name="team"
              value={userData.team || ''}
              onChange={handleChange}
              error={!!errors.team}
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.name}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={userData.role || ''}
              onChange={handleChange}
              error={!!errors.role}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {!userId && (
            <TextField
              label="Password"
              name="password"
              type="password"
              value={userData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
            />
          )}
          <Button type="submit" variant="contained" color="secondary">
            {userId ? 'Update User' : 'Register User'}
          </Button>
          {/* <Button type="exit" variant="contained" color="primary">
            {userId ? 'exit' : 'Register User'}
          </Button> */}
        </form>
      </Box>
    );
  };

  export default Form;
