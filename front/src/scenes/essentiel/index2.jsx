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

// Function to format numbers with period as thousands separator
const formatNumber = (number) => {
  return new Intl.NumberFormat('de-DE').format(number);
};

const HOME = () => {
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
    // Filtrer uniquement les données de l'année 2024
    
    const filteredData = data.filter(item => {
      const date = new Date(item.createdOn);
      return date.getFullYear() === 2024;
    });
  
    // Grouper par numéro de semaine
    const groupedData = groupBy(filteredData, (item) => {
      const date = new Date(item.createdOn);
      const week = Math.ceil(((date - new Date(date.getFullYear(), 0, 1)) / 86400000 + 1) / 7);
      return week; // Retourne uniquement le numéro de la semaine
    });
  
    // Retourner les données agrégées
    return Object.keys(groupedData).map(key => {
      const values = groupedData[key];
      return {
        week: parseInt(key, 10), // Convertit la clé (numéro de la semaine) en entier
        value: sumBy(values, 'value'), // Calcule la somme des valeurs pour cette semaine
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
        <Header title="HOME" subtitle="Welcome to your dashboard" />
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
        gridTemplateColumns="repeat(12, 1fr)"
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
                  {formatNumber(totalValue)}
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
                  {formatNumber(sumBy(blockedStockData.filter(item => item.team === 'MCA'), 'value'))}
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
                  {formatNumber(sumBy(blockedStockData.filter(item => item.team === 'CAS'), 'value'))}
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
          gridColumn="span 12"
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
                Blocked stock evolution
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
          <Box height="250px" m="-20px 0 0 0">
            <LineChart data={chartData} isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HOME;
