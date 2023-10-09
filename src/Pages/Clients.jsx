import { useContext } from "react";
import AuthContext from "../Contexts/AuthContext";
import { actions } from "../Permissions/Constants";
import { useState } from "react";
import { hasPermission } from "../Permissions/Permissions";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import Header from "../Components/Header/Header";
import { Box, Button, useTheme } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { tokens } from "../styles/Themes";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

const Clients = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { jwtToken, roles } = useContext(AuthContext);
  const permissions = hasPermission(roles, actions.SEE_ALL_PRODUCTS);
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  const deleteClient = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/clients/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (response.ok) {
        return response;
      } else {
        throw new Error("Erro ao deletar o cliente");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
      return null;
    }
  };

  const updateClients = async (newData) => {
    try {
      const response = await fetch(
        `http://localhost:8080/clients/update/${newData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        }
      );

      if (response.ok) {
        return response;
      } else {
        throw new Error("Erro ao atualizar o cliente");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
      return null;
    }
  };

  useEffect(() => {
    const getAllOrders = async () => {
      await fetch("http://localhost:8080/clients/getall", {
        method: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
      }).then(async (res) => {
        if (res.ok) {
          const response = await res.json();
          setRows(response);
          return;
        }
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Erro ao buscar todos os clientes",
        });
      });
    };
    getAllOrders();
  }, []);

  function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = 26;
      setRows((oldRows) => [
        ...oldRows,
        { id, createdAt: "", email: "", name: "", cpf: "", isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }

  const handleEditClick = (id) => () => {
    if (id === 1) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Esse cliente não pode ser alterado!",
      });
      return;
    }
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = async (id) => {
    if (id === 1) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Esse cliente não pode ser deletado!",
      });
      return;
    }

    const res = await deleteClient(id);
    if (res.ok) {
      toast.success(`Cliente deletado com sucesso!`, {
        position: toast.POSITION.TOP_RIGHT,
      });

      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);

    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    if (newRow.name === "" || newRow.name === null) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Nome ou email são obrigatórios",
      });
      return;
    }

    const res = await updateClients(newRow);
    if (res.ok) {
      toast.success(`Cliente ${newRow.name} atualizado com sucesso!`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const columns = [
    { field: "id", flex: 1, headerName: "ID" },
    {
      field: "createdAt",
      headerName: "Cadastrado em",
      flex: 1,
      renderCell: ({ row: { createdAt } }) => {
        return (
          <Box>
            {
              (createdAt = dayjs(new Date(createdAt)).format(
                "YYYY-MM-DD - HH:mm"
              ))
            }
          </Box>
        );
      },
    },
    { field: "email", flex: 1, headerName: "Email" },
    {
      field: "name",
      headerName: "Nome",
      editable: true,
      flex: 1,
      cellClassName: "name-column-cell",
    },
    {
      field: "cpf",
      headerName: "CPF",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "orders",
      headerName: "Pedidos",
      sortable: false,
      renderCell: ({ id }) => {
        const onClick = (e) => {
          e.stopPropagation();
          console.log(id);
        };

        return (
          <Box>
            <Button
              style={{
                backgroundColor: colors.greenAccent[500],
              }}
              type="submit"
              className="p-4  "
              onClick={onClick}
            >
              Ver pedidos
            </Button>
          </Box>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 100,
      cellClassName: "actions",

      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            // eslint-disable-next-line react/jsx-key
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              color="inherit"
              onClick={handleSaveClick(id)}
            />,
            // eslint-disable-next-line react/jsx-key
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div>
      {permissions ? (
        <>
          <Header
            className="m-6"
            title="Clientes "
            subtitle="Visuzalize todos os clientes cadastrados"
          />
          {/*  .MuiDataGrid-row--editing .MuiDataGrid-cell*/}
          <Box
            sx={{
              "& .css-1mx81p6-MuiDataGrid-root .MuiDataGrid-row--editing .MuiDataGrid-cell":
                {
                  backgroundColor: colors.blueAccent[700],
                },
              "& .css-1mx81p6-MuiDataGrid-root .MuiDataGrid-cell.MuiDataGrid-cell--editing":
                {
                  backgroundColor: colors.blueAccent[600],
                },

              "& .MuiDataGrid-root": {
                border: "none",
              },

              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[800],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[800],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
            }}
            className=" flex items-center flex-col justify-center "
          >
            <DataGrid
              className="lg:w-11/12 w-full"
              editMode="row"
              initialState={{
                sorting: {
                  sortModel: [{ field: "id", sort: "asc" }],
                },
              }}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              rowModesModel={rowModesModel}
              slotProps={{
                toolbar: { setRows, setRowModesModel },
              }}
              slots={{
                toolbar: EditToolbar,
              }}
              rows={rows}
              columns={columns}
            />
          </Box>
        </>
      ) : (
        <p>Você não tem permissão :( </p>
      )}
    </div>
  );
};

export default Clients;
