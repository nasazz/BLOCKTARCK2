import { Box, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import ProfileMenu from "../../Components/ProfileMenu/ProfileMenu";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);

  // Handler for opening the profile menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handler for closing the profile menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl); // Check if the profile menu is open
  const id = open ? 'profile-popover' : undefined; // Set an id if the profile menu is open

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      p={0} 
      sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        width: '100%', 
        backgroundColor: 'inherit'
     //   height: '80px', // Increase height of the Topbar
      }}
    >
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        {/* Uncomment and use if a search functionality is needed */}
        {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton> */}
      </Box>

      {/* ICONS */}
      <Box display="flex">
        {/* Toggle between light and dark mode */}
        {/* <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton> */}
        
        {/* Notifications icon */}
        {/* <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton> */}
        
        {/* Settings icon */}
        {/* <IconButton>
          <SettingsOutlinedIcon />
        </IconButton> */}

        {/* Profile menu with specified size in px */}
        <ProfileMenu buttonSize="100px" iconSize="30px" /> 
      </Box>
    </Box>
  );
};

export default Topbar;
