import { useContext } from "react";
import AuthContext from "../Contexts/AuthContext";
import { actions } from "../Permissions/Constants";
import { useState } from "react";
import { hasPermission } from "../Permissions/Permissions";
import { useEffect } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import Header from "../Components/Header/Header";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../styles/Themes";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

const Clients = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { jwtToken, roles } = useContext(AuthContext);
  const permissions = hasPermission(roles, actions.SEE_ALL_PRODUCTS);
  const [clients, setAllClients] = useState([]);

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
                "YYYY-MM-DD - HH:MM"
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
  ];

  useEffect(() => {
    const getAllOrders = async () => {
      await fetch("http://localhost:8080/clients/getall", {
        method: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
      }).then(async (res) => {
        if (res.ok) {
          setAllClients(await res.json());
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

  return (
    <div>
      {permissions ? (
        <>
          <Header
            className="m-6"
            title="Clientes "
            subtitle="Visuzalize todos os clientes cadastrados"
          />
          <Box
            sx={{
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
          >
            <DataGrid checkboxSelection rows={clients} columns={columns} />
          </Box>
        </>
      ) : (
        <p>Você não tem permissão :( </p>
      )}
    </div>
  );
};

export default Clients;
