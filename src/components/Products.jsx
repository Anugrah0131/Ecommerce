import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "./Card";

function Products() {
  const [products, setProducts] = useState([])

  const fetchStoreProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/user");
      const data = await res.json();
      console.log("Fake store data:", data)
      setProducts(data);
    } catch (error) {
      console.error("Error fetching prducts:", error);
    }
};
    useEffect(()=>{
      fetchStoreProducts();

    },[]);

    return (
      <div className="w-full min-h-screen bg-grey-100">
         <div className="w-full h-[12vh]">
          <Navbar/>
         </div>

         <div className="flex flex-wrap justify-center gap-6 p-6">
            {products.map((item)=>(
              <Card
              key={item.id}
              id={item.id}
              title={item.title}
              price={item.price}
              Image={item.image} />
              
              ))}
         </div>
      </div>
    )

}
export default Products;