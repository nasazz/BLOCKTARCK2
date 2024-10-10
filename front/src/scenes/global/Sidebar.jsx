
import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link , useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { MdSpaceDashboard } from "react-icons/md";
import SettingsIcon from "@mui/icons-material/Settings";
import AppsIcon from "@mui/icons-material/Apps";
import logo from '../../Components/Assets/icons/logo345.png';


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => {
        setSelected(title);
        localStorage.setItem("selectedItem", title); // Save selected item
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("HOME");
  const [userRole, setUserRole] = useState('');
  const location = useLocation(); // Get current path

  // Fetch user role from localStorage
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');

    const currentPath = location.pathname;
    const savedSelectedItem = localStorage.getItem("selectedItem");

    // Match the current route to set the correct selected item
    if (currentPath.includes("home")) {
      setSelected("HOME");
    } else if (currentPath.includes("dashboard")) {
      setSelected("Dashboard");
    } else if (currentPath.includes("contacts")) {
      setSelected("Blocked Stock");
    } else if (currentPath.includes("team")) {
      setSelected("Manage Team");
    } else if (currentPath.includes("configuration")) {
      setSelected("Configuration");
    } else if (savedSelectedItem) {
      setSelected(savedSelectedItem); // If no match, fallback to saved item
    }

  }, [location]);

  // Check if the user role is Admin
  const isAdmin = userRole === 'admin';

  return (
        <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.orangeAccent[500]} !important`, // Lighter orange
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "10px 20px !important", // Decreased padding
        },
        "& .pro-inner-item:hover": {
          color: "#333 !important", // Darker hover color
        },
        "& .pro-menu-item.active": {
          color: "#000 !important", // Stronger active color
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
    <Menu iconShape="square">
      {/* LOGO AND MENU ICON */}
      <MenuItem
        onClick={() => setIsCollapsed(!isCollapsed)}
        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
        style={{
          margin: "10px 0 40px 0", // Adjust margin to reduce top space
          color: colors.grey[100],
        }}
      >
        {!isCollapsed && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            margin="15px 0"
          >
         {/*    <img
              src={logo}
              alt="Logo"
              style={{
                width: "120px", // Reduced size
                height: "120px",
                borderRadius: "10px", // Add rounded corners
              }}
            /> */}
            <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
              <MenuOutlinedIcon />
            </IconButton>
          </Box>
        )}
      </MenuItem>

            {/* Menu Items */}
          <Box paddingLeft={isCollapsed ? undefined : "5%"}>
            <Item
              title="HOME"
              to="/home"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<MdSpaceDashboard />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Blocked Stock"
              to="/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
              
              {/* App Management Label */}
              {isAdmin && (

            <Box
              style={{
                margin: "20px 0",
                color: colors.grey[300],
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
              }}
            >
              <AppsIcon style={{ marginLeft: isCollapsed ? "0px" : "10px" }} /> {/* Shift the icon to the right */}
              {!isCollapsed && (
                <Typography variant="h6" sx={{ marginLeft: "10px" }}>
                  App Management
                </Typography>
              )}
            </Box>
            )}

            {/* Conditionally render "Manage Team" if user is Admin */}
            {isAdmin && (
              <Item
                title="Manage Team"
                to="/team"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
          </Box>

          {/* Conditionally render "Configuration" if user is Admin */}
          {isAdmin && (
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Configuration"
                to="/configuration"
                icon={<SettingsIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          )}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
