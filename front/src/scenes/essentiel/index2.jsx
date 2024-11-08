import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline"; // Import the delete icon
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Header from "../../Components/Header.jsx";
import LineChart from "../../Components/LineChart";
import StatBox from "../../Components/StatBox";
import { importBlockedStockData, getBlockedStockData, getMissingFieldsCountByPlantAndTeam, deleteAllBlockedStockData } from '../../Services/BlockedStockService';
import { groupBy, sumBy } from 'lodash';
import MockData from "../../data/mockData.js";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EuroIcon from '@mui/icons-material/Euro';
import {useChartData}  from '../../ChartDataContext';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

const formatNumber = (number) => {
  return new Intl.NumberFormat('de-DE').format(number);
};

// Conversion rate from your existing currency to euros (example: 1 USD = 0.85 EUR)
const conversionRateToEuro = 0.92;

const HOME = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const fileInputRef = useRef(null);
  const [blockedStockData, setBlockedStockData] = useState([]);
  const { chartData, setChartData } = useChartData(); // Use the context
  const [totalValue, setTotalValue] = useState(0);
  const [missingFieldsCount, setMissingFieldsCount] = useState(0);
  const [userRole, setUserRole] = useState('');
  const [expandMainCard, setExpandMainCard] = useState(false);
  const [expandTeam, setExpandTeam] = useState({ MCA: false, CAS: false, Stamping: false, UNO: false });


  const toggleMainCard = () => setExpandMainCard(!expandMainCard);
  const toggleTeam = (team) => setExpandTeam(prev => ({ ...prev, [team]: !prev[team] }));


  const [expandedRows, setExpandedRows] = useState({});

  const toggleRowExpansion = (componentLabel) => {
    setExpandedRows((prev) => ({
      ...prev,
      [componentLabel]: !prev[componentLabel],
    }));
  };

  useEffect(() => {
    const fetchUserRole = () => {
      const role = localStorage.getItem('userRole');
      setUserRole(role || '');
    };

    fetchUserRole();
    
    // Load chart data from localStorage if available
    const storedChartData = localStorage.getItem('chartData');
    if (storedChartData) {
      setChartData(JSON.parse(storedChartData));
      fetchBlockedStockData();
    }
  }, []);

  const fetchBlockedStockData = async () => { 
    try {
        const data = await getBlockedStockData();
        const latestTimestamp = Math.floor(Number(localStorage.getItem('latestImportTimestamp')) / 1000); // Convert to seconds
        const toleranceSeconds = 3600; // 1-hour tolerance range

        console.log("Raw data:", data);
        console.log("Latest timestamp from localStorage (seconds):", latestTimestamp);

        // Filter data within the 1-hour range around the latest timestamp
        const latestData = data.filter(item => {
            const itemTimestamp = Math.floor(new Date(item.importTimestamp).getTime() / 1000); // Convert and round to seconds
            console.log("Item timestamp:", item.importTimestamp, "Converted timestamp (seconds):", itemTimestamp);
            return Math.abs(itemTimestamp - latestTimestamp) <= toleranceSeconds;
        });

        console.log("Filtered latest data:", latestData);

        setBlockedStockData(latestData); // Set filtered data to state

        // Calculate total based on the filtered latest data
        const total = sumBy(latestData, 'value');
        const totalInEuro = total * conversionRateToEuro; // Convert to euros
        console.log("Total from latest data:", totalInEuro);
        
        // Update the state with the euro value
        setTotalValue(totalInEuro); 

        const missingCount = await getMissingFieldsCountByPlantAndTeam();
        setMissingFieldsCount(missingCount);
    } catch (error) {
        console.error("Error fetching blocked stock data:", error);
    }
};



  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Clear previous blocked stock data before importing a new file
        setBlockedStockData([]);
        setTotalValue(0);

        // Extract the date from the file name
        const fileName = file.name;
        const dateMatch = fileName.match(/(\d{2})\.(\d{2})\.(\d{2})/); // Matches DD.MM.YY format

        if (dateMatch) {
          const day = parseInt(dateMatch[1]);
          const month = parseInt(dateMatch[2]) - 1; // Months are 0-indexed in JavaScript
          const year = 2000 + parseInt(dateMatch[3]); // Assuming YY is in 2000s

          const date = new Date(year, month, day);

          // Get the week number from the date
          const weekNumber = getWeekNumber(date); // You'll implement this function
          const timestamp = Date.now();
          localStorage.setItem('latestImportTimestamp', timestamp);
    
          await importBlockedStockData(file); // Import without clearing previous data
          fetchBlockedStockData();

          // Reset chart data to the new total value
          const newBlockedStockData = await getBlockedStockData();
          const total = sumBy(newBlockedStockData, 'value');
          const totalInEuro = total * conversionRateToEuro; // Convert to euros
          setTotalValue(totalInEuro); // Update the total value to the new file's data

          const newDataPoint = {
            id: 'blocked_stock',
            data: [{ x: weekNumber, y: totalInEuro }],
          };

          setChartData((prevChartData) => {
            const existingData = prevChartData.find(d => d.id === newDataPoint.id);
            const updatedChartData = existingData
              ? prevChartData.map(d =>
                  d.id === newDataPoint.id
                    ? { ...d, data: [...d.data, ...newDataPoint.data] }
                    : d
                )
              : [...prevChartData, newDataPoint];

            // Save updated chart data to localStorage
            localStorage.setItem('chartData', JSON.stringify(updatedChartData));

            return updatedChartData;
          });
        } else {
          console.error('Date not found in the file name.');
        }
      } catch (error) {
        console.error('Error importing file:', error);
      }
    }
  };

  // Function to calculate week number from a date
  const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteClick = async () => {
    try {
      await deleteAllBlockedStockData();
      setBlockedStockData([]);
      setChartData([]);
      setTotalValue(0);
      setMissingFieldsCount(0);
      localStorage.removeItem('chartData');

      console.log("All reports deleted successfully");
    } catch (error) {
      console.error("Error deleting reports:", error);
    }
  };

  const isQuality = userRole === 'Quality';
  const isSupplyChain = userRole === 'Supply Chain';

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="HOME" subtitle="Welcome to your Home Page" />
        <Box display="flex" gap="10px">
          {!isQuality && ( // Hide buttons if user is Quality
            <>
              <Button
                sx={{
                  backgroundColor: colors.orangeAccent[600],
                  color: colors.grey[100],
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "10px 20px",
                }}
                onClick={handleDeleteClick}
              >
                <DeleteOutline sx={{ mr: "10px" }} />
                Delete FILE
              </Button>
              <input
                type="file"
                accept=".xlsx, .xls, .xlsm"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <Button
                sx={{
                  backgroundColor: colors.orangeAccent[500],
                  color: colors.grey[100],
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "10px 20px",
                }}
                onClick={handleImportClick}
              >
                <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                Import FILE
              </Button>
            </>
          )}
        </Box>
      </Box>

 {/* Main Total Blocked Stock Card */}
 <Box
      gridColumn="span 15"
      gridRow="span 1"
      backgroundColor={colors.primary[100]}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      onClick={toggleMainCard} // Add onClick to expand
      sx={{
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
        cursor: 'pointer', // Change cursor to pointer
      }}
    >
      <StatBox
        title={<span style={{ color: colors.orangeAccent[600], fontSize: "45px" }}>{formatNumber(totalValue)}</span>}
        subtitle="Total Blocked Stock"
        icon={<EuroIcon sx={{ color: colors.orangeAccent[600], fontSize: "25px" }} />}
      />
    </Box>

    {/* Expanded View of Teams (MCA, CAS, Stamping, UNO) */}
    {expandMainCard && (
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="20px">
        {['MCA', 'CAS', 'Stamping', 'ADC'].map(team => (
          <Box
            key={team}
            backgroundColor={colors.primary[100]}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            position="relative"
            sx={{
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              // height: '250px', // Fixed height for uniformity
            }}
          >
            <StatBox
              title={<span style={{ color: colors.orangeAccent[600], fontSize: "30px" }}>{formatNumber(sumBy(blockedStockData.filter(item => item.team === team), 'value'))}</span>}
              subtitle={`Total ${team} Team Blocked Stock`}
              icon={<EuroIcon sx={{ color: colors.orangeAccent[600], fontSize: "25px" }} />}
            />
            <IconButton onClick={() => toggleTeam(team)} style={{ position: 'absolute', top: '10px', right: '10px' }}>
              <AddIcon />
            </IconButton>


        {/* Enhanced Expanded View for Teams Divided by Plants */}
        {expandTeam[team] && (
          <Box mt={2} display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="20px">
            {Array.from(new Set(blockedStockData
              .filter(item => item.team === team)
              .map(item => item.plant))) // Extract unique plants for each team
              .map(plant => {
                const plantData = blockedStockData.filter(item => item.team === team && item.plant === plant);
                const plantValue = formatNumber(sumBy(plantData, 'value'));
                const plantMissingFieldsCount = missingFieldsCount.find(p => p.plant === plant && p.team === team)?.missingFieldsCount || 0;

                return (
                  <Box
                    key={plant}
                    backgroundColor={colors.primary[200]} // Slightly different shade for visual distinction
                    p="20px"
                    display="flex" // Use flexbox for centering
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      borderRadius: "12px",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)", // Stronger shadow for visual pop
                      transform: "scale(1.05)", // Slight enlargement
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": { transform: "scale(1.1)" },
                      height: '150px', // Fixed height for uniformity
                    }}
                  >
                    <Typography variant="h6" fontWeight="600" fontSize="16px" color={colors.orangeAccent[600]}>
                      Plant {plant}
                    </Typography>
                    <StatBox
                      title={
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <span style={{ color: colors.orangeAccent[600], fontSize: "1.1em", fontWeight: "bold" }}>
                            {plantValue}
                            </span>
                                <span
                                  style={{
                                    fontSize: "14px",
                                    color: colors.grey[600],
                                  }}
                                >               
                              ({plantMissingFieldsCount} missing fields)
                            </span>
                          
                        </div>
                      }
                    />
                  </Box>
                );
              })
            }
          </Box>
        )}

          </Box>
        ))}
      </Box>
    )}

        {/* ROW 2 */}
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
        <Box
          gridColumn="span 15"
          gridRow="span 2"
          backgroundColor={colors.primary[100]}
          mt="25px"
          mb="25px"
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s ease-in-out",
            "&:hover": { transform: "scale(1.02)" },
          }}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.orangeAccent[400]}
                fontSize="19px"
              >
              Blocked Stock Value Evolution
              </Typography>
            </Box>
              {/* <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.orangeAccent[500] }}
                />
              </IconButton> */}
            
          <Box
            height="250px"
            m="-10px 0 0 0"
            display="flex" // Enables flexbox
            justifyContent="center" // Centers horizontally
            alignItems="center" // Centers vertically
          >
            {chartData.length > 0 ? (
              <LineChart data={chartData} isDashboard={true} />
            ) : (
              <Typography sx={{ marginTop: '20px' }}>No data available</Typography> // Fallback UI with margin
            )}
          </Box>
        </Box>
      </Box>
      </Box>



   

  );
};

export default HOME;