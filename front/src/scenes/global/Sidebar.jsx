  // import { useState, useEffect } from "react";
  // import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
  // import { Box, IconButton, Typography, useTheme } from "@mui/material";
  // import { Link } from "react-router-dom";
  // import "react-pro-sidebar/dist/css/styles.css";
  // import { tokens } from "../../theme";
  // import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
  // import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
  // import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
  // import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
  // import { MdSpaceDashboard } from "react-icons/md";
  // import SettingsIcon from "@mui/icons-material/Settings";

  // const Item = ({ title, to, icon, selected, setSelected }) => {
  //   const theme = useTheme();
  //   const colors = tokens(theme.palette.mode);
  //   return (
  //     <MenuItem
  //       active={selected === title}
  //       style={{
  //         color: colors.grey[100],
  //       }}
  //       onClick={() => setSelected(title)}
  //       icon={icon}
  //     >
  //       <Typography>{title}</Typography>
  //       <Link to={to} />
  //     </MenuItem>
  //   );
  // };

  // const Sidebar = () => {
  //   const theme = useTheme();
  //   const colors = tokens(theme.palette.mode);
  //   const [isCollapsed, setIsCollapsed] = useState(false);
  //   const [selected, setSelected] = useState("HOME");
  //   const [userRole, setUserRole] = useState('');

  //   // Fetch user role from localStorage
  //   useEffect(() => {
  //     const role = localStorage.getItem('userRole'); // Correctly retrieve the role
  //     console.log('Fetched Role:', role); // Debugging line
  //     setUserRole(role || ''); // Ensure a default empty string if role is null
  //   }, []);

  //   // Check if the user role is Admin
  //   const isAdmin = userRole === 'admin';
  //   console.log('Is Admin:', isAdmin); // Debugging line

  //   return (
  //     <Box
  //       sx={{
  //         "& .pro-sidebar-inner": {
  //           background: `${colors.orangeAccent[500]} !important`,
  //         },
  //         "& .pro-icon-wrapper": {
  //           backgroundColor: "transparent !important",
  //         },
  //         "& .pro-inner-item": {
  //           padding: "10px 35px 15px 20px !important",
  //         },
  //         "& .pro-inner-item:hover": {
  //           color: "#5c5c5c !important",
  //         },
  //         "& .pro-menu-item.active": {
  //           color: "#5c5c5c !important",
  //         },
  //       }}
  //     >
  //       <ProSidebar collapsed={isCollapsed}>
  //         <Menu iconShape="square">
  //           {/* LOGO AND MENU ICON */}
  //           <MenuItem
  //             onClick={() => setIsCollapsed(!isCollapsed)}
  //             icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
  //             style={{
  //               margin: "10px 0 60px 0",
  //               color: colors.grey[100],
  //             }}
  //           >
  //             {!isCollapsed && (
  //               <Box
  //                 display="flex"
  //                 justifyContent="space-between"
  //                 alignItems="center"
  //                 ml="55px"
  //               >
  //                 <Typography variant="h3" color={colors.grey[100]}>
  //                   BlockTrack
  //                 </Typography>
  //                 <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
  //                   <MenuOutlinedIcon />
  //                 </IconButton>
  //               </Box>
  //             )}
  //           </MenuItem>

  //           <Box paddingLeft={isCollapsed ? undefined : "10%"}>
  //             <Item
  //               title="HOME"
  //               to="/home"
  //               icon={<HomeOutlinedIcon />}
  //               selected={selected}
  //               setSelected={setSelected}
  //             />
  //             <Item
  //               title="Dashboard"
  //               to="/dashboard"
  //               icon={<MdSpaceDashboard />}
  //               selected={selected}
  //               setSelected={setSelected}
  //             />

  //             <Item
  //               title="Blocked Stock"
  //               to="/contacts"
  //               icon={<ContactsOutlinedIcon />}
  //               selected={selected}
  //               setSelected={setSelected}
  //             />

  //             <Typography
  //               variant="h6"
  //               fontWeight="bold"
  //               color={colors.primary[800]}
  //               sx={{ m: "10px 0 10px 50px" }}
  //             >
  //               App Management
  //             </Typography>

  //             {/* Conditionally render "Manage Team" if user is Admin */}
  //             {isAdmin && (
  //               <Item
  //                 title="Manage Team"
  //                 to="/team"
  //                 icon={<PeopleOutlinedIcon />}
  //                 selected={selected}
  //                 setSelected={setSelected}
  //               />
  //             )}
              
              
  //           </Box>

  //           {/* Conditionally render "Configuration" if user is Admin */}
  //           {isAdmin && (
  //             <Box paddingLeft={isCollapsed ? undefined : "10%"}>
  //               <Item
  //                 title="Configuration"
  //                 to="/configuration"
  //                 icon={<SettingsIcon />}
  //                 selected={selected}
  //                 setSelected={setSelected}
  //               />
  //             </Box>
  //           )}
  //         </Menu>
  //       </ProSidebar>
  //     </Box>
  //   );
  // };

  // export default Sidebar;


  import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SidebarFooter } from "react-pro-sidebar";
import { Box, IconButton, Typography, Tooltip, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { MdSpaceDashboard } from "react-icons/md";
import SettingsIcon from "@mui/icons-material/Settings";
import AppsIcon from "@mui/icons-material/Apps";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
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

  // Fetch user role from localStorage
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');
  }, []);

  // Check if the user role is Admin
  const isAdmin = userRole === 'admin';

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.orangeAccent[500]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "10px 35px 15px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#5c5c5c !important",
        },
        "& .pro-menu-item.active": {
          color: "#5c5c5c !important",
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
              margin: "10px 0 60px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="55px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  BlockTrack
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
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
            <Box
              style={{
                margin: "25px 0 25px 0",
                color: colors.grey[300],
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start", // Center when collapsed
              }}
            >
              <AppsIcon style={{ marginLeft: isCollapsed ? "0px" : "10px" }} /> {/* Shift the icon to the right */}
              {!isCollapsed && (
                <Typography variant="h6" sx={{ marginLeft: "10px" }}>
                  App Management
                </Typography>
              )}
            </Box>

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
