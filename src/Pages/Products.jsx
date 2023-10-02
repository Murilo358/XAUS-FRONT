import { useContext, useEffect, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import { hasPermission } from "../Permissions/Permissions";
import { actions } from "../Permissions/Constants";

const Products = () => {
  const { jwtToken, roles } = useContext(AuthContext);

  const permission = hasPermission(roles, actions.VIEW_PRODUCTS);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getAllProducts = async () => {
      await fetch("http://localhost:8080/products/getAll", {
        method: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
      }).then(async (res) => {
        setProducts(await res.json());
      });
    };

    getAllProducts();
  }, []);

  return (
    <div>
      Products
      {permission ? (
        products.length > 0 &&
        products.map((product) => (
          <div key={product.id}>
            {product.name}
            Quantidade disponivel {product.quantity}
            Valor {product.price}
          </div>
        ))
      ) : (
        <p>Você não tem permissão :( </p>
      )}
    </div>
  );
};

export default Products;
