import React, { useState, useRef, useEffect } from 'react'; 
import { Box, Button, Typography, useTheme, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import DeleteOutline from "@mui/icons-material/DeleteOutline"; 
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Header from "../../Components/Header.jsx";
import LineChart from "../../Components/LineChart";
import StatBox from "../../Components/StatBox";
import PieChart from "../../Components/PieChart";
import BarChart from "../../Components/BarChart";
import EuroIcon from '@mui/icons-material/Euro';
import { importBlockedStockData, getBlockedStockData, getMissingFieldsCountByPlantAndTeam, deleteAllBlockedStockData } from '../../Services/BlockedStockService';
import { groupBy, sumBy } from 'lodash';
import {useChartData}  from '../../ChartDataContext';
import AddIcon from '@mui/icons-material/Add';



const formatNumber = (number) => {
  return new Intl.NumberFormat('de-DE').format(number);
};
// Conversion rate from your existing currency to euros (example: 1 USD = 0.85 EUR)
const conversionRateToEuro = 0.92;

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
    fetchBlockedStockData();
  }, []);


  const fetchBlockedStockData = async () => {
    try {
      const data = await getBlockedStockData();
      setBlockedStockData(data);
      // Get the user's team from local storage
      const userTeam = localStorage.getItem('userTeam');
      const userPlant = localStorage.getItem('userPlant');


      // Filter data based on user team
      const filteredData = data.filter(item => 
        item.team === userTeam && item.plant === userPlant
      );
      const total = sumBy(data, 'value');
      const totalInEuro = total * conversionRateToEuro; // Convert to euros
      setTotalValue(totalInEuro); // Update the state with the euro value

      const missingCount = await getMissingFieldsCountByPlantAndTeam();
      setMissingFieldsCount(missingCount);

      // Update pie chart data based on codeExpectedUsageDecision
      const pieDataByCode = aggregatePieData(filteredData);
      setPieChartData(pieDataByCode);

      // Update pie chart data based on Component/FG
      const pieDataByComponent = aggregatePieDataByComponent(filteredData);
      setPieChartDataByComponent(pieDataByComponent);

      // Update pie chart data based on BlockingPeriod
      const pieDataByBlockingPeriod = aggregatePieDataByBlockingPeriod(filteredData);
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



 /*  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await importBlockedStockData(file);
        const data = await getBlockedStockData();
        setBlockedStockData(data);

        const total = sumBy(data, 'value');
        setTotalValue(total);
        const missingCount = await getMissingFieldsCountByPlantAndTeam();
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
  }; */

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
              title={<span style={{ color: colors.orangeAccent[600] }}>{formatNumber(sumBy(blockedStockData.filter(item => item.team === team), 'value'))}</span>}
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
                    <Typography variant="h6" fontWeight="600" color={colors.orangeAccent[600]}>
                      Plant {plant}
                    </Typography>
                    <StatBox
                      title={
                        <div style={{ textAlign: 'center' }}> {/* Centering the content */}
                          <span style={{ color: colors.orangeAccent[600] }}>
                            {plantValue}
                            <br /> {/* Line break added here */}
                            <span style={{ fontSize: "14px", color: colors.grey[600] }}>
                              ({plantMissingFieldsCount} missing fields)
                            </span>
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
  
      {/* Blocked Stock Value Evolution Chart */}
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
  <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
    <Typography variant="h5" fontWeight="600"  fontSize="19px" color={colors.orangeAccent[400]}>
      Blocked Stock Value Evolution
    </Typography>
  </Box>
  <Box height="250px" display="flex" justifyContent="center" alignItems="center" m="-20px 0 0 0">
    {chartData.length > 0 ? (
      <LineChart data={chartData} isDashboard={true} />
    ) : (
      <Typography variant="h5" fontWeight="300" sx={{ marginTop: '20px' }}>No data available</Typography>
    )}
  </Box>
</Box>
</Box>

{/* Blocked Stock Value per Quality Decision Chart */}
<Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
<Box
  gridColumn="span 6"
  gridRow="span 2"
  backgroundColor={colors.primary[100]}
  mb="20px"
  sx={{
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
    "&:hover": { transform: "scale(1.02)" },
  }}
>  
<Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
<Typography variant="h5" fontWeight="600" color={colors.orangeAccent[400]}>
Blocked Stock Value per Quality Decision
</Typography>
  </Box>
  <Box display="flex" justifyContent="center" alignItems="center" height="250px" marginTop="30px">
    <Box width="90%" height="110%">
      <BarChart data={pieChartData} />
    </Box>
  </Box>
</Box>

{/* Blocked Stock Value per Time Processing Chart */}
<Box
  gridColumn="span 6"
  gridRow="span 2"
  backgroundColor={colors.primary[100]}
  mb="20px"
  sx={{
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
    "&:hover": { transform: "scale(1.02)" },
  }}
>
  <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
    <Typography variant="h5" fontWeight="600" color={colors.orangeAccent[400]}>
      Blocked Stock Value per Time Processing
    </Typography>
  </Box>
  <Box display="flex" justifyContent="center" alignItems="center" height="250px" marginTop="40px">
    <Box width="85%" height="110%">
      <BarChart data={pieChartDataByBlockingPeriod} />
    </Box>
  </Box>
</Box>
</Box>

{/* Blocked Stock Value per Product Type Chart */}
<Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
<Box
  gridColumn="span 15"
  gridRow="span 2"
  backgroundColor={colors.primary[100]}
  mb="20px"
  sx={{
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
    "&:hover": { transform: "scale(1.02)" },
  }}
>
  <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
    <Typography variant="h5" fontWeight="600" color={colors.orangeAccent[400]}>
      Blocked Stock Value per Product Type
    </Typography>
  </Box>
  <Box height="250px" marginTop="40px">
    <PieChart data={pieChartDataByComponent} />
  </Box>
</Box>

{/* Blocked Stock Matrix */}
<Box
  gridColumn="span 15"
  gridRow="span 3"
  backgroundColor={colors.primary[100]}
  overflow="auto"
  sx={{
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
    "&:hover": { transform: "scale(1.02)" },
  }}
>
  <Box mt="30px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
    <Typography variant="h5" fontWeight="600" color={colors.orangeAccent[400]}>
      Blocked Stock Matrix
    </Typography>
  </Box>

      
      
      

      <Box mt="5px" p="20px">
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