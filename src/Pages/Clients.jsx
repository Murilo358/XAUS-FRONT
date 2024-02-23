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
import LinearProgress from "@mui/material/LinearProgress";
import { LiaSpinnerSolid } from "react-icons/lia";
import PtBrLang from "../styles/PtBr";
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
  useGridApiContext,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { tokens } from "../styles/Themes";
import OrdersModal from "../Components/OrdersModal/OrdersModal";
import DataGridBox from "../Components/DataGridBox/DataGridBox";
import UseIsMobile from "../Hooks/UseIsMobile";
import MuiToolBar from "../Components/MuiToolbar/MuiToolBar";
import HandlePermissionError from "../Components/HandlePermissionError";

const Clients = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { jwtToken, roles } = useContext(AuthContext);
  const permissions = hasPermission(roles, actions.VIEW_CLIENTS);
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
        import.meta.env.VITE_PUBLIC_BACKEND_URL + `/clients/delete/${id}`,
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
        import.meta.env.VITE_PUBLIC_BACKEND_URL +
          `/clients/update/${newData.id}`,
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
      setLoading(true);
      await fetch(import.meta.env.VITE_PUBLIC_BACKEND_URL + "/clients/getall", {
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
      setLoading(false);
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
        <MuiToolBar />
      </GridToolbarContainer>
    );
  }

  const createClient = async (data) => {
    try {
      setLoading(true);
      const response = await fetch(
        import.meta.env.VITE_PUBLIC_BACKEND_URL + `/clients/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
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

  const processRowUpdate = async (newRow) => {
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
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const { isMobile } = UseIsMobile();

  const columns = [
    { field: "id", headerName: "ID", flex: isMobile ? 0 : 1 },
    {
      flex: isMobile ? 0 : 1,
      field: "createdAt",
      headerName: "Cadastrado em",

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
      flex: isMobile ? 0 : 1,
      field: "email",
      headerName: "Email",
      editable: creationMode,
    },
    {
      flex: isMobile ? 0 : 1,
      field: "name",
      headerName: "Nome",
      editable: true,
      cellClassName: "name-column-cell",
    },

    {
      flex: isMobile ? 0 : 1,
      field: "cpf",
      headerName: "CPF",

      headerAlign: "left",
      editable: creationMode,
      align: "left",
      renderEditCell: renderCustomEditComponent,
    },
    {
      flex: isMobile ? 0 : 1,
      field: "orders",
      headerName: "Pedidos",
      sortable: false,
      renderCell: ({ id }) => {
        const onClick = async (e) => {
          e.stopPropagation();
          await fetch(
            import.meta.env.VITE_PUBLIC_BACKEND_URL + `/orders/byclient/${id}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${jwtToken}` },
            }
          ).then(async (res) => {
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
      flex: isMobile ? 0 : 1,
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
    <div className="flex flex-col justify-center items-center text-center">
      {permissions ? (
        <>
          <Header
            className="m-6"
            title="Clientes "
            subtitle="Visuzalize todos os clientes cadastrados"
          />{" "}
          {loading && (
            <LiaSpinnerSolid className="animate-spin mt-20  w-[80px] h-[80px]" />
          )}
          {!loading && (
            <DataGridBox>
              <OrdersModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                orders={modalOrders}
              />
              <DataGrid
                className="w-11/12 "
                editMode="row"
                initialState={{
                  sorting: {
                    sortModel: [{ field: "id", sort: "asc" }],
                  },
                }}
                localeText={PtBrLang}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                rowModesModel={rowModesModel}
                slotProps={{
                  toolbar: { setRows, setRowModesModel },
                }}
                slots={{
                  toolbar: EditToolbar,
                  loadingOverlay: LinearProgress,
                }}
                rows={rows}
                columns={columns}
                loading={loading}
              />
            </DataGridBox>
          )}
        </>
      ) : (
        <HandlePermissionError />
      )}
    </div>
  );
};

export default Clients;
