import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function SingleCategory() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  const API_URL = `http://localhost:8080/api/categories/${id}`;

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        setCategory(data.category);
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategoryData();
  }, [id]);

  if (!category)
    return (
      <div className="w-full text-center mt-10 text-gray-600 text-lg">
        Loading category...
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
       
       {/* Category Header Card */}
<div className="
  w-full md:w-[85%] lg:w-[90%]
  bg-white 
  rounded-3xl 
  p-10
  mb-10
  shadow-[0_8px_30px_rgba(0,0,0,0.08)]
  border border-[#e6e6e6]
  relative
">
  
  {/* Top Gold Accent Line */}
  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-t-3xl"></div>

  <div className="flex flex-col md:flex-row items-center gap-10">

    {/* Image Frame */}
    <div className="
      p-3 
      rounded-2xl 
      bg-gradient-to-br from-gray-100 to-gray-50
      border border-gray-200
      shadow-inner
    ">
      <img
        src={category.image}
        alt={category.name}
        className="w-40 h-40 md:w-48 md:h-48 object-contain"
      />
    </div>

    {/* Text Section */}
    <div className="flex flex-col gap-3">
      <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-wide">
        {category.name}
      </h1>

      <div className="w-16 h-[3px] bg-yellow-500 rounded-full mb-1"></div>

      <p className="text-gray-600 leading-relaxed text-base max-w-xl">
        {category.description}
      </p>
    </div>

  </div>

</div>


    {/* Products Grid */}
<div className="w-[95%] md:w-[80%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

  {products.length > 0 ? (
    products.map((p) => (
      <div
        key={p._id}
        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      >
        {/* Image Section */}
        <Link to={`/details/${p._id}`}>
          <div className="w-full h-44 bg-gray-50 flex items-center justify-center">
            {p.image ? (
              <img
                src={p.image}
                alt={p.title}
                className="object-contain h-full"
              />
            ) : (
              <span className="text-gray-400 text-sm">No Image</span>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 text-center flex flex-col gap-2">
          
          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
            {p.title}
          </h3>

          {/* Category */}
          <p className="text-gray-500 text-xs capitalize tracking-wide">
            {category?.name}
          </p>

          {/* Price */}
          <p className="text-xl font-bold text-indigo-600">
            ₹{p.price}
          </p>

          {/* View Button */}
  <Link
    to={`/details/${p._id}`}
    className="
      px-4 py-2 
      text-xs font-medium 
      rounded-lg 
      bg-gradient-to-r from-indigo-600 to-indigo-700 
      text-white 
      shadow-md 
      hover:shadow-lg 
      hover:from-indigo-700 hover:to-indigo-800
      active:scale-95
      transition-all
    "
  >
    View
  </Link>

  {/* Add to Cart */}
  <button
    className="
      px-4 py-2 
      text-xs font-medium 
      rounded-lg 
      border border-gray-300 
      bg-white 
      text-gray-800 
      shadow-sm 
      hover:bg-gray-100 hover:border-gray-400
      active:scale-95
      transition-all
    "
  >
    Add to Cart
  </button>
          </div>
        </div>
      

    ))
  ) : (
    <p className="col-span-full text-center text-gray-500 font-medium">
      No products found in this category.
    </p>
  )}

</div>
    </div> 

  );

}


export default SingleCategory;

