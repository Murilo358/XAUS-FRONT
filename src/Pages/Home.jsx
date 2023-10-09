import { useEffect, useState, useContext } from "react";
import Header from "../Components/Header/Header";
import { Box, Typography } from "@mui/material";
import AuthContext from "../Contexts/AuthContext";
import BarChart from "../Components/BarChart";
import Swal from "sweetalert2";
import { useMemo } from "react";
import { useTheme } from "@emotion/react";
import { tokens } from "../styles/Themes";

const Home = () => {
  const { jwtToken, roles } = useContext(AuthContext);
  const [productsReport, setProductsReport] = useState({});

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useMemo(() => {
    const getProductsReport = async () => {
      await fetch("http://localhost:8080/orders/productsReport", {
        method: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
      }).then(async (res) => {
        if (res.ok) {
          const response = await res.json();
          response.forEach((item) => {
            var obj = {};
            obj[item.productName] = item.quantity;
            setProductsReport((productsReport) => ({
              ...productsReport,
              ...obj,
            }));
          });
          let allProducts = {};
          allProducts["Produtos"] = response.length;
          setProductsReport((productsReport) => ({
            ...productsReport,
            ...allProducts,
          }));
          return;
        }
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Erro ao buscar o relatório dos produtos",
        });
      });
    };
    getProductsReport();
  }, []);

  return (
    <Box>
      <Header
        title="Dashboard"
        subtitle="Resumo das ultimas atividades do XAUS"
      />
      <div className="flex ">
        <div className="w-[600px] h-[400px] ms-6">
          <Typography variant="h5" color={colors.greenAccent[400]}>
            Quantidade de produtos vendidos
          </Typography>
          <BarChart data={productsReport} />
        </div>
        <div className="w-[600px] h-[400px] ms-6">
          <Typography variant="h5" color={colors.greenAccent[400]}>
            Quantidade de novos clientes
          </Typography>
          <BarChart data={productsReport} />
        </div>
      </div>
    </Box>
  );
};

export default Home;
