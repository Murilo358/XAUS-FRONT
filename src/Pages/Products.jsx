import { useContext, useMemo, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import { hasPermission } from "../Permissions/Permissions";
import { actions } from "../Permissions/Constants";
import {
  Box,
  Button,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import Header from "../Components/Header/Header";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { GridToolbarDensitySelector } from "@mui/x-data-grid";
import { tokens } from "../styles/Themes";
import ArticleIcon from "@mui/icons-material/Article";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useTheme } from "@emotion/react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import NewOrderModal from "../Components/NewOrderModal/NewOrderModal";
import DataGridBox from "../Components/DataGridBox/DataGridBox";
import { useEffect } from "react";

//APENAS ADMIN PODERÁ EDITAR, EXCLUIR E ETC
const Products = () => {
  const { jwtToken, roles } = useContext(AuthContext);

  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  const viewPermission = hasPermission(roles, actions.VIEW_PRODUCTS);
  const editPermission = hasPermission(roles, actions.UPDATE_PRODUCTS);
  const createOrderPermission = hasPermission(roles, actions.CREATE_ORDER);

  const [rowModesModel, setRowModesModel] = useState({});

  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [creationMode, setCreationMode] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://xaus-backend-production.up.railway.app/auth/allRoles:8080/products/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setLoading(false);
      if (response.ok) {
        return response;
      } else {
        throw new Error("Erro ao deletar o produto");
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
      setLoading(false);
      return null;
    }
  };

  const createProduct = async (newData) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://xaus-backend-production.up.railway.app/auth/allRoles:8080/products/create`,
        {
          method: "POST",
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
        throw new Error("Erro ao salvar o produto");
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

  const updateProduct = async (newData) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://xaus-backend-production.up.railway.app/auth/allRoles:8080/products/update/${newData.id}`,
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
        throw new Error("Erro ao atualizar o produto");
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

  useMemo(() => {
    const getAllProducts = async () => {
      setLoading(true);
      await fetch(
        "https://xaus-backend-production.up.railway.app/auth/allRoles:8080/products/getAll",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      ).then(async (res) => {
        setRows(await res.json());
      });
      setLoading(false);
    };

    getAllProducts();
  }, []);

  function EditToolbar(props) {
    // eslint-disable-next-line react/prop-types
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = "**";
      setCreationMode(true);
      setRows((oldRows) => [
        ...oldRows,
        {
          id,
          name: "",
          email: "",
          description: "",
          price: "",
          quantity: "",
          isNew: true,
        },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      }));
    };

    const handleOrdersClick = () => {
      if (rowSelectionModel.length <= 0) {
        Swal.fire({
          icon: "error",
          background: colors.primary[400],
          color: colors.grey[100],
          title: "Oops...",
          text: "Selecione ao menos um produto",
        });
        return;
      }

      selectedRows.forEach((item) => {
        const buying = document.getElementById(`buying-${item.id}`).value;
        item.buying = buying;
      });

      setSelectedRows(selectedRows);
      setOpenModal(true);
    };

    return (
      <GridToolbarContainer>
        <Box>
          <Button
            sx={{ color: colors.grey[100] }}
            startIcon={<AddIcon />}
            onClick={handleClick}
          >
            <Typography> Adicionar produto </Typography>
          </Button>
        </Box>
        <Box>
          {createOrderPermission && (
            <Button
              sx={{ color: colors.grey[100] }}
              startIcon={<ArticleIcon />}
              onClick={handleOrdersClick}
            >
              <Typography> Gerar pedido </Typography>
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

    const res = await deleteProduct(id);
    if (res.ok) {
      toast.success(`Produto deletado com sucesso!`, {
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
      setCreationMode(false);
    }
  };

  const processRowUpdate = async (newRow) => {
    if (
      (newRow.name === "" || newRow.description === "",
      newRow.price === "",
      newRow.quantity === "")
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
      const res = await updateProduct(newRow);

      if (res.ok) {
        toast.success(`Produto: ${newRow.name} atualizado com sucesso!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      }
    }
    if (newRow.isNew) {
      const res = await createProduct(newRow);

      if (res.ok) {
        const savedProduct = await res.json();

        toast.success(`Produto: ${newRow.name} Criado com sucesso!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        const updatedRow = { ...newRow, isNew: false, id: savedProduct.id };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

        return updatedRow;
      }
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
    { field: "id", headerName: "ID", flex: isMobile ? 0 : 1 },
    {
      field: "name",
      headerName: "Nome",
      editable: editPermission,
      flex: isMobile ? 0 : 1,
    },
    {
      field: "description",
      headerName: "Descrição",
      flex: isMobile ? 0 : 1,
      headerAlign: "left",
      editable: editPermission,
      align: "left",
    },
    {
      field: "price",
      flex: isMobile ? 0 : 1,
      headerName: "Valor",
      headerAlign: "center",
      align: "center",
      editable: editPermission,
      type: "number",

      renderCell: ({ row: { price } }) => {
        return (
          <Box>
            <Typography variant="p">R$ {price}</Typography>
          </Box>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Quantidade disponivel",

      type: "number",
      headerAlign: "left",
      editable: editPermission,
      align: "left",
    },

    {
      field: "buyingQuantity",
      headerName: "Qtt a comprar",
      sortable: false,

      renderCell: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        const currentRow = rows.find((row) => row.id === id);

        if (!isInEditMode && !creationMode) {
          return (
            <TextField
              id={`buying-${id}`}
              variant="standard"
              type="number"
              InputProps={{
                inputProps: {
                  max: currentRow?.quantity,
                  min: 1,
                },
              }}
              onChange={(e) => {
                e.target.value <= 0 ? (e.target.value = 1) : "";
                e.target.value >= currentRow.quantity
                  ? (e.target.value = currentRow.quantity)
                  : "";
              }}
              className="p-4"
              defaultValue={1}
            />
          );
        }
      },
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

  return (
    <Box>
      <Header
        title="Produtos"
        subtitle="Visualize todos os produtos cadastrados"
      />

      {viewPermission ? (
        <DataGridBox>
          <NewOrderModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            products={selectedRows}
          />
          <DataGrid
            className="w-11/12 "
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
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
              const selectedRowsData = newRowSelectionModel.map((id) =>
                rows.find((row) => row.id === id)
              );

              setSelectedRows(selectedRowsData);
            }}
            disableRowSelectionOnClick
            rowSelectionModel={rowSelectionModel}
            checkboxSelection
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
            loading={loading}
            rows={rows}
            columns={columns}
          />
        </DataGridBox>
      ) : (
        <p>Você não tem permissão para acessar essa página :( </p>
      )}
    </Box>
  );
};

export default Products;
