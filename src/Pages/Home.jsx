import { useState, useContext } from "react";
import Header from "../Components/Header/Header";
import { Box, Typography } from "@mui/material";
import AuthContext from "../Contexts/AuthContext";
import BarChart from "../Components/BarChart";
import Swal from "sweetalert2";
import { useMemo } from "react";
import { useTheme } from "@emotion/react";
import { tokens } from "../styles/Themes";
import StatBox from "../Components/statBox/StatBox";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import OrdersBox from "../Components/OrdersBox/OrdersBox";

const Home = () => {
  const { jwtToken } = useContext(AuthContext);
  const [productsReport, setProductsReport] = useState({});
  const [ordersByUserReport, setOrdersByUserReport] = useState({});

  const [clientsReport, setClientsReport] = useState({});
  const [ordersReports, setOrdersReport] = useState({});

  const [usersReport, setUsersReport] = useState({});

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useMemo(() => {
    const getDashboardReports = async () => {
      await fetch("http://3.15.239.137:8080/reports/dashboard", {
        method: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
      }).then(async (res) => {
        if (res.ok) {
          const response = await res.json();

          setClientsReport(response.clientsReport);
          setOrdersReport(response.ordersReports);
          setUsersReport(response.usersReport);

          response.lastProducts.forEach((item) => {
            var obj = {};
            obj[item.productName] = item.quantity;
            setProductsReport((productsReport) => ({
              ...productsReport,
              ...obj,
            }));
          });
          let allProducts = {};
          allProducts["Produtos"] = response?.lastProducts.length;
          setProductsReport((productsReport) => ({
            ...productsReport,
            ...allProducts,
          }));
          //-=-=====OrdersByUserReport=-=-=-=-=
          response.ordersByUser.forEach((item) => {
            var obj = {};
            obj[item.name] = item.count;
            setOrdersByUserReport((order) => ({
              ...order,
              ...obj,
            }));
          });
          let allOrdersByUser = {};
          allOrdersByUser["Pedidos por usuários"] =
            response?.ordersByUser.length;
          setOrdersByUserReport((order) => ({
            ...order,
            ...allOrdersByUser,
          }));

          return;
        }
        Swal.fire({
          icon: "error",
          background: colors.primary[400],
          color: colors.grey[100],
          title: "Oops...",
          text: "Erro ao buscar o relatório dos produtos",
        });
      });
    };
    getDashboardReports(); //
  }, []);

  return (
    <Box>
      <Header
        title="Dashboard"
        subtitle="Resumo das atividades mensais do XAUS"
      />
      <Box className="flex flex-col justify-center items-center">
        <Box
          sx={{ backgroundColor: colors.primary[400] }}
          className="flex p-4  rounded-t-md gap-10 md:w-auto flex-wrap xl:flex-nowrap "
        >
          <Box className="w-[100%] xl:w-[421px]">
            <StatBox
              title="Novos clientes"
              subtitle="Clientes no ultimo mês"
              icon={<PeopleOutlinedIcon />}
              progress={
                (100 * clientsReport.newClients) / clientsReport.allClients
              }
              increase={`${clientsReport.newClients}+ `}
            />
          </Box>

          <Box className="w-[100%] xl:w-[400px]">
            <StatBox
              title="Novos pedidos"
              subtitle="Pedidos no ultimo mês"
              icon={<ShoppingCartOutlinedIcon />}
              progress={
                (100 * ordersReports.newOrders) / ordersReports.allOrders
              }
              increase={`${ordersReports.newOrders}+ `}
            />
          </Box>
          <Box className="w-[100%] xl:w-[400px]">
            <StatBox
              title="Novos usuários"
              subtitle="Usuários no ultimo mês"
              icon={<PersonAddOutlinedIcon />}
              progress={(100 * usersReport.newUsers) / usersReport.allUsers}
              increase={`${usersReport.newUsers}+ `}
            />
          </Box>
        </Box>
        <div className="flex flex-wrap lg:flex-nowrap items center justify-center rounded-b-md shadow-lg ">
          <Box
            className=" w-[100vw] lg:w-1/3  "
            color={colors.greenAccent[500]}
            sx={{ backgroundColor: colors.primary[400] }}
          >
            <Box className="flex justify-center text-center  ">
              <Header
                margin="4px"
                title="Vendas por produto"
                subtitle="Quantidade de produtos vendidos no último mês"
              />
            </Box>
            <Typography variant="h5"></Typography>
            <BarChart title="Produtos" data={productsReport} />
          </Box>

          <Box
            className=" w-[100vw] lg:w-1/3  "
            color={colors.greenAccent[500]}
            sx={{ backgroundColor: colors.primary[400] }}
          >
            <Box className="flex justify-center text-center  ">
              <Header
                margin="px"
                title="Vendas por usuário"
                subtitle="  Quantidade de vendas por usuário no último mês"
              />
            </Box>

            <BarChart title="Pedidos por usuários" data={ordersByUserReport} />
          </Box>

          <Box
            color={colors.greenAccent[500]}
            sx={{ backgroundColor: colors.primary[400] }}
            className="text-center  w-[100vw] lg:w-1/3 "
          >
            <Box className="flex justify-center text-center  ">
              <Header
                margin="0px"
                title="Últimos pedidos"
                subtitle="Último três pedidos do XAUS"
              />
            </Box>

            {ordersReports.lastThreeOrders && (
              <OrdersBox orders={ordersReports.lastThreeOrders} />
            )}
          </Box>
        </div>
      </Box>
    </Box>
  );
};

export default Home;
