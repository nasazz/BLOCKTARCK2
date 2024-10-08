import React, { useState, useRef, useEffect } from 'react'; 
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DeleteOutline from "@mui/icons-material/DeleteOutline"; 
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Header from "../../Components/Header.jsx";
import LineChart from "../../Components/LineChart";
import StatBox from "../../Components/StatBox";
import PieChart from "../../Components/PieChart";
import { importBlockedStockData, getBlockedStockData, getMissingFieldsCount, deleteAllBlockedStockData } from '../../Services/BlockedStockService';
import { groupBy, sumBy } from 'lodash';
import {useChartData}  from '../../ChartDataContext';
import { DataGrid } from '@mui/x-data-grid';

const formatNumber = (number) => {
  return new Intl.NumberFormat('de-DE').format(number);
};


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const fileInputRef = useRef(null);
  const [blockedStockData, setBlockedStockData] = useState([]);
  const { chartData } = useChartData(); // Access chart data from context
  const [totalValue, setTotalValue] = useState(0);
  const [missingFieldsCount, setMissingFieldsCount] = useState(0);
  const [userRole, setUserRole] = useState('');
  const [pieChartData, setPieChartData] = useState([]);
  const [pieChartDataByComponent, setPieChartDataByComponent] = useState([]);
  const [pieChartDataByBlockingPeriod, setPieChartDataByBlockingPeriod] = useState([]);

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
    fetchBlockedStockData();
  }, []);


  const fetchBlockedStockData = async () => {
    try {
      const data = await getBlockedStockData();
      setBlockedStockData(data);
  
      const total = sumBy(data, 'value');
      setTotalValue(total);
      const missingCount = await getMissingFieldsCount();
      setMissingFieldsCount(missingCount);
  
      // Update pie chart data based on codeExpectedUsageDecision
      const pieDataByCode = aggregatePieData(data);
      setPieChartData(pieDataByCode);
  
      // Update pie chart data based on Component/FG
      const pieDataByComponent = aggregatePieDataByComponent(data);
      setPieChartDataByComponent(pieDataByComponent);

      // Update pie chart data based on BlockingPeriod
      const pieDataByBlockingPeriod = aggregatePieDataByBlockingPeriod(data);
      setPieChartDataByBlockingPeriod(pieDataByBlockingPeriod);
      
    } catch (error) {
      console.error("Error fetching blocked stock data:", error);
    }
  };
  


  const aggregatePieData = (data) => {
    const grouped = groupBy(data, 'codeExpectedUsageDecision');
    return Object.keys(grouped).map(key => ({
      id: key,
      label: key,
      value: sumBy(grouped[key], 'value'),
    }));
  };
  const aggregatePieDataByComponent = (data) => {
    const grouped = groupBy(data, 'componentOrFG'); // Replace with your actual field for Component/FG
    return Object.keys(grouped).map(key => ({
      id: key,
      label: key,
      value: sumBy(grouped[key], 'value'),
    }));
  };
  const aggregatePieDataByBlockingPeriod = (data) => {
    const grouped = groupBy(data, 'blockingPeriodCluster'); // Replace with your actual field for Component/FG
    return Object.keys(grouped).map(key => ({
      id: key,
      label: key,
      value: sumBy(grouped[key], 'value'),
    }));
  };
 // Prepare Data for DataGrid
 const rows = [
  ...pieChartDataByComponent.map((item, index) => ({
    id: `component-${index}`,
    category: item.label,
    value: formatNumber(item.value),
    type: "Component/FG"
  })),
  ...pieChartDataByBlockingPeriod.map((item, index) => ({
    id: `blocking-${index}`,
    category: item.label,
    value: formatNumber(item.value),
    type: "Blocking Period"
  }))
];

const columns = [
  { field: 'category', headerName: 'Category', flex: 1 },
  { field: 'value', headerName: 'Value', flex: 1 },
  { field: 'type', headerName: 'Type', flex: 1 }
];

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await importBlockedStockData(file);
        const data = await getBlockedStockData();
        setBlockedStockData(data);

        const total = sumBy(data, 'value');
        setTotalValue(total);
        const missingCount = await getMissingFieldsCount();
        setMissingFieldsCount(missingCount);

        // Update pie chart data
        const pieData = aggregatePieData(data);
        setPieChartData(pieData);
          // Update pie chart data based on Component/FG
          const pieDataByComponent = aggregatePieDataByComponent(data);
          setPieChartDataByComponent(pieDataByComponent);
          // Update pie chart data
          const pieDataByBlockingPeriod = aggregatePieDataByBlockingPeriod(data);
          setPieChartData(pieDataByBlockingPeriod);

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
      setTotalValue(0);
      setMissingFieldsCount(0);
      setPieChartData([]);
      
      
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
       {/*  <Box display="flex" gap="10px">
          {!isQuality && (
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
        </Box> */}
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


        <Box gridColumn="span 3" backgroundColor={colors.primary[100]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title={<span style={{ color: colors.orangeAccent[600] }}>{sumBy(blockedStockData.filter(item => item.team === 'CAS'), 'value').toFixed(2)}</span>}
            subtitle="Total CAS Team Blocked Stock"
            icon={<AttachMoneyIcon sx={{ color: colors.orangeAccent[600], fontSize: "30px" }} />}
          />
        </Box>

        {!isSupplyChain && (
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
        <Box gridColumn="span 15" gridRow="span 2" backgroundColor={colors.primary[100]}>
          <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="600" color={colors.orangeAccent[400]}>
              Line chart per week of the year
            </Typography>
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
              <Typography variant="h5" fontWeight="300" sx={{ marginTop: '20px' }}>No data available</Typography> // Fallback UI with margin
            )}
          </Box>
        </Box>




  {/* /* {/* ROW 3 */}
     <Box gridColumn="span 8" gridRow="span 2" backgroundColor={colors.primary[100]}>
          <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="600" color={colors.orangeAccent[400]}>
            Blocked Stock Value per product type
          </Typography>
          </Box>
          <Box height="250px" marginTop="40px">
            <PieChart data={pieChartData} />
          </Box>
        </Box> 
        <Box gridColumn="span 7" gridRow="span 2" backgroundColor={colors.primary[100]}>
          <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="600" color={colors.orangeAccent[400]}>
            Blocked Stock Value per product type
          </Typography>
          </Box>
          <Box height="250px" marginTop="40px">
            <PieChart data={pieChartDataByComponent} />
          </Box>
        </Box> 
        <Box gridColumn="span 15" gridRow="span 2" backgroundColor={colors.primary[100]}>
          <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="600" color={colors.orangeAccent[400]}>
            Blocked Stock Value per product type
          </Typography>
          </Box>
          <Box height="250px" marginTop="40px">
            <PieChart data={pieChartDataByBlockingPeriod} />
          </Box>
        </Box> 
      </Box>
      <Box m="20px">
      <Box gridColumn="span 15" gridRow="span 4" backgroundColor={colors.primary[100]}>
      <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="600" color={colors.orangeAccent[400]}>
          Blocked Stock Matrix by Component and Blocking Period
        </Typography>
      </Box>

      <Box mt="20px" p="20px">
        <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: `1px solid ${colors.grey[300]}`, padding: '10px' }}>Component/FG</th>
              {pieChartDataByBlockingPeriod.map((item) => (
                <th key={item.id} style={{ border: `1px solid ${colors.grey[300]}`, padding: '10px' }}>{item.label}</th>
              ))}
              <th style={{ border: `1px solid ${colors.grey[300]}`, padding: '10px' }}>Grand Total</th>
            </tr>
          </thead>
          <tbody>
            {pieChartDataByComponent.map((component) => {
              const rowTotal = pieChartDataByBlockingPeriod.reduce((sum, period) => {
                const filteredData = blockedStockData.filter(
                  (item) => item.componentOrFG === component.label && item.blockingPeriodCluster === period.label
                );
                return sum + sumBy(filteredData, 'value');
              }, 0);

              return (
                <React.Fragment key={component.id}>
                  <tr>
                    <td style={{ border: `1px solid ${colors.grey[300]}`, padding: '10px', textAlign: 'left' }}>
                      <button onClick={() => toggleRowExpansion(component.label)}>
                        {expandedRows[component.label] ? '-' : '+'}
                      </button>
                      {component.label}
                    </td>
                    {pieChartDataByBlockingPeriod.map((period) => {
                      const filteredData = blockedStockData.filter(
                        (item) => item.componentOrFG === component.label && item.blockingPeriodCluster === period.label
                      );
                      const cellValue = sumBy(filteredData, 'value');

                      return (
                        <td key={period.id} style={{ border: `1px solid ${colors.grey[300]}`, padding: '10px' }}>
                          {cellValue.toFixed(2)}
                        </td>
                      );
                    })}
                    <td style={{ border: `1px solid ${colors.grey[300]}`, padding: '10px' }}>
                      {rowTotal.toFixed(2)}
                    </td>
                  </tr>

                  {/* Team Data Row */}
                  {expandedRows[component.label] &&
                    Array.from(new Set(blockedStockData
                      .filter((item) => item.componentOrFG === component.label)
                      .map((item) => item.team)
                    )).map((team, index) => {
                      const teamTotal = pieChartDataByBlockingPeriod.reduce((sum, period) => {
                        const filteredTeamData = blockedStockData.filter(
                          (item) =>
                            item.componentOrFG === component.label &&
                            item.team === team &&
                            item.blockingPeriodCluster === period.label
                        );
                        return sum + sumBy(filteredTeamData, 'value');
                      }, 0);

                      return (
                        <tr key={index}>
                          <td style={{ border: `1px solid ${colors.grey[300]}`, padding: '10px', textAlign: 'left', paddingLeft: '30px' }}>
                            {team}
                          </td>
                          {pieChartDataByBlockingPeriod.map((period) => {
                            const filteredTeamData = blockedStockData.filter(
                              (item) =>
                                item.componentOrFG === component.label &&
                                item.team === team &&
                                item.blockingPeriodCluster === period.label
                            );
                            const teamCellValue = sumBy(filteredTeamData, 'value');

                            return (
                              <td key={period.id} style={{ border: `1px solid ${colors.grey[300]}`, padding: '10px' }}>
                                {teamCellValue.toFixed(2)}
                              </td>
                            );
                          })}
                          <td style={{ border: `1px solid ${colors.grey[300]}`, padding: '10px' }}>
                            {teamTotal.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Box>
    
    </Box>
    </Box>
    
  );
};

export default Dashboard;