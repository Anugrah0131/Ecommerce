import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function RelatedProducts({ related }) {
  if (!related || related.length === 0) {
    return (
      <div className="mt-20 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">You May Also Like</h2>
        <p className="text-gray-500">No similar products found.</p>
      </div>
    );
  }

  return (
    <div className="mt-20 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        You May Also Like
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {related.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="
              group 
              bg-white/70 backdrop-blur-lg 
              rounded-3xl 
              shadow-lg 
              border border-gray-200
              hover:border-blue-400 
              hover:shadow-2xl 
              hover:-translate-y-1
              transition-all 
              overflow-hidden
            "
          >
            <Link to={`/details/${item._id}`}>
              {/* Image */}
              <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                <motion.img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain"
                  whileHover={{ scale: 1.12 }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Content */}
              <div className="p-4 text-center">
                <h3 className="text-gray-900 font-semibold text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-blue-600 font-bold text-lg mb-3">
                  ₹ {item.price}
                </p>

                <button
                  className="
                    w-full py-2 
                    rounded-xl 
                    bg-blue-50 
                    text-blue-600 
                    font-semibold 
                    border border-blue-300
                    group-hover:bg-blue-600 
                    group-hover:text-white 
                    transition-all
                  "
                >
                  View Product
                </button>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
