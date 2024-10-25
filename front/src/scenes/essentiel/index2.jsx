import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline"; // Import the delete icon
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Header from "../../Components/Header.jsx";
import LineChart from "../../Components/LineChart";
import StatBox from "../../Components/StatBox";
import { importBlockedStockData, getBlockedStockData, getMissingFieldsCount, deleteAllBlockedStockData } from '../../Services/BlockedStockService';
import { groupBy, sumBy } from 'lodash';
import MockData from "../../data/mockData.js";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EuroIcon from '@mui/icons-material/Euro';
import {useChartData}  from '../../ChartDataContext';
import { DataGrid } from '@mui/x-data-grid';


const formatNumber = (number) => {
  return new Intl.NumberFormat('de-DE').format(number);
};

// Conversion rate from your existing currency to euros (example: 1 USD = 0.85 EUR)
const conversionRateToEuro = 0.85;

const HOME = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const fileInputRef = useRef(null);
  const [blockedStockData, setBlockedStockData] = useState([]);
  const { chartData, setChartData } = useChartData(); // Use the context
  const [totalValue, setTotalValue] = useState(0);
  const [missingFieldsCount, setMissingFieldsCount] = useState(0);
  const [userRole, setUserRole] = useState('');

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
      setBlockedStockData(data);

      const total = sumBy(data, 'value');
      const totalInEuro = total * conversionRateToEuro; // Convert to euros
      setTotalValue(totalInEuro); // Update the state with the euro value

      setMissingFieldsCount(await getMissingFieldsCount());
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

          await importBlockedStockData(file);
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

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(15, 4fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[100]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={
              <span style={{ textAlign: 'center', display: 'block' }}>
                <span style={{ color: colors.orangeAccent[600] }} >
                   {formatNumber(totalValue)}
                </span>
              </span>
            }
            subtitle="Total Blocked Stock Value (EUR)"
            icon={
              <EuroIcon
                sx={{ color: colors.orangeAccent[600], fontSize: "25px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[100]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={
              <span style={{ textAlign: 'center', display: 'block' }}>
                <span style={{ color: colors.orangeAccent[600] }}>
                {formatNumber(sumBy(blockedStockData.filter(item => item.team === 'MCA'), 'value'))}
                </span>
              </span>
            }
            subtitle="Total MCA Team Blocked Stock"
            icon={
              <EuroIcon
              sx={{ color: colors.orangeAccent[600], fontSize: "25px" }}
            />
            }
          />
        </Box>
        
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[100]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={
              <span style={{ textAlign: 'center', display: 'block' }}>
                <span style={{ color: colors.orangeAccent[600] }}>
                {formatNumber(sumBy(blockedStockData.filter(item => item.team === 'CAS'), 'value'))}
                </span>
              </span>
            }
            subtitle="Total CAS Team Blocked Stock"
            icon={
              <EuroIcon
                sx={{ color: colors.orangeAccent[600], fontSize: "25px" }}
              />
            }
          />
        </Box>
        <Box gridColumn="span 3" backgroundColor={colors.primary[100]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title={
              <span style={{ textAlign: 'center', display: 'block' }}>
                <span style={{ color: colors.orangeAccent[600] }}>
                {formatNumber(sumBy(blockedStockData.filter(item => item.team === 'CAS'), 'value'))}
                </span>
              </span>
            } 
            subtitle="Total Stamping Team Blocked Stock"
            icon={<EuroIcon
              sx={{ color: colors.orangeAccent[600], fontSize: "25px" }}
            />}
          />
        </Box>

          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[100]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={<span style={{ color: colors.orangeAccent[600] }}>{missingFieldsCount}</span>}
              subtitle="Rows Missing Quality Fields"
              icon={<NotificationsOutlinedIcon sx={{ color: colors.orangeAccent[600], fontSize: "26px" }} />}
            />
          </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 15"
          gridRow="span 2"
          backgroundColor={colors.primary[100]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.orangeAccent[400]}
              >
              Blocked Stock Value Evolution
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.orangeAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box
            height="250px"
            m="-20px 0 0 0"
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
          
{/* 
    <Box gridColumn="span 12" gridRow="span 2" backgroundColor={colors.primary[100]}  sx={{ marginTop: '30px' }}>
      <DataGrid 
        rows={rows} 
        columns={columns} 
        pageSize={5} 
        rowsPerPageOptions={[5, 10, 20]} 
        pagination 
        autoHeight
        sx={{
          width: "100%",
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: `0 4px 6px rgba(0, 0, 0, 0.1)`,
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${colors.grey[300]}`,
            fontSize: '16px',
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.orangeAccent[500],
            borderBottom: `1px solid ${colors.grey[300]}`,
            fontSize: '16px',
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
        }}
      />
    </Box> */}


    </Box>
  );
};

export default HOME;