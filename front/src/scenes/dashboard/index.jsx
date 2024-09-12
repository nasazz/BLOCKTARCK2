import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../Components/Header.jsx";
import LineChart from "../../Components/LineChart";
import BarChart from "../../Components/BarChart";
import StatBox from "../../Components/StatBox";
import ProgressCircle from "../../Components/ProgressCircle";
import { importBlockedStockData, getBlockedStockData } from '../../Services/BlockedStockService';
import { groupBy, sumBy } from 'lodash';



const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const fileInputRef = useRef(null);
  const [blockedStockData, setBlockedStockData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalValue, setTotalValue] = useState(0); // State for total blocked stock value

  useEffect(() => {
    const fetchBlockedStockData = async () => {
      try {
        const data = await getBlockedStockData();
        setBlockedStockData(data);

        // Calculate the total blocked stock value
        const total = sumBy(data, 'value');
        setTotalValue(total);

        // Transform data to aggregate by month and ensure it's sorted
        const aggregatedData = aggregateDataByMonth(data);
        const sortedData = aggregatedData.sort((a, b) => a.month - b.month); // Sort by date
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
        const response = await importBlockedStockData(file);
        console.log("Import response:", response);
        // Fetch the updated blocked stock data after import
        const data = await getBlockedStockData();
        setBlockedStockData(data);

        // Calculate the total blocked stock value
        const total = sumBy(data, 'value');
        setTotalValue(total);

        // Transform data to aggregate by month and ensure it's sorted
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
      } catch (error) {
        console.error("Error importing file:", error);
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box>
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
            Import Reports
          </Button>
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
            <span>
              <span style={{ color: colors.orangeAccent[600] }}> 12,361</span> 
            </span>
          }
            subtitle="Emails Sent"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.orangeAccent[600], fontSize: "26px" }}
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
            <span>
              <span style={{ color: colors.orangeAccent[600] }}> 431,225</span> 
            </span>
          }
            subtitle="Sales Obtained"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.orangeAccent[600], fontSize: "26px" }}
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
              <span>
                <span style={{ color: colors.orangeAccent[600] }}> 32,441</span> 
              </span>
            }
            subtitle="New Clients"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.orangeAccent[600], fontSize: "26px" }}
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
              <span>
                <span style={{ color: colors.orangeAccent[600] }}> 1,325,134</span> 
              </span>
            }
            subtitle="Traffic Received"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.orangeAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

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
                ${totalValue.toFixed(2)} {/* Display the total value */}
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
              Recent Transactions
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.grey[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.orangeAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.primary[900]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[900]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.orangeAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>
        


        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[100]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.orangeAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
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
        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;
