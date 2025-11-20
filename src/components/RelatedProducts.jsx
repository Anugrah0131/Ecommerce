import { Link } from "react-router-dom";

export default function RelatedProducts({ related }) {
  return (
    <div className="mt-20 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        You May Also Like
      </h2>

      {related.length === 0 ? (
        <p className="text-gray-500">No similar products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {related.map((item) => (
            <Link
              to={`/details/${item._id}`}
              key={item._id}
              className="group bg-white rounded-2xl shadow hover:shadow-xl 
              border border-gray-100 hover:border-blue-300 transition p-5"
            >
              <div className="w-full h-48">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain transition group-hover:scale-105"
                />
              </div>

              <h3 className="mt-4 text-gray-900 font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition">
                {item.title}
              </h3>

              <p className="text-blue-600 font-semibold mt-2">
                ₹ {item.price}
              </p>

              <button
                className="w-full mt-3 py-2 rounded-lg border border-blue-500 
                text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition"
              >
                View Product
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
