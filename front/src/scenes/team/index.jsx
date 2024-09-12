import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import Header from '../../Components/Header';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import UpdateIcon from '@mui/icons-material/Update';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../../Services/userService';

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddClick = () => {
    navigate('/form');
  };

  const handleUpdateClick = () => {
    if (selectedRows.length === 1) {
      const userId = selectedRows[0];
      navigate(`/form/${userId}`);
    } else {
      alert('Please select exactly one user to update.');
    }
  };

  const handleDeleteClick = async () => {
    try {
      for (const id of selectedRows) {
        await deleteUser(id);
      }
      // Refresh user list after deletion
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to delete user(s):", error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'fullName',
      headerName: 'Full Name',
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'plant',
      headerName: 'Plant',
      flex: 1,
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
    },
    {
      field: 'team',
      headerName: 'Team',
      flex: 1,
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              role === 'admin'
                ? colors.orangeAccent[600]
                : role === 'manager'
                ? colors.orangeAccent[700]
                : colors.orangeAccent[700]
            }
            borderRadius="4px"
          >
            {role === 'admin' && <AdminPanelSettingsOutlinedIcon />}
            {role === 'manager' && <SecurityOutlinedIcon />}
            {role === 'user' && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
              {role}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Box display="flex" justifyContent="flex-end" gap="10px" m="20px 0">
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="secondary"
            endIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
            disabled={selectedRows.length === 0}
          >
            Delete
          </Button>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="secondary"
            endIcon={<UpdateIcon />}
            onClick={handleUpdateClick}
            disabled={selectedRows.length !== 1}
          >
            Update
          </Button>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="secondary"
            endIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add
          </Button>
        </Stack>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.orangeAccent[300],
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
            color: `${colors.orangeAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={users}
          columns={columns}
          onSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
          }}
        />
      </Box>
    </Box>
  );
};

export default Team;
