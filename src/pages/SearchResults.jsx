import React, { useEffect, useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowUpDown, PackageOpen, ChevronRight, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ------- Sub-Components for Clean Structure ------- */

const CategoryButton = ({ cat, isActive, onClick }) => (
  <button
    onClick={() => onClick(cat)}
    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 ${
      isActive 
      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/20 font-bold' 
      : 'hover:bg-white/10 text-white/60 hover:text-white'
    }`}
  >
    <span className="text-sm tracking-wide">{cat}</span>
    {isActive && <ChevronRight size={14} />}
  </button>
);

const ProductCard = ({ item }) => {
  const displayCategory = item.categoryName || item.category?.name || "Premium";
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-pink-500/50 hover:shadow-[0_20px_50px_rgba(236,72,153,0.1)] transition-all duration-500"
    >
      <Link to={`/details/${item._id}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-pink-400">
            {displayCategory}
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-pink-400 transition-colors">
            {item.title}
          </h3>
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-tighter">Price</p>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                ₹{item.price.toLocaleString()}
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-pink-500 group-hover:border-pink-500 transition-all duration-300">
              <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ------- Main Page Component ------- */

export default function SearchResults() {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/products`);
        const allProducts = await res.json();
        const filtered = allProducts.filter((p) => {
          const title = p?.title?.toLowerCase() || "";
          const catName = p?.categoryName?.toLowerCase() || p?.category?.name?.toLowerCase() || "";
          return title.includes(query.toLowerCase()) || catName.includes(query.toLowerCase());
        });
        setResults(filtered);
      } catch (err) { console.error(err); } 
      finally { setTimeout(() => setLoading(false), 800); }
    }
    if (query) fetchResults();
  }, [query]);

  const processedResults = useMemo(() => {
    let list = [...results];
    if (activeCategory !== "All") {
      list = list.filter(item => (item.categoryName || item.category?.name) === activeCategory);
    }
    if (sortBy === "lowHigh") list.sort((a, b) => a.price - b.price);
    if (sortBy === "highLow") list.sort((a, b) => b.price - a.price);
    return list;
  }, [results, sortBy, activeCategory]);

  const categories = useMemo(() => {
     const names = results.map(r => r.categoryName || r.category?.name).filter(Boolean);
     return ["All", ...new Set(names)];
  }, [results]);

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-pink-500/30">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-pink-500 text-xs font-black uppercase tracking-[0.2em]">
              <div className="h-1 w-8 bg-pink-500 rounded-full" />
              Search Results
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">
              "{query.toUpperCase()}"
            </h1>
            <p className="text-white/40 text-sm font-medium">Showing {processedResults.length} curated matches</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm font-bold"
              >
                <Filter size={16} /> Filter
              </button>
              <div className="hidden md:flex items-center gap-2 px-4 text-white/40">
                <ArrowUpDown size={16} />
                <span className="text-xs font-bold uppercase">Sort</span>
              </div>
              <select 
                className="bg-transparent outline-none cursor-pointer font-bold text-sm py-2 px-4 pr-8 appearance-none"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance" className="bg-gray-900">Most Relevant</option>
                <option value="lowHigh" className="bg-gray-900">Price: Low to High</option>
                <option value="highLow" className="bg-gray-900">Price: High to Low</option>
              </select>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-10">
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 flex items-center gap-3">
                <SlidersHorizontal size={14} /> Browse Categories
              </h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <CategoryButton 
                    key={cat} 
                    cat={cat} 
                    isActive={activeCategory === cat} 
                    onClick={setActiveCategory} 
                  />
                ))}
              </div>
            </section>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : processedResults.length === 0 ? (
              <EmptyState />
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode='popLayout'>
                  {processedResults.map((item) => (
                    <ProductCard key={item._id} item={item} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      <MobileFilterDrawer 
        isOpen={isMobileFilterOpen} 
        onClose={() => setIsMobileFilterOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
    </div>
  );
}

/* ------- Helper UI Components ------- */

const EmptyState = () => (
  <div className="h-[60vh] flex flex-col items-center justify-center text-center p-12 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
    <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
      <PackageOpen size={48} className="text-white/20" />
    </div>
    <h2 className="text-2xl font-bold italic tracking-tight mb-2">Nothing Found</h2>
    <p className="text-white/40 max-w-xs text-sm">We couldn't find any products matching your search. Try a different keyword.</p>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-6 animate-pulse">
    <div className="aspect-[4/5] bg-white/5 rounded-2xl" />
    <div className="space-y-3">
      <div className="h-4 bg-white/10 rounded-full w-3/4" />
      <div className="h-4 bg-white/10 rounded-full w-1/2" />
    </div>
  </div>
);

const MobileFilterDrawer = ({ isOpen, onClose, categories, activeCategory, onSelect }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
        />
        <motion.div 
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          className="fixed bottom-0 left-0 right-0 bg-[#0f172a] rounded-t-[3rem] p-8 z-[101] border-t border-white/10"
        >
          <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
          <h3 className="text-xl font-black italic mb-6">Filter Categories</h3>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => { onSelect(cat); onClose(); }}
                className={`px-4 py-3 rounded-2xl text-sm font-bold border transition-all ${
                  activeCategory === cat ? 'bg-pink-500 border-pink-500' : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);