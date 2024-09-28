import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DeleteOutline from "@mui/icons-material/DeleteOutline"; // Import the delete icon

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Header from "../../Components/Header.jsx";
import LineChart from "../../Components/LineChart";
import StatBox from "../../Components/StatBox";
import BarChart from "../../Components/BarChart";
import ProgressCircle from "../../Components/ProgressCircle";
import PieChart from "../../Components/PieChart";
import MockData from "../../data/mockData.js";
import { mockPieData } from '../../data/mockData';



import { importBlockedStockData, getBlockedStockData, getMissingFieldsCount, deleteAllBlockedStockData } from '../../Services/BlockedStockService';
import { groupBy, sumBy } from 'lodash';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const fileInputRef = useRef(null);
  const [blockedStockData, setBlockedStockData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [missingFieldsCount, setMissingFieldsCount] = useState(0);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserRole = () => {
      const role = localStorage.getItem('userRole');
      setUserRole(role || '');
    };

    fetchUserRole();

    const fetchBlockedStockData = async () => {
      try {
        const data = await getBlockedStockData();
        setBlockedStockData(data);

        const total = sumBy(data, 'value');
        setTotalValue(total);

        const aggregatedData = aggregateDataByWeek(data);
        const sortedData = aggregatedData.sort((a, b) => a.week - b.week);
        const transformedData = [
          {
            id: "blocked_stock",
            data: sortedData.map(item => ({
              x: item.week,
              y: item.value,
            })),
          },
        ];
        setChartData(transformedData);

        const missingCount = await getMissingFieldsCount();
        setMissingFieldsCount(missingCount);
      } catch (error) {
        console.error("Error fetching blocked stock data:", error);
      }
    };

    fetchBlockedStockData();
  }, []);

  const aggregateDataByWeek = (data) => {
    const groupedData = groupBy(data, (item) => {
      const date = new Date(item.createdOn);
      const week = Math.ceil(((date - new Date(date.getFullYear(), 0, 1)) / 86400000 + 1) / 7);
      return week; // Return only the week number
    });

    return Object.keys(groupedData).map(key => {
      const values = groupedData[key];
      return {
        week: parseInt(key, 10), // Convert key to integer
        value: sumBy(values, 'value'),
      };
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await importBlockedStockData(file);
        const data = await getBlockedStockData();
        setBlockedStockData(data);

        const total = sumBy(data, 'value');
        setTotalValue(total);

        const aggregatedData = aggregateDataByWeek(data);
        const sortedData = aggregatedData.sort((a, b) => a.week - b.week);
        const transformedData = [
          {
            id: "blocked_stock",
            data: sortedData.map(item => ({
              x: item.week,
              y: item.value,
            })),
          },
        ];
        setChartData(transformedData);

        const missingCount = await getMissingFieldsCount();
        setMissingFieldsCount(missingCount);
      } catch (error) {
        console.error("Error importing file:", error);
      }
    }
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
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
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
                <span style={{ color: colors.orangeAccent[600] }}>
                  {totalValue.toFixed(2)}
                </span>
              </span>
            }
            subtitle="Total Blocked Stock Value"
            icon={
              <AttachMoneyIcon
                sx={{ color: colors.orangeAccent[600], fontSize: "30px" }}
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
                  {sumBy(blockedStockData.filter(item => item.team === 'MCA'), 'value').toFixed(2)}
                </span>
              </span>
            }
            subtitle="Total MCA Team Blocked Stock"
            icon={
              <AttachMoneyIcon
                sx={{ color: colors.orangeAccent[600], fontSize: "30px" }}
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
                  {sumBy(blockedStockData.filter(item => item.team === 'CAS'), 'value').toFixed(2)}
                </span>
              </span>
            }
            subtitle="Total CAS Team Blocked Stock"
            icon={
              <AttachMoneyIcon
                sx={{ color: colors.orangeAccent[600], fontSize: "30px" }}
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
                  {sumBy(blockedStockData.filter(item => item.team === 'CAS'), 'value').toFixed(2)}
                </span>
              </span>
            }
            subtitle="Total CAS Team Blocked Stock"
            icon={
              <AttachMoneyIcon
                sx={{ color: colors.orangeAccent[600], fontSize: "30px" }}
              />
            }
          />
        </Box>
        

        {!isSupplyChain && ( // Hide the notification box if user is Supply Chain
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

          

        )}

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
                Line chart per week of the year
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart data={chartData} isDashboard={true} />
          </Box>
        </Box>

        {/* ROW 3 */}

<Box
  gridColumn="span 4"
  gridRow="span 2"
  backgroundColor={colors.primary[100]}
  p="30px"
>
  <Typography variant="h5" fontWeight="600">
    Pie Chart Example
  </Typography>
  <Box height="250px" mt="20px">
    <PieChart data={mockPieData} />
  </Box>
</Box>


        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[100]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
