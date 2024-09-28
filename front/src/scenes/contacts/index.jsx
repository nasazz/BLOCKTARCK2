import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Header from '../../Components/Header';
import { getBlockedStockData, updateBlockedStock } from '../../Services/BlockedStockService';

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

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [blockedStockData, setBlockedStockData] = useState([]);

  useEffect(() => {
    const fetchBlockedStockData = async () => {
      try {
        const data = await getBlockedStockData();
        const sortedData = data.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
        setBlockedStockData(sortedData);
      } catch (error) {
        console.error('Error fetching blocked stock data:', error);
      }
    };

    fetchBlockedStockData();
  }, []);

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
    <Box m="20px">
      <Header title="BLOCKED STOCK" subtitle="List of The Blocked Stock" />
      <Box 
        m="40px 0 0 0" 
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
            fontSize:'17px'   ,
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.orangeAccent[500],
            borderBottom: 'none',
            // marginBottom: 0,
          },
          '& .MuiDataGrid-row': {
            
            // marginTop: '2px',
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
            color: `${colors.grey[900]} !important`,
            fontSize:'13px'   ,
          },
          '&::-webkit-scrollbar': {
            height: '12px', // Increase scrollbar height
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: colors.orangeAccent[500],
            borderRadius: '20px',
            border: `3px solid ${colors.primary[400]}`, // Add padding around the thumb
          },
        }}
      >
        <DataGrid
          rows={blockedStockData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          autoHeight={false}
          disableExtendRowFullWidth={true}
          scrollbarSize={10}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
