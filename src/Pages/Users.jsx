import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import DataGridBox from "../Components/DataGridBox/DataGridBox";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  useGridApiContext,
} from "@mui/x-data-grid";
import PtBrLang from "../styles/PtBr";
import UseIsMobile from "../Hooks/UseIsMobile";
import Header from "../Components/Header/Header";
import AuthContext from "../Contexts/AuthContext";
import { hasPermission } from "../Permissions/Permissions";
import { actions } from "../Permissions/Constants";
import { useTheme } from "@emotion/react";
import { tokens } from "../styles/Themes";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  Box,
  FormControl,
  NativeSelect,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { LiaSpinnerSolid } from "react-icons/lia";
import translateRoles from "../Permissions/TranslateRoles";
import InputMask from "react-input-mask";

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [loading, setLoading] = useState(false);
  const { jwtToken, roles } = useContext(AuthContext);
  const editPermission = hasPermission(roles, actions.EDIT_USERS);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [creationMode, setCreationMode] = useState(false);
  const [allRoles, setAllRoles] = useState([]);

  const { isMobile } = UseIsMobile();

  const handleEditClick = (id) => () => {
    if (!editPermission) {
      Swal.fire({
        icon: "error",
        background: colors.primary[400],
        color: colors.grey[100],
        title: "Oops...",
        text: "Você não tem a permissão necessária pra editar",
      });
      return;
    }

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    setCreationMode(false);
  };

  const handleDeleteClick = async (id) => {
    if (!editPermission) {
      Swal.fire({
        icon: "error",
        background: colors.primary[400],
        color: colors.grey[100],
        title: "Oops...",
        text: "Você não tem a permissão necessária pra excluir ",
      });
      return;
    }

    const handleDeleteUser = (id) => {
      console.log(id);
    };

    const res = await handleDeleteUser(id);
    if (res.ok) {
      toast.success(`Usuário deletado com sucesso!`, {
        position: toast.POSITION.TOP_RIGHT,
      });

      setAllUsers(allUsers.filter((row) => row.id !== id));
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = allUsers.find((row) => row.id === id);

    if (editedRow.isNew) {
      setAllUsers(allUsers.filter((row) => row.id !== id));
      setCreationMode(false);
    }
  };

  const updateUser = async (newData) => {
    try {
      setLoading(true);
      console.log(newData);
      const response = await fetch(
        import.meta.env.VITE_PUBLIC_BACKEND_URL + `/users/update/${newData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        }
      );
      setLoading(false);
      if (response.ok) {
        return response;
      } else {
        throw new Error("Erro ao atualizar o usuário");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        background: colors.primary[400],
        color: colors.grey[100],
        title: "Oops...",
        text: error.message,
      });
      setLoading(false);
      return null;
    }
  };

  const processRowUpdate = async (newRow) => {
    if (
      (newRow.name === "" || newRow.email === "",
      newRow.cpf === "" || newRow.role === "")
    ) {
      Swal.fire({
        icon: "error",
        background: colors.primary[400],
        color: colors.grey[100],
        title: "Oops...",
        text: "Todos os campos são obrigatórios",
      });
      return;
    }

    if (!newRow.isNew) {
      const res = await updateUser(newRow);

      if (res.ok) {
        toast.success(`Usuário: ${newRow.name} atualizado com sucesso!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        const updatedRow = { ...newRow, isNew: false };
        setAllUsers(
          allUsers.map((row) => (row.id === newRow.id ? updatedRow : row))
        );
        return updatedRow;
      }
    }
  };
  const SimpleSelect = (props) => {
    const { id, field } = props;
    const apiRef = useGridApiContext();

    const handleValueChange = (event) => {
      const newValue = event.target.value;
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    };

    return (
      <FormControl className="w-[100%]">
        <NativeSelect
          sx={{ border: "0px solid transparent" }}
          defaultValue={props.row.role}
          onChange={handleValueChange}
          labelId="role-label"
          id="role"
          label="Cargo*"
          name="role"
        >
          {allRoles.length > 0 &&
            allRoles.map((role) => {
              if (role !== undefined) {
                return (
                  <option key={role} value={role}>
                    {translateRoles(role)}
                  </option>
                );
              }
            })}
        </NativeSelect>
      </FormControl>
    );
  };
  const RenderEditComponent = (params) => {
    return <SimpleSelect {...params} />;
  };

  const CpfInput = (props) => {
    const { id, field } = props;
    const apiRef = useGridApiContext();

    const handleValueChange = (event) => {
      const newValue = event.target.value;
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    };

    return (
      <FormControl>
        <InputMask
          sx={{ border: "1px red solid !important" }}
          onChange={handleValueChange}
          mask="999.999.999-99"
          value={props.row.cpf}
        >
          {() => (
            <TextField
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
              id="cpf"
              name="cpf"
            />
          )}
        </InputMask>
      </FormControl>
    );
  };

  const RenderEditCpfComponent = (params) => {
    return <CpfInput {...params} />;
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: isMobile ? 0 : 1,
    },
    {
      field: "name",
      headerName: "Nome",
      flex: isMobile ? 0 : 1,
      editable: editPermission,
    },
    {
      field: "email",
      headerName: "Email",
      flex: isMobile ? 0 : 1,
      editable: editPermission,
    },
    {
      field: "cpf",
      headerName: "CPF",
      flex: isMobile ? 0 : 1,
      editable: editPermission,
      renderEditCell: RenderEditCpfComponent,
    },
    {
      field: "createdAt",
      headerName: "Criado em",
      flex: isMobile ? 0 : 1,
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
      field: "role",
      headerName: "Cargo",
      flex: isMobile ? 0 : 1,
      editable: editPermission,
      renderEditCell: RenderEditComponent,
      renderCell: ({ row: { role } }) => {
        return (
          <Box>
            <Typography variant="p">{translateRoles(role)}</Typography>
          </Box>
        );
      },
    },
    {
      field: "enabled",
      type: "boolean",
      headerName: "Ativo",
      editable: editPermission,
      flex: isMobile ? 0 : 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 100,
      cellClassName: "actions ",

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

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  useEffect(() => {
    const getAllUsers = async () => {
      await fetch(import.meta.env.VITE_PUBLIC_BACKEND_URL + "/users/getAll", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }).then(async (response) => {
        if (response.status === 200) {
          setAllUsers(await response.json());
        } else {
          console.log("erro ao pegar os usuários");
        }
      });
    };
    const getAllRoles = async () => {
      await fetch(import.meta.env.VITE_PUBLIC_BACKEND_URL + "/users/allRoles", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }).then(async (res) => setAllRoles(await res.json()));
    };

    getAllRoles();
    getAllUsers();
  }, []);

  return (
    <Box className="flex flex-col justify-center items-center text-center">
      {" "}
      <Header
        title="Funcionários"
        subtitle="Veja todos seus funcionários registrados no XAUS"
      />
      {loading && (
        <LiaSpinnerSolid className="animate-spin mt-20  w-[80px] h-[80px]" />
      )}
      {!loading && (
        <DataGridBox>
          <DataGrid
            processRowUpdate={processRowUpdate}
            className="w-11/12 "
            editMode="row"
            onRowEditStop={handleRowEditStop}
            rowModesModel={rowModesModel}
            initialState={{
              sorting: {
                sortModel: [{ field: "id", sort: "desc" }],
              },
            }}
            localeText={PtBrLang}
            rows={allUsers}
            columns={columns}
          />
        </DataGridBox>
      )}
    </Box>
  );
};

export default Users;
