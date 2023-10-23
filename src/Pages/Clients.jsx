import { useContext, useRef } from "react";
import AuthContext from "../Contexts/AuthContext";
import { actions } from "../Permissions/Constants";
import { useState } from "react";
import { hasPermission } from "../Permissions/Permissions";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import InputMask from "react-input-mask";
import Header from "../Components/Header/Header";
import {
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
  GridRowEditStopReasons,
  GridToolbarDensitySelector,
  GridToolbarExport,
  useGridApiContext,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { tokens } from "../styles/Themes";
import OrdersModal from "../Components/OrdersModal/OrdersModal";
import DataGridBox from "../Components/DataGridBox/DataGridBox";

const Clients = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { jwtToken, roles } = useContext(AuthContext);
  const permissions = hasPermission(roles, actions.SEE_ALL_PRODUCTS);
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [modalOrders, setModalOrders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [creationMode, setCreationMode] = useState(false);

  const createPermission = hasPermission(roles, actions.CREATE_CLIENTS);

  const [newClientId, setNewClientId] = useState(0);

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
        background: colors.primary[400],
        color: colors.grey[100],
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
          background: colors.primary[400],
          color: colors.grey[100],
          icon: "error",
          title: "Oops...",
          text: "Erro ao buscar todos os clientes",
        });
      });
    };
    getAllOrders();
  }, []);

  function EditToolbar(props) {
    // eslint-disable-next-line react/prop-types
    const { setRows, setRowModesModel } = props;

    const handleAddClient = () => {
      setNewClientId(newClientId - 1);
      setCreationMode(true);
      setRows((oldRows) => [
        ...oldRows,
        {
          id: newClientId,
          createdAt: new Date(),
          email: "",
          name: "",
          cpf: "",
          isNew: true,
        },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [newClientId]: { mode: GridRowModes.Edit },
      }));
    };

    return (
      <GridToolbarContainer>
        <Box>
          {createPermission && (
            <Button
              id="newClient"
              sx={{ color: colors.grey[100] }}
              startIcon={<PersonAddOutlinedIcon />}
              onClick={handleAddClient}
            >
              <Typography> Novo cliente </Typography>
            </Button>
          )}
        </Box>
        <Box>
          <GridToolbarExport
            sx={{
              fontSize: "0.8571428571428571rem",
              height: "32.578px",
              color: colors.grey[100],
            }}
          />
        </Box>
        <Box>
          <GridToolbarDensitySelector
            sx={{
              fontSize: "0.8571428571428571rem",
              height: "32.578px",
              color: colors.grey[100],
            }}
          />
        </Box>
      </GridToolbarContainer>
    );
  }

  const createClient = async (data) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/clients/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLoading(false);

      if (response.ok) {
        setCreationMode(false);
        return response;
      } else {
        throw new Error("Erro ao salvar o cliente");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        background: colors.primary[400],
        color: colors.grey[100],
        icon: "error",
        title: "Oops...",
        text: error?.message,
      });
      setLoading(false);
      return null;
    }
  };

  const handleEditClick = (id) => () => {
    if (id === 1) {
      Swal.fire({
        background: colors.primary[400],
        color: colors.grey[100],
        icon: "error",
        title: "Oops...",
        text: "Esse cliente não pode ser alterado!",
      });
      return;
    }
    setCreationMode(false);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setCreationMode(false);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = async (id) => {
    if (id === 1) {
      Swal.fire({
        background: colors.primary[400],
        color: colors.grey[100],
        icon: "error",
        title: "Oops...",
        text: "Esse cliente não pode ser deletado!",
      });
      setCreationMode(false);
      return;
    }

    const res = await deleteClient(id);
    if (res.ok) {
      toast.success(`Cliente deletado com sucesso!`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setCreationMode(false);
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    setCreationMode(false);
    const editedRow = rows.find((row) => row.id === id);

    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow, oldRow) => {
    console.log(newRow, oldRow);
    if (newRow.name === "" || newRow.name === null || newRow.cpf === "") {
      Swal.fire({
        background: colors.primary[400],
        color: colors.grey[100],
        icon: "error",
        title: "Oops...",
        text: "Todos os campos são obrigatórios",
      });
      setRows(rows.filter((row) => row.id !== newRow.id));
      document.getElementById("newClient").click();
      return;
    }

    if (!validateEmail(newRow.email)) {
      Swal.fire({
        background: colors.primary[400],
        color: colors.grey[100],
        icon: "error",
        title: "Oops...",
        text: "Insira um email valido",
      });
      setRows(rows.filter((row) => row.id !== newRow.id));
      document.getElementById("newClient").click();
      return;
    }

    if (!newRow.isNew) {
      const res = await updateClients(newRow);
      if (res.ok) {
        toast.success(`Cliente ${newRow.name} atualizado com sucesso!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      }
    } else {
      const res = await createClient(newRow);

      if (res.ok) {
        const savedClient = await res.json();

        toast.success(`Cliente: ${newRow.name} Criado com sucesso!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        const updatedRow = { ...newRow, isNew: false, id: savedClient.id };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        setCreationMode(false);
        return updatedRow;
      }
    }
  };

  function CustomEditComponent(props) {
    // eslint-disable-next-line react/prop-types
    const { id, value, field } = props;
    const apiRef = useGridApiContext();
    const ref = useRef();

    const handleValueChange = (event) => {
      const newValue = event.target.value;
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    };

    return (
      <FormControl
        sx={{
          width: "100%",
        }}
      >
        <InputMask
          ref={ref}
          value={value}
          onChange={handleValueChange}
          mask="999.999.999-99"
        >
          {() => <TextField id="cpf" name="cpf" />}
        </InputMask>
      </FormControl>
    );
  }
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const renderCustomEditComponent = (params) => {
    return <CustomEditComponent {...params} />;
  };

  function validateEmail(email) {
    console.log(email);
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

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
                "DD-MM-YYYY - HH:mm"
              ))
            }
          </Box>
        );
      },
    },
    {
      field: "email",
      flex: 1,
      headerName: "Email",
      editable: creationMode,
    },
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
      editable: creationMode,
      align: "left",
      renderEditCell: renderCustomEditComponent,
    },
    {
      field: "orders",
      headerName: "Pedidos",
      sortable: false,
      renderCell: ({ id }) => {
        const onClick = async (e) => {
          e.stopPropagation();
          await fetch(`http://localhost:8080/orders/byclient/${id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${jwtToken}` },
          }).then(async (res) => {
            if (res.ok) {
              const response = await res.json();
              setModalOrders(response);
              setOpenModal(true);
              return;
            }

            const { message } = await res.json();
            Swal.fire({
              background: colors.primary[400],
              color: colors.grey[100],
              icon: "error",
              title: "Oops...",
              text: message ? message : "Erro ao buscar todos os pedidos...",
            });
          });
        };
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (!isInEditMode && !creationMode) {
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
        }
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
          <DataGridBox>
            <OrdersModal
              openModal={openModal}
              setOpenModal={setOpenModal}
              orders={modalOrders}
            />
            <DataGrid
              className="lg:w-11/12 w-full"
              editMode="row"
              initialState={{
                sorting: {
                  sortModel: [{ field: "id", sort: "asc" }],
                },
              }}
              localeText={{
                toolbarDensity: "Densidade da tabela",
                toolbarExport: "Exportar",
                toolbarExportCSV: "Baixar como CSV",
                toolbarExportPrint: "Imprimir",
                toolbarDensityCompact: "Compacto",
                toolbarDensityStandard: "Padrão",
                toolbarDensityComfortable: "Confortável",
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
              loading={loading}
            />
          </DataGridBox>
        </>
      ) : (
        <p>Você não tem permissão :( </p>
      )}
    </div>
  );
};

export default Clients;
