// import React, { useState, useEffect } from "react";
// import { Box, Button, Typography, TextField, useTheme, IconButton } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { tokens } from "../../theme";
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
// import {
//   fetchTeams,
//   addTeam,
//   updateTeam,
//   deleteTeam,
//   fetchRoles,
//   addRole,
//   updateRole,
//   deleteRole,
//   fetchPlants,
//   addPlant,
//   updatePlant,
//   deletePlant,
//   fetchDepartments,
//   addDepartment,
//   updateDepartment,
//   deleteDepartment,
// } from "../../Services/configurationService";

// const Configuration = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   // State for data
//   const [teamRows, setTeamRows] = useState([]);
//   const [rolesRows, setRolesRows] = useState([]);
//   const [plantRows, setPlantRows] = useState([]);
//   const [departmentRows, setDepartmentRows] = useState([]);

//   // State for selected rows
//   const [selectedTeamRows, setSelectedTeamRows] = useState([]);
//   const [selectedRolesRows, setSelectedRolesRows] = useState([]);
//   const [selectedPlantRows, setSelectedPlantRows] = useState([]);
//   const [selectedDepartmentRows, setSelectedDepartmentRows] = useState([]);

//   // State for new item names
//   const [newTeamName, setNewTeamName] = useState("");
//   const [newRoleName, setNewRoleName] = useState("");
//   const [newPlantName, setNewPlantName] = useState("");
//   const [newDepartmentName, setNewDepartmentName] = useState("");

//   // State for editing
//   const [editRowId, setEditRowId] = useState(null);
//   const [editName, setEditName] = useState("");

//   // Fetch data from the API
//   const fetchData = async () => {
//     try {
//       const teams = await fetchTeams();
//       const roles = await fetchRoles();
//       const plants = await fetchPlants();
//       const departments = await fetchDepartments();
//       setTeamRows(teams);
//       setRolesRows(roles);
//       setPlantRows(plants);
//       setDepartmentRows(departments);
//     } catch (error) {
//       console.error("Failed to fetch data", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // General add handler for Teams, Plants, and Departments
//   const handleAdd = (addFunction, name, setName) => {
//     if (!name) {
//       alert("Name cannot be empty");
//       return;
//     }
//     addFunction({ name })
//       .then(() => {
//         fetchData();
//         setName(""); // Clear the input field after adding
//       })
//       .catch((error) => console.error("Failed to add data", error));
//   };

//   // Specific add handler for Roles
//   const handleAddRole = (roleName) => {
//     if (!roleName) {
//       alert("Role name cannot be empty");
//       return;
//     }
//     addRole(roleName)
//       .then(() => {
//         fetchData();
//         setNewRoleName(""); // Clear the role input field
//       })
//       .catch((error) => console.error("Failed to add role", error));
//   };

//   // General delete handler
//   const handleDelete = (deleteFunction, selectedRows) => {
//     Promise.all(selectedRows.map((id) => deleteFunction(id)))
//       .then(() => fetchData())
//       .catch((error) => console.error("Failed to delete data", error));
//   };

//   // General edit handler for Teams, Plants, and Departments
//   const handleSaveClick = (updateFunction, row) => {
//     updateFunction(row.id, { name: editName })
//       .then(() => {
//         fetchData();
//         setEditRowId(null);
//         setEditName("");
//       })
//       .catch((error) => console.error("Failed to update data", error));
//   };

//   // Specific edit handler for Roles
//   const handleEditRole = (id, newRoleName) => {
//     if (!newRoleName) {
//       alert("Role name cannot be empty");
//       return;
//     }
//     updateRole(id, newRoleName)
//       .then(() => {
//         fetchData();
//         setEditRowId(null);
//         setEditName("");
//       })
//       .catch((error) => console.error("Failed to update role", error));
//   };

//   const handleSelectionChange = (setSelectedRows, ids) => {
//     setSelectedRows(ids);
//   };

//   const handleEditClick = (row) => {
//     setEditRowId(row.id);
//     setEditName(row.name);
//   };

//   const renderTable = (title, rows, setSelectedRows, selectedRows, columns, addFunction, deleteFunction, updateFunction, name, setName, handleChange, handleAddFunc, handleEditFunc) => (
//     <Box mb={4}>
//       <Typography variant="h5" sx={{ mb: 2 }}>
//         {title}
//       </Typography>
//       <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
//         <TextField
//           label={`New ${title} Name`}
//           variant="outlined"
//           value={name}
//           onChange={(e) => handleChange(e.target.value)}
//           sx={{ mr: 2 }}
//         />
//         <Button
//           variant="contained"
//           onClick={() => handleAddFunc(name)}
//         >
//           Add {title}
//         </Button>
//         <Button
//           variant="contained"
//           startIcon={<DeleteIcon />}
//           sx={{
//             ml: 2,
//             backgroundColor: selectedRows.length > 0 ? colors.orangeAccent[600] : colors.grey[500],
//             "&:hover": {
//               backgroundColor: selectedRows.length > 0 ? colors.orangeAccent[700] : colors.grey[600],
//             },
//           }}
//           onClick={() => handleDelete(deleteFunction, selectedRows)}
//           disabled={selectedRows.length === 0}
//         >
//           Delete {title}
//         </Button>
//       </Box>
//       <DataGrid
//         rows={rows}
//         columns={[
//           ...columns,
//           {
//             field: "action",
//             headerName: "",
//             width: 150,
//             sortable: false,
//             filterable: false,
//             disableColumnMenu: true,
//             renderCell: (params) => {
//               const isEditing = params.id === editRowId;
//               return (
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                   }}
//                 >
//                   {isEditing ? (
//                     <>
//                       <TextField
//                         variant="outlined"
//                         value={editName}
//                         onChange={(e) => setEditName(e.target.value)}
//                         sx={{ mr: 1 }}
//                         size="small"
//                       />
//                       <IconButton onClick={() => handleEditFunc(params.row.id, editName)}>
//                         <SaveIcon />
//                       </IconButton>
//                     </>
//                   ) : (
//                     <IconButton onClick={() => handleEditClick(params.row)}>
//                       <EditIcon />
//                     </IconButton>
//                   )}
//                 </Box>
//               );
//             },
//           },
//         ]}
//         pageSize={5}
//         autoHeight
//         checkboxSelection
//         onSelectionModelChange={(ids) => handleSelectionChange(setSelectedRows, ids)}
//         sx={{
//           width: 600,
//           borderRadius: 4,
//           overflow: 'hidden',
//           boxShadow: `0 4px 6px rgba(0, 0, 0, 0.1)`,
//           "& .MuiDataGrid-root": {
//             border: "none",
//           },
//           "& .MuiDataGrid-cell": {
//             borderBottom: `1px solid ${colors.grey[300]}`,
//           },
//           "& .MuiDataGrid-columnHeaders": {
//             backgroundColor: colors.orangeAccent[500],
//             borderBottom: `1px solid ${colors.grey[300]}`,
//           },
//           "& .MuiDataGrid-virtualScroller": {
//             backgroundColor: colors.primary[400],
//           },
//         }}
//       />
//     </Box>
//   );

//   return (
//     <Box m={4}>
//       {renderTable(
//         "Team",
//         teamRows,
//         setSelectedTeamRows,
//         selectedTeamRows,
//         [{ field: "name", headerName: "Name", width: 398 }],
//         addTeam,
//         deleteTeam,
//         updateTeam,
//         newTeamName,
//         setNewTeamName,
//         (value) => setNewTeamName(value),
//         (name) => handleAdd(addTeam, name, setNewTeamName),
//         (id, name) => handleSaveClick(updateTeam, { id, name })
//       )}
//       {renderTable(
//         "Roles",
//         rolesRows,
//         setSelectedRolesRows,
//         selectedRolesRows,
//         [{ field: "name", headerName: "Name", width: 398 }],
//         addRole,
//         deleteRole,
//         updateRole,
//         newRoleName,
//         setNewRoleName,
//         (value) => setNewRoleName(value),
//         handleAddRole,
//         handleEditRole
//       )}
//       {renderTable(
//         "Plant",
//         plantRows,
//         setSelectedPlantRows,
//         selectedPlantRows,
//         [{ field: "name", headerName: "Name", width: 398 }],
//         addPlant,
//         deletePlant,
//         updatePlant,
//         newPlantName,
//         setNewPlantName,
//         (value) => setNewPlantName(value),
//         (name) => handleAdd(addPlant, name, setNewPlantName),
//         (id, name) => handleSaveClick(updatePlant, { id, name })
//       )}
//       {renderTable(
//         "Department",
//         departmentRows,
//         setSelectedDepartmentRows,
//         selectedDepartmentRows,
//         [{ field: "name", headerName: "Name", width: 398 }],
//         addDepartment,
//         deleteDepartment,
//         updateDepartment,
//         newDepartmentName,
//         setNewDepartmentName,
//         (value) => setNewDepartmentName(value),
//         (name) => handleAdd(addDepartment, name, setNewDepartmentName),
//         (id, name) => handleSaveClick(updateDepartment, { id, name })
//       )}
//     </Box>
//   );
// };

// export default Configuration;


import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField, useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
  fetchTeams,
  addTeam,
  updateTeam,
  deleteTeam,
  fetchRoles,
  addRole,
  updateRole,
  deleteRole,
  fetchPlants,
  addPlant,
  updatePlant,
  deletePlant,
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../Services/configurationService";

const Configuration = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for data
  const [teamRows, setTeamRows] = useState([]);
  const [rolesRows, setRolesRows] = useState([]);
  const [plantRows, setPlantRows] = useState([]);
  const [departmentRows, setDepartmentRows] = useState([]);

  // State for selected rows
  const [selectedTeamRows, setSelectedTeamRows] = useState([]);
  const [selectedRolesRows, setSelectedRolesRows] = useState([]);
  const [selectedPlantRows, setSelectedPlantRows] = useState([]);
  const [selectedDepartmentRows, setSelectedDepartmentRows] = useState([]);

  // State for new item names
  const [newTeamName, setNewTeamName] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [newPlantName, setNewPlantName] = useState("");
  const [newDepartmentName, setNewDepartmentName] = useState("");

  // State for editing
  const [editRowId, setEditRowId] = useState(null);
  const [editName, setEditName] = useState("");

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const teams = await fetchTeams();
      const roles = await fetchRoles();
      const plants = await fetchPlants();
      const departments = await fetchDepartments();
      setTeamRows(teams);
      setRolesRows(roles);
      setPlantRows(plants);
      setDepartmentRows(departments);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // General add handler for Teams, Plants, and Departments
  const handleAdd = (addFunction, name, setName) => {
    if (!name) {
      alert("Name cannot be empty");
      return;
    }
    addFunction({ name })
      .then(() => {
        fetchData();
        setName(""); // Clear the input field after adding
      })
      .catch((error) => console.error("Failed to add data", error));
  };

  // Specific add handler for Roles
  const handleAddRole = (roleName) => {
    if (!roleName) {
      alert("Role name cannot be empty");
      return;
    }
    addRole(roleName)
      .then(() => {
        fetchData();
        setNewRoleName(""); // Clear the role input field
      })
      .catch((error) => console.error("Failed to add role", error));
  };

  // General delete handler
  const handleDelete = (deleteFunction, selectedRows) => {
    Promise.all(selectedRows.map((id) => deleteFunction(id)))
      .then(() => fetchData())
      .catch((error) => console.error("Failed to delete data", error));
  };

  // General edit handler for Teams, Plants, and Departments
  const handleSaveClick = (updateFunction, row) => {
    updateFunction(row.id, { name: editName })
      .then(() => {
        fetchData();
        setEditRowId(null);
        setEditName("");
      })
      .catch((error) => console.error("Failed to update data", error));
  };

  // Specific edit handler for Roles
  const handleEditRole = (id, newRoleName) => {
    if (!newRoleName) {
      alert("Role name cannot be empty");
      return;
    }
    updateRole(id, newRoleName)
      .then(() => {
        fetchData();
        setEditRowId(null);
        setEditName("");
      })
      .catch((error) => console.error("Failed to update role", error));
  };

  const handleSelectionChange = (setSelectedRows, ids) => {
    setSelectedRows(ids);
  };

  const handleEditClick = (row) => {
    setEditRowId(row.id);
    setEditName(row.name);
  };

  const renderTable = (title, rows, setSelectedRows, selectedRows, columns, addFunction, deleteFunction, updateFunction, name, setName, handleChange, handleAddFunc, handleEditFunc) => (
    <Box mb={4} p={2} borderRadius={2} bgcolor={colors.primary[400]} boxShadow={`0 4px 6px rgba(0, 0, 0, 0.1)`}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>
      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
        <TextField
          label={`New ${title} Name`}
          variant="outlined"
          value={name}
          onChange={(e) => handleChange(e.target.value)}
          sx={{ mr: 2, flex: 1 }}
        />
        <Button
          variant="contained"
          sx={{ fontSize: '16px', padding: '10px 20px' }}
          onClick={() => handleAddFunc(name)}
        >
          Add {title}
        </Button>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          sx={{
            ml: 2,
            backgroundColor: selectedRows.length > 0 ? colors.orangeAccent[600] : colors.grey[500],
            "&:hover": {
              backgroundColor: selectedRows.length > 0 ? colors.orangeAccent[700] : colors.grey[600],
            },
            fontSize: '16px',
            padding: '10px 20px'
          }}
          onClick={() => handleDelete(deleteFunction, selectedRows)}
          disabled={selectedRows.length === 0}
        >
          Delete {title}
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={[...columns,
          {
            field: "action",
            headerName: "",
            width: 150,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
              const isEditing = params.id === editRowId;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {isEditing ? (
                    <>
                      <TextField
                        variant="outlined"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        sx={{ mr: 1 }}
                        size="small"
                      />
                      <IconButton onClick={() => handleEditFunc(params.row.id, editName)}>
                        <SaveIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton onClick={() => handleEditClick(params.row)}>
                      <EditIcon />
                    </IconButton>
                  )}
                </Box>
              );
            },
          }
        ]}
        pageSize={5}
        autoHeight
        checkboxSelection
        onSelectionModelChange={(ids) => handleSelectionChange(setSelectedRows, ids)}
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
            fontSize: '16px', // Increased font size
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.orangeAccent[500],
            borderBottom: `1px solid ${colors.grey[300]}`,
            fontSize: '16px', // Increased font size
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
        }}
      />
    </Box>
  );

  return (
    <Box m={4}>
      {renderTable(
        "Team",
        teamRows,
        setSelectedTeamRows,
        selectedTeamRows,
        [{ field: "name", headerName: "Name", width: 398 }],
        addTeam,
        deleteTeam,
        updateTeam,
        newTeamName,
        setNewTeamName,
        (value) => setNewTeamName(value),
        (name) => handleAdd(addTeam, name, setNewTeamName),
        (id, name) => handleSaveClick(updateTeam, { id, name })
      )}
      {renderTable(
        "Roles",
        rolesRows,
        setSelectedRolesRows,
        selectedRolesRows,
        [{ field: "name", headerName: "Name", width: 398 }],
        addRole,
        deleteRole,
        updateRole,
        newRoleName,
        setNewRoleName,
        (value) => setNewRoleName(value),
        handleAddRole,
        handleEditRole
      )}
      {renderTable(
        "Plant",
        plantRows,
        setSelectedPlantRows,
        selectedPlantRows,
        [{ field: "name", headerName: "Name", width: 398 }],
        addPlant,
        deletePlant,
        updatePlant,
        newPlantName,
        setNewPlantName,
        (value) => setNewPlantName(value),
        (name) => handleAdd(addPlant, name, setNewPlantName),
        (id, name) => handleSaveClick(updatePlant, { id, name })
      )}
      {renderTable(
        "Department",
        departmentRows,
        setSelectedDepartmentRows,
        selectedDepartmentRows,
        [{ field: "name", headerName: "Name", width: 398 }],
        addDepartment,
        deleteDepartment,
        updateDepartment,
        newDepartmentName,
        setNewDepartmentName,
        (value) => setNewDepartmentName(value),
        (name) => handleAdd(addDepartment, name, setNewDepartmentName),
        (id, name) => handleSaveClick(updateDepartment, { id, name })
      )}
    </Box>
  );
};

export default Configuration;
