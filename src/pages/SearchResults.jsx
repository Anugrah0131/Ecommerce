import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function SearchResults() {
  const { search } = useLocation(); // ?q=keyword
  const query = new URLSearchParams(search).get("q");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products (simple version)
  const fetchSearchResults = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/products`);
      const products = await res.json();

      // filter logic
      const filtered = products.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filtered);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) fetchSearchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 animate-pulse text-lg">Searching...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Search results for: <span className="text-blue-600">"{query}"</span>
      </h1>

      {results.length === 0 ? (
        <p className="text-gray-500 text-lg">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((item) => (
            <Link
              to={`/details/${item._id}`}
              key={item._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-4"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-contain"
              />
              <h3 className="font-semibold mt-3 line-clamp-2">{item.title}</h3>
              <p className="text-blue-600 font-bold mt-1">₹{item.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
