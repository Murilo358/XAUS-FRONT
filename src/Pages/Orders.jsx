import { useContext, useEffect, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import { hasPermission } from "../Permissions/Permissions";
import { actions } from "../Permissions/Constants";
import Swal from "sweetalert2";

const Orders = () => {
  const { jwtToken, roles } = useContext(AuthContext);
  const permission = hasPermission(roles, actions.VIEW_ORDERS);
  const [orders, setAllOrders] = useState([]);

  useEffect(() => {
    const getAllOrders = async () => {
      await fetch("http://localhost:8080/orders/getall", {
        method: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
      }).then(async (res) => {
        if (res.ok) {
          setAllOrders(await res.json());
          return;
        }
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Erro ao buscar todos os pedidos",
        });
      });
    };
    getAllOrders();
  }, []);

  const handleSetPayed = async (orderId) => {
    await fetch(`http://localhost:8080/orders/${orderId}/setPayed`, {
      method: "POST",
      headers: { Authorization: `Bearer ${jwtToken}` },
    }).then((res) => {
      if (res.ok) {
        window.location.reload();
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Erro ao atualizar o pedido",
      });
    });
  };

  return (
    <div>
      Orders
      {permission ? (
        orders.length > 0 &&
        orders.map((order) => (
          <div key={order.id}>
            {order.products.map((product) => (
              <p key={product.productName}>
                {product.productName}
                R$ {product.productPrice}
                quantidade comprada {product.buyedQuantity}
              </p>
            ))}
            <p>Valor do pedido R${order.orderPrice}</p>
            <button
              onClick={() => handleSetPayed(order.id)}
              disabled={order.itsPayed ? true : false}
              className={`p-1 w-[150px] ${
                order.itsPayed ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {order.itsPayed ? "Pago" : "Marcar como pago"}
            </button>
          </div>
        ))
      ) : (
        <p>Você não tem permissão :( </p>
      )}
    </div>
  );
};

export default Orders;
