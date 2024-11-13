import React, { useState, useEffect , useMemo} from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Header from '../../Components/Header';
import { getBlockedStockData, updateBlockedStock } from '../../Services/BlockedStockService';
import EuroIcon from '@mui/icons-material/Euro';

const functionBlockingOptions = [
  { value: 'L-Logistics', label: 'L-Logistics' },
  { value: 'No Comment', label: 'No Comment' },
  { value: 'P-Planning', label: 'P-Planning' },
  { value: 'Q-Quality', label: 'Q-Quality' }
];

const reasonOptions = [
  { value: 'Q-Quality Issue', label: 'Q - Quality Issue' },
  { value: 'S-Shelf Life exceeded', label: 'S - Shelf Life exceeded' },
  { value: 'R-Missing Release', label: 'R - Missing Release' },
  { value: 'D-Transportation damage', label: 'D - Transportation damage' },
  { value: 'N-New revision - material', label: 'N - New revision - material' },
  { value: 'No Comment', label: 'No Comment' }
];

const expectedUsageDecisionOptions = [
  { value: 'X - Scrap', label: 'X - Scrap' },
  { value: 'S - Sort', label: 'S - Sort' },
  { value: 'B - Return', label: 'B - Return' },
  { value: 'W - Rework', label: 'W - Rework' },
  { value: 'A - Pending analysis', label: 'A - Pending analysis' },
  { value: 'R - Released', label: 'R - Released' },
  { value: 'No Comment', label: 'No Comment' }
];

const scrapRequestOptions = [
  { value: 'X - Scrap', label: 'X - Scrap' },
  { value: 'S - Sort', label: 'S - Sort' },
  { value: 'B - Return', label: 'B - Return' },
  { value: 'W - Rework', label: 'W - Rework' },
  { value: 'A - Pending analysis', label: 'A - Pending analysis' }
];

// Conversion rate from your existing currency to euros (example: 1 USD = 0.85 EUR)
const conversionRateToEuro = 0.94;

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [blockedStockData, setBlockedStockData] = useState([]);
  const [filteredTotalValue, setFilteredTotalValue] = useState(0);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(() => {
    return JSON.parse(localStorage.getItem('columnVisibilityModel')) || {};
  });

 const [filterModel, setFilterModel] = useState(() => {
  const savedFilterModel = localStorage.getItem('filterModel');
  return savedFilterModel ? JSON.parse(savedFilterModel) : { items: [] };
});


useEffect(() => {
  const fetchBlockedStockData = async () => {
    try {
      const data = await getBlockedStockData();
      // Get the user's team from local storage
      const userTeam = localStorage.getItem('userTeam');
      const userPlant = localStorage.getItem('userPlant');
      const userRole  = localStorage.getItem('userRole');
      
       // Filter data based on team and plant if the user is not an admin
       const filteredData = userRole === 'admin'
       ? data
       : data.filter(item => item.team === userTeam && item.plant === userPlant);
 
     // Sort the filtered data by createdOn date
     const sortedData = filteredData.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
 
     // Update the state with the sorted data
     setBlockedStockData(sortedData);
 

    } catch (error) {
      console.error('Error fetching blocked stock data:', error);
    }
  };

  fetchBlockedStockData();

  const savedVisibility = JSON.parse(localStorage.getItem('columnVisibilityModel'));
  if (savedVisibility) {
    setColumnVisibilityModel(savedVisibility);
  }
}, []);
// Calculate total value based on filter, or use all data if no filters
const calculateFilteredTotal = (filteredRows) => {
  const total = filteredRows.reduce((sum, row) => sum + ((row.value || 0) * conversionRateToEuro), 0);
  setFilteredTotalValue(total);
};

// Memoize filtered data to update total when filters change
const filteredData = useMemo(() => {
  // Filter data based on filter model
  const hasActiveFilters = filterModel.items.some(filter => filter.value);

  const filteredRows = hasActiveFilters 
    ? blockedStockData.filter((row) => {
        return filterModel.items.every((filter) => {
          const value = row[filter.columnField];
          return value && filter.value ? value.toString().includes(filter.value.toString()) : false;
        });
      })
    : blockedStockData;  // If no filters, use all data

  // Calculate total based on whether filters are active
  calculateFilteredTotal(filteredRows);
  return filteredRows;
}, [blockedStockData, filterModel]);



  const handleFunctionBlockingChange = async (id, newValue) => {
    try {
      const updatedStock = { ...blockedStockData.find(item => item.id === id), codeFunctionBlocking: newValue };
      await updateBlockedStock(id, updatedStock);
      setBlockedStockData(prevData =>
        prevData.map(item => (item.id === id ? { ...item, codeFunctionBlocking: newValue } : item))
      );
    } catch (error) {
      console.error('Error updating Code - Function Blocking:', error);
    }
  };

  const handleReasonChange = async (id, newValue) => {
    try {
      const updatedStock = { ...blockedStockData.find(item => item.id === id), codeReason: newValue };
      await updateBlockedStock(id, updatedStock);
      setBlockedStockData(prevData =>
        prevData.map(item => (item.id === id ? { ...item, codeReason: newValue } : item))
      );
    } catch (error) {
      console.error('Error updating Code - Reason:', error);
    }
  };

  const handleExpectedUsageDecisionChange = async (id, newValue) => {
    try {
      const updatedStock = { ...blockedStockData.find(item => item.id === id), codeExpectedUsageDecision: newValue };
      await updateBlockedStock(id, updatedStock);
      setBlockedStockData(prevData =>
        prevData.map(item => (item.id === id ? { ...item, codeExpectedUsageDecision: newValue } : item))
      );
    } catch (error) {
      console.error('Error updating Code - Expected Usage Decision:', error);
    }
  };

  const handleScrapRequestChange = async (id, newValue) => {
    try {
      const updatedStock = { ...blockedStockData.find(item => item.id === id), scrapRequestNo: newValue };
      await updateBlockedStock(id, updatedStock);
      setBlockedStockData(prevData =>
        prevData.map(item => (item.id === id ? { ...item, scrapRequestNo: newValue } : item))
      );
    } catch (error) {
      console.error('Error updating Scrap Request No.:', error);
    }
  };

  const handleColumnVisibilityChange = (model) => {
    setColumnVisibilityModel(model);
    localStorage.setItem('columnVisibilityModel', JSON.stringify(model));
  };

  const handleFilterChange = (model) => {
    setFilterModel(model);
    localStorage.setItem('filterModel', JSON.stringify(model));
  };
  

  const columns = [
    { field: 'plant', headerName: 'Plant', flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
    { field: 'material', headerName: 'Material', flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
    { field: 'materialDescription', headerName: 'Material Description', flex: 1, minWidth: 250, align: 'center', headerAlign: 'center' },
    { field: 'batch', headerName: 'Batch', flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
    { field: 'blockedQIStock', headerName: 'Blocked/QI Stock', type: 'number', flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
    { field: 'baseUnitOfMeasure', headerName: 'Base Unit of Measure', flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
    { field: 'value', headerName: 'Value', type: 'number', flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
    { field: 'currency', headerName: 'Currency', flex: 1, minWidth: 100, align: 'center', headerAlign: 'center' },
    { field: 'createdOn', headerName: 'Created On', type: 'date', flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
    { field: 'lastChange', headerName: 'Last Change', type: 'date', flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
    { field: 'mrpController', headerName: 'MRP Controller', flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
    { field: 'user', headerName: 'User', flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
    { field: 'pnPlant', headerName: 'PnPlant', flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
    { field: 'team', headerName: 'Team', flex: 1, minWidth: 200, align: 'center', headerAlign: 'center' },
    { field: 'customID', headerName: 'Custom ID', flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
    { field: 'blockedSinceDays', headerName: 'Blocked Since (Days)', type: 'number', flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
    { field: 'blockedSinceMonths', headerName: 'Blocked Since (Months)', type: 'number', flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
    { field: 'blockingPeriodCluster', headerName: 'Blocking Period Cluster', flex: 1, minWidth: 200, align: 'center', headerAlign: 'center' },
    { field: 'componentOrFG', headerName: 'Component/FG', flex: 1, minWidth: 200, align: 'center', headerAlign: 'center' },
    {
      field: 'codeFunctionBlocking',
      headerName: 'Code - Function Blocking',
      flex: 1,
      minWidth: 200,
      align: 'center',
      // headerAlign: 'center',
      renderCell: (params) => (
        <FormControl fullWidth>
          <InputLabel>Unknown</InputLabel>
          <Select
            value={params.value || ''}
            onChange={(e) => handleFunctionBlockingChange(params.id, e.target.value)}
          >
            {functionBlockingOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: 'codeReason',
      headerName: 'Code - Reason',
      flex: 1,
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <FormControl fullWidth>
          <InputLabel>Unknown</InputLabel>
          <Select
            value={params.value || ''}
            onChange={(e) => handleReasonChange(params.id, e.target.value)}
          >
            {reasonOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: 'codeExpectedUsageDecision', headerName: 'Code - Expected Usage Decision', flex: 1, minWidth: 200, align: 'center', headerAlign: 'center',
      renderCell: (params) => (
        <FormControl fullWidth>
          <InputLabel>Unknown</InputLabel>
          <Select
            value={params.value || ''}
            onChange={(e) => handleExpectedUsageDecisionChange(params.id, e.target.value)}
          >
            {expectedUsageDecisionOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: 'scrapRequestNo', headerName: 'Scrap Request No.', flex: 1, minWidth: 200, align: 'center', headerAlign: 'center', 
      renderCell: (params) => (
        <FormControl fullWidth>
          <InputLabel>Unknown</InputLabel>
          <Select
            value={params.value || ''}
            onChange={(e) => handleScrapRequestChange(params.id, e.target.value)}
          >
            {scrapRequestOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    }

  ];

  return (
    <Box m={2}>
    <Header title="Blocked Stock" subtitle="Overview of blocked stock with dynamic total" />
    

 {/* Score Card for Total Value */}
<Box
  display="flex"
  flexDirection="column" // Stack items vertically
  alignItems="center"
  justifyContent="center"
  mx="left"
  sx={{
    maxWidth: "300px", // Reduce max width for a smaller card
    borderRadius: "12px",
    padding: "24px",
    backgroundColor: colors.primary[100],
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
    marginBottom: "24px",
    border: `1px solid ${colors.primary[400]}`,
    textAlign: "center",
  }}
>
   {/* Icon on top */}
   {/* <EuroIcon sx={{ color: colors.orangeAccent[600], fontSize: "32px", marginBottom: "8px" }} /> */}

{/* Title */}
<Typography variant="h5" fontWeight="bold" fontSize="18px" color={colors.orangeAccent[600]}>
  Total Blocked Stock Value:
</Typography>

{/* Value Display with Euro Sign */}
<Typography variant="h5" fontWeight="600" fontSize="20px" color={colors.grey[900]} mt={1}>
  {filteredTotalValue.toLocaleString()} € 
</Typography>
</Box>
    
  
   
      <Box 
        m="40px 0 0 0" 
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
            fontSize: '17px',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.orangeAccent[500],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.orangeAccent[500],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.grey[200]} !important`,
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${colors.orangeAccent[900]} !important`,
            fontSize: '13px',
          },
          '&::-webkit-scrollbar': {
            height: '12px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: colors.orangeAccent[500],
            borderRadius: '20px',
            border: `3px solid ${colors.primary[400]}`,
          },
        }}
      >
        {/* DataGrid */}
    <Box height={600}>
      <DataGrid
        rows={blockedStockData}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        filterModel={filterModel}
        onFilterModelChange={handleFilterChange}
        autoHeight
        getRowId={(row) => row.id}
        autoHeight={false}
        disableExtendRowFullWidth={true}
        scrollbarSize={10}
        disableSelectionOnClick
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) => {
          setColumnVisibilityModel(newModel);
          localStorage.setItem('columnVisibilityModel', JSON.stringify(newModel));
        }}
      />
    </Box>
  </Box></Box>
);
};

export default Contacts;
