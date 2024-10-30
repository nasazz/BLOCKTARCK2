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
          background: `linear-gradient(135deg, ${colors.orangeAccent[500]} 0%, ${colors.orangeAccent[700]} 100%) !important`, // Subtle gradient
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "8px 20px !important", // Refined padding
          fontSize: "15px", // Slightly smaller font for simplicity
          color: colors.grey[100],
        },
        "& .pro-inner-item:hover": {
          color: "#555 !important", // Lighter hover effect
          borderLeft: "3px solid #fff", // Left border for a modern hover style
        },
        "& .pro-menu-item.active": {
          color: "#000 !important",
          borderLeft: "4px solid #fff", // Thicker border on active item for visual clarity
          backgroundColor: "rgba(255, 255, 255, 0.1) !important", // Subtle background for active item
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
  <Menu iconShape="square">
    {/* Collapse Button */}
    <MenuItem
      onClick={() => setIsCollapsed(!isCollapsed)}
      icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
      style={{
        margin: "10px 0 20px 0",
        color: colors.grey[100],
        display: "flex",
        justifyContent: isCollapsed ? "center" : "space-between", // Align button properly
        padding: isCollapsed ? "0" : "10px 20px", // Spacing when expanded
      }}
    >
      {/* Display IconButton when expanded */}
      {!isCollapsed && (
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <MenuOutlinedIcon />
        </IconButton>
      )}
    </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10px"}>
            <Item title="HOME" to="/home" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Dashboard" to="/dashboard" icon={<MdSpaceDashboard />} selected={selected} setSelected={setSelected} />
            <Item title="Blocked Stock" to="/contacts" icon={<ContactsOutlinedIcon />} selected={selected} setSelected={setSelected} />

            {isAdmin && (
              <Box
                style={{
                  margin: "15px 0",
                  color: colors.primary[900],
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  // borderTop: 1px solid ${colors.grey[800]}, // Separator line
                  paddingTop: "10px",
                }}
              >
                <AppsIcon style={{ marginLeft: isCollapsed ? "0px" : "10px" }} />
                {!isCollapsed && <Typography variant="h6" sx={{ marginLeft: "10px" }}>App Management</Typography>}
              </Box>
            )}

            {isAdmin && <Item title="Manage Team" to="/team" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />}
          </Box>

          {isAdmin && (
            <Box paddingLeft={isCollapsed ? undefined : "10px"}>
              <Item title="Configuration" to="/configuration" icon={<SettingsIcon />} selected={selected} setSelected={setSelected} />
            </Box>
          )}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;