import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Menu, MenuItem, ListItemIcon } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import {jwtDecode} from 'jwt-decode'; // Correct import without braces for jwtDecode
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({ fullName: '', role: '', id: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate(); // Use useNavigate for handling navigation

  // Define sizes directly within the component
  const buttonSize = '45px'; // Set button size in px
  const iconSize = '40px'; // Set icon size in px

  useEffect(() => {
    const fetchUser = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setUser({
            fullName: decodedToken['FullName'] || 'N/A', // Reading the custom "FullName" claim
            role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'N/A', // Reading the "Role" claim
            id: decodedToken['sub'] // Reading the User ID from the "sub" claim
          });
        }
      } catch (err) {
        setError('Failed to fetch user data');
        console.error('Fetch User Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear token from local storage
    localStorage.removeItem('token');
    // Redirect to the login page or any other desired page
    navigate('/login'); // Use navigate to redirect
    // Optionally refresh the app or clear user state
    window.location.reload(); // Refresh the app to clear user data
  };

  const handleProfileClick = () => {
    if (user.id) {
      navigate(`/form/${user.id}`); // Navigate to the form with the user's ID
    }
    handleClose();
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        sx={{ 
          width: buttonSize,  // Set button width in px
          height: buttonSize, // Set button height in px
          padding: 0,         // Remove padding to match the button size
        }}
      >
        <PersonOutlinedIcon sx={{ fontSize: iconSize }} /> {/* Set icon size in px */}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 4,
          sx: {
            overflow: "visible",
            mt: 1.5,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box p={2}>
          <Typography variant="h6">{user.fullName}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user.role}
          </Typography>
        </Box>
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonOutlinedIcon fontSize="small" />
          </ListItemIcon>
          My profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileMenu;
