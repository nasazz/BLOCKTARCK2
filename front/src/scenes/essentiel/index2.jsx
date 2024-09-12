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

const HOME = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const fileInputRef = useRef(null);
  const [blockedStockData, setBlockedStockData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [teamTransactions, setTeamTransactions] = useState([]);
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

        const aggregatedData = aggregateDataByMonth(data);
        const sortedData = aggregatedData.sort((a, b) => a.month - b.month);
        const transformedData = [
          {
            id: "blocked_stock",
            data: sortedData.map(item => ({
              x: item.month,
              y: item.value,
            })),
          },
        ];
        setChartData(transformedData);

        const teamData = groupBy(data, 'team');
        const teamTransactions = Object.keys(teamData).map((team) => ({
          txId: "Team",
          user: team,
          date: new Date().toLocaleDateString(),
          cost: sumBy(teamData[team], 'value'),
        }));
        setTeamTransactions(teamTransactions);

        const missingCount = await getMissingFieldsCount();
        setMissingFieldsCount(missingCount);
      } catch (error) {
        console.error("Error fetching blocked stock data:", error);
      }
    };

    fetchBlockedStockData();
  }, []);

  const aggregateDataByMonth = (data) => {
    const groupedData = groupBy(data, (item) => {
      const date = new Date(item.createdOn);
      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    });

    return Object.keys(groupedData).map(key => {
      const values = groupedData[key];
      return {
        month: new Date(`${key}-01`),
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

        const aggregatedData = aggregateDataByMonth(data);
        const sortedData = aggregatedData.sort((a, b) => a.month - b.month);
        const transformedData = [
          {
            id: "blocked_stock",
            data: sortedData.map(item => ({
              x: item.month,
              y: item.value,
            })),
          },
        ];
        setChartData(transformedData);

        const teamData = groupBy(data, 'team');
        const teamTransactions = Object.keys(teamData).map((team) => ({
          txId: "Team",
          user: team,
          date: new Date().toLocaleDateString(),
          cost: sumBy(teamData[team], 'value'),
        }));
        setTeamTransactions(teamTransactions);

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
      setTeamTransactions([]);
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
        <Header title="HOME" subtitle="Welcome to your dashboard"  />
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
        {!isSupplyChain && ( // Hide the notification box if user is Supply Chain
          <Box
            gridColumn="span 6"
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
          gridColumn="span 8"
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
                Total Blocked Stock Value
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.orangeAccent[500]}
              >
                ${totalValue.toFixed(2)}
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

        {/* Transaction Graph */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[100]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.orangeAccent[500]}`}
            colors={colors.grey[500]}
            p="15px"
          >
            <Typography color={colors.orangeAccent[500]} variant="h5" fontWeight="600">
              Blocked Stock per team
            </Typography>
          </Box>
          {teamTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[800]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.orangeAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.user}
                </Typography>
                <Typography color={colors.grey[500]}>
                  {transaction.txId}
                </Typography>
              </Box>
              <Box color={colors.grey[500]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.orangeAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost.toFixed(2)}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default HOME;
