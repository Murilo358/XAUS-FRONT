import { useContext, useEffect, useState } from "react"
import AuthContext from "../Contexts/AuthContext";

const Products = () => {
    const {jwtToken} = useContext(AuthContext);

  
    const [products, setProducts] = useState([]);

    useEffect(() =>{

        const getAllProducts = async ()=>{
            console.log(`Bearer ${jwtToken}`)
            const productss = await fetch("http://localhost:8080/products/getAll", {
                method: "GET",
                headers: {'Authorization': `Bearer ${jwtToken}`}
              })
              console.log(await productss.json());
        }

        getAllProducts()
    },[])

    return (
    <div>Products</div>
  )
}

export default Products