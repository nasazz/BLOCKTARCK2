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
import {
  fetchMappings,
  createMapping,
  updateMapping,
  deleteMapping,
} from "../../Services/mrpControllerTeamMappingService"; // Import the new service
import { fetchMappingsFromPnPlant, createMappingFromPnPlant, updateMappingFromPnPlant, deleteMappingFromPnPlant } from '../../Services/PnPlantComponentMappingService';

const Configuration = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //pnPlant/component
  const [plantComponentRows, setPlantComponentRows] = useState([]);
  const [newPlant, setNewPlant] = useState("");
  const [newComponent, setNewComponent] = useState("");
  const [editPlant, setEditPlant] = useState("");
  const [editComponent, setEditComponent] = useState("");
  const [selectedPlantComponentRows, setSelectedPlantComponentRows] = useState([]);

  // State for data
  const [teamRows, setTeamRows] = useState([]);
  const [rolesRows, setRolesRows] = useState([]);
  const [plantRows, setPlantRows] = useState([]);
  const [departmentRows, setDepartmentRows] = useState([]);
  const [mappingRows, setMappingRows] = useState([]); // New state for MRP Controller/Team mappings

  const [selectedTeamRows, setSelectedTeamRows] = useState([]);
  const [selectedRolesRows, setSelectedRolesRows] = useState([]);
  const [selectedPlantRows, setSelectedPlantRows] = useState([]);
  const [selectedDepartmentRows, setSelectedDepartmentRows] = useState([]);
  const [selectedMappingRows, setSelectedMappingRows] = useState([]);

  // State for new item names
  const [newTeamName, setNewTeamName] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [newPlantName, setNewPlantName] = useState("");
  const [newDepartmentName, setNewDepartmentName] = useState("");

  // State for MRP Controller/Team inputs
  const [newMappingController, setNewMappingController] = useState("");
  const [newMappingTeam, setNewMappingTeam] = useState("");

  // State for editing
  const [editRowId, setEditRowId] = useState(null);
  const [editName, setEditName] = useState("");

  const [editMappingController, setEditMappingController] = useState("");
  const [editMappingTeam, setEditMappingTeam] = useState("");

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const teams = await fetchTeams();
      const roles = await fetchRoles();
      const plants = await fetchPlants();
      const departments = await fetchDepartments();
      const mappings = await fetchMappings(); // Fetch MRP Controller/Team mappings
      const data = await fetchMappingsFromPnPlant();

      setTeamRows(teams);
      setRolesRows(roles);
      setPlantRows(plants);
      setDepartmentRows(departments);
      setMappingRows(mappings); // Set MRP Controller/Team mappings
      setPlantComponentRows(data);
      
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

  // Handler for adding new MRP Controller/Team mapping
  const handleAddMapping = () => {
    if (!newMappingController || !newMappingTeam) {
      alert("Both fields must be filled");
      return;
    }
    createMapping({ mrpController: newMappingController, team: newMappingTeam })
      .then(() => {
        fetchData();
        setNewMappingController(""); // Clear the controller input
        setNewMappingTeam(""); // Clear the team input
      })
      .catch((error) => console.error("Failed to add mapping", error));
  };  

  // Handler for adding new PnPlant/ComponentOrFg
const handleAddPlantComponent = () => {
    if (!newPlant || !newComponent) {
        alert("Both fields must be filled");
        return;
    }

    createMappingFromPnPlant({ pnPlant: newPlant, componentORFG: newComponent })
        .then(() => {
            fetchData(); // Refresh data after adding
            setNewPlant(""); // Clear the plant input
            setNewComponent(""); // Clear the component input
        })
        .catch((error) => console.error("Failed to add mapping", error));
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

  // Specific edit handler for MRP Controller/Team mappings
  const handleSaveMappingClick = async (row) => {
    if (!editMappingController || !editMappingTeam) {
      alert("Both fields must be filled");
      return;
    }

    const updatedMapping = {
      mrpController: editMappingController,
      team: editMappingTeam,
    };

    try {
      console.log("Updating mapping with ID:", row.id);
      console.log("Updated mapping data:", updatedMapping);

      await updateMapping(row.id, updatedMapping); // Ensure the ID and data are correct

      // Re-fetch data after updating
      fetchData();

      // Clear the editing state
      setEditRowId(null);
      setEditMappingController("");
      setEditMappingTeam("");
    } catch (error) {
      console.error("Failed to update mapping:", error.response?.data || error.message);
      // Optionally show user feedback, e.g., an error message in the UI
    }
  };

  
  // Save the updated plant/component mapping
const handleSavePlantComponentClick = async (row) => {
  if (!editPlant || !editComponent) {
      alert("Both fields must be filled");
      return;
  }

  const updatedMapping = {
      pnPlant: editPlant,
      componentORFG: editComponent,
  };

  try {
      await updateMappingFromPnPlant(row.id, updatedMapping); // Update mapping by ID

      fetchData(); // Re-fetch data after updating

      // Clear editing state
      setEditRowId(null);
      setEditPlant("");
      setEditComponent("");
  } catch (error) {
      console.error("Failed to update mapping", error);
  }
};


  const handleSelectionChange = (setSelectedRows, ids) => {
    setSelectedRows(ids);
  };

  const handleEditClick = (row) => {
    setEditRowId(row.id);
    setEditName(row.name);
  };

  const renderTable = (title, rows, setSelectedRows, selectedRows, columns, addFunction, deleteFunction, updateFunction, name, setName, handleChange, handleAddFunc, handleEditFunc) => (
    <Box mb={6} p={2} maxWidth="95%" mx="auto" borderRadius={2} bgcolor={colors.primary[400]} boxShadow={`0 2px 4px rgba(0, 0, 0, 0.05)`}>

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
          sx={{ fontSize: '16px', padding: '10px 10px' }}
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
            padding: '10px 10px'
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
            width: 1000,
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
                    justifyContent: 'space-between', // Ensures content is spread across the row
                    width: '100%', // Makes the Box take full width
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
                       <Box sx={{ display: 'flex', ml: 'auto' }}> {/* Right-aligned save icon */}
                      <IconButton onClick={() => handleSaveClick(updateFunction, params.row)}>
                        <SaveIcon />
                      </IconButton>
                      </Box>
                    </>
                  ) : (
                    <>
                     <Box sx={{ display: 'flex', ml: 'auto' }}> {/* Right-aligned edit and delete icons */}
                      <IconButton onClick={() => handleEditClick(params.row)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(deleteFunction, [params.row.id])}>
                        <DeleteIcon />
                      </IconButton>
                      </Box>
                    </>
                  )}
                </Box>
              );
            },
          },
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
            fontSize: '16px',
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.orangeAccent[500],
            borderBottom: `1px solid ${colors.grey[300]}`,
            fontSize: '16px',
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
        }}
      />
    </Box>
  );

  return (
    <Box>
    {/* Render Teams */}
    {renderTable(
        "Teams",
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

      {/* Render Roles */}
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

      {/* Render Plants */}
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

      {/* Render Departments */}
      {renderTable(
          "Department",
          departmentRows,
          setSelectedDepartmentRows,
          selectedDepartmentRows,
          [{ field: "name", headerName: "Name", width: 390 }],
          addDepartment,
          deleteDepartment,
          updateDepartment,
          newDepartmentName,
          setNewDepartmentName,
          (value) => setNewDepartmentName(value),
          (name) => handleAdd(addDepartment, name, setNewDepartmentName),
          (id, name) => handleSaveClick(updateDepartment, { id, name })
        )}

      {/* MRP Controller/Team Mapping Section */}
      <Box mb={6} p={2} maxWidth="95%" mx="auto" borderRadius={2} bgcolor={colors.primary[400]} boxShadow={`0 2px 4px rgba(0, 0, 0, 0.05)`}>

        <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
          MRP Controller/Team Mapping
        </Typography>
        <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
          <TextField
            label="MRP Controller"
            variant="outlined"
            value={newMappingController}
            onChange={(e) => setNewMappingController(e.target.value)}
            sx={{ mr: 2, flex: 1 }}
          />
          <TextField
            label="Team"
            variant="outlined"
            value={newMappingTeam}
            onChange={(e) => setNewMappingTeam(e.target.value)}
            sx={{ mr: 2, flex: 1 }}
          />
          <Button
            variant="contained"
            sx={{ fontSize: '16px', padding: '10px 20px' }}
            onClick={handleAddMapping}
          >
            Add Mapping
          </Button>
        </Box>
        <DataGrid
          rows={mappingRows}
          columns={[
            { field: "mrpController", headerName: "MRP Controller", flex: 1 },
            { field: "team", headerName: "Team", flex: 1 },
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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isEditing ? (
                      <>
                        <TextField
                          variant="outlined"
                          value={editMappingController}
                          onChange={(e) => setEditMappingController(e.target.value)}
                          sx={{ mr: 1 }}
                          size="small"
                        />
                        <TextField
                          variant="outlined"
                          value={editMappingTeam}
                          onChange={(e) => setEditMappingTeam(e.target.value)}
                          sx={{ mr: 1 }}
                          size="small"
                        />
                        <IconButton onClick={() => handleSaveMappingClick(params.row)}>
                          <SaveIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => {
                          setEditRowId(params.id);
                          setEditMappingController(params.row.mrpController);
                          setEditMappingTeam(params.row.team);
                        }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(deleteMapping, [params.row.id])}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                );
              },
            },
          ]}
          
          pageSize={5}
          autoHeight
          checkboxSelection
          onSelectionModelChange={(ids) => handleSelectionChange(setSelectedMappingRows, ids)}
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
              fontSize: '16px',
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.orangeAccent[500],
              borderBottom: `1px solid ${colors.grey[300]}`,
              fontSize: '16px',
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
          }}
        />
        
      </Box>

      <Box mb={6} p={2} maxWidth="95%" mx="auto" borderRadius={2} bgcolor={colors.primary[400]} boxShadow={`0 2px 4px rgba(0, 0, 0, 0.05)`}>

            <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                PnPlant/Component Type
            </Typography>
            <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                <TextField
                    label="Pn Plant"
                    variant="outlined"
                    value={newPlant}
                    onChange={(e) => setNewPlant(e.target.value)}
                    sx={{ mr: 2, flex: 1 }}
                />
                <TextField
                    label="Component Type"
                    variant="outlined"
                    value={newComponent}
                    onChange={(e) => setNewComponent(e.target.value)}
                    sx={{ mr: 2, flex: 1 }}
                />
                <Button
                    variant="contained"
                    sx={{ fontSize: '16px', padding: '10px 20px' }}
                    onClick={handleAddPlantComponent}
                >
                    Add Plant/Component
                </Button>
            </Box>
<DataGrid
  rows={plantComponentRows}
  //getRowId={(row) => row.id} // Specify the custom id extraction
  columns={[
      { field: "pnPlant", headerName: "PN Plant", flex: 1 },
      { field: "componentOrFG", headerName: "Component Type", flex: 1 },
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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {isEditing ? (
                          <>
                              <TextField
                                  variant="outlined"
                                  value={editPlant}
                                  onChange={(e) => setEditPlant(e.target.value)}
                                  sx={{ mr: 1 }}
                                  size="small"
                              />
                              <TextField
                                  variant="outlined"
                                  value={editComponent}
                                  onChange={(e) => setEditComponent(e.target.value)}
                                  sx={{ mr: 1 }}
                                  size="small"
                              />
                              <IconButton onClick={() => handleSavePlantComponentClick(params.row)}>
                                  <SaveIcon />
                              </IconButton>
                          </>
                      ) : (
                          <>
                              <IconButton onClick={() => {
                                  setEditRowId(params.id);
                                  setEditPlant(params.row.pnPlant);
                                  setEditComponent(params.row.componentOrFG);
                              }}>
                                  <EditIcon />
                              </IconButton>
                              <IconButton onClick={() => handleDelete(deleteMappingFromPnPlant, [params.row.id])}>
                                  <DeleteIcon />
                              </IconButton>
                          </>
                      )}
                  </Box>
              );
          },
      },
  ]}
  pageSize={5}
  autoHeight
  checkboxSelection
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
          fontSize: '16px',
      },
      "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.orangeAccent[500],
          borderBottom: `1px solid ${colors.grey[300]}`,
          fontSize: '16px',
      },
      "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[400],
      },
  }}
/>
        </Box>
    </Box>
  );
};

export default Configuration;