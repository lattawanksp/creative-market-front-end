import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/Market/ProductCard";
import MarketHeader from "../components/Market/MarketHeader";
import { useAuth } from "../context/AuthContext";

const PRODUCTS_PER_PAGE = 12;

const serverBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:7777";

const apiBaseUrl = `${serverBaseUrl}/api`;

const Market = () => {
  const { isLoggedIn, userRole } = useAuth();
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(false);
  // const [isLoadingMore, setIsLoadingMore] = useState(false);

  const activeCategory = searchParams.get("category") || "All";
  const categories = ["All", "Visual Art", "Craft & Handmade", "Music & Sound"];

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          page: String(page),
          limit: String(PRODUCTS_PER_PAGE),
        });

        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        }
        if (activeCategory !== "All") {
          params.set("category", activeCategory);
        }

        const res = await fetch(`${apiBaseUrl}/products?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
          setTotalPages(data.pagination?.totalPages || 1);
        }
      } catch (err) {
        console.error("Fetch products failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch, activeCategory, page]);

  const handleCategoryChange = (newCategory) => {
    setSearchParams({ category: newCategory });
    setPage(1);
  };

  // const handleLoadMore = async () => {
  //   try {
  //     setIsLoadingMore(true);

  //     const nextPage = page + 1;

  //     const params = new URLSearchParams({
  //       page: String(nextPage),
  //       limit: String(PRODUCTS_PER_PAGE),
  //     });

  //     if (debouncedSearch) {
  //       params.set("search", debouncedSearch);
  //     } else if (activeCategory !== "All") {
  //       params.set("category", activeCategory);
  //     }

  //     const res = await fetch(`${apiBaseUrl}/products?${params.toString()}`);
  //     const data = await res.json();

  //     if (data.success) {
  //       setProducts((prevProducts) => [...prevProducts, ...data.data]);
  //       setHasMore(data.pagination?.hasMore || false);
  //       setPage(nextPage);
  //     }
  //   } catch (err) {
  //     console.error("Load more products failed:", err);
  //   } finally {
  //     setIsLoadingMore(false);
  //   }
  // };

  // ── Skeleton Cards ──
  const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="mt-2 flex justify-between items-center">
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-5 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="h-9 bg-gray-200 rounded-lg w-full mt-1" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F7FF] py-8 px-4 md:px-12 font-['Anuphan',sans-serif]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <MarketHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isFilterActive={isFilterActive}
          setIsFilterActive={setIsFilterActive}
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
          categories={categories}
        />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // skeleton 8 ช่อง
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : products.length > 0 ? (
            products.map((product) => (
              <Link key={product._id} to={`/product/${product.slug}`}>
                <ProductCard
                  product={product}
                  isLoggedIn={isLoggedIn} // 🌟 3. ส่งสัญญาณล็อกอินจริงเข้าการ์ดสินค้า
                  userRole={userRole} // 🌟 4. ส่งยศจริงเข้าการ์ดสินค้า
                />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">
                Didn't found what you were looking for
              </p>
            </div>
          )}
        </div>

        {/* ปุ่มควบคุมการแบ่งหน้า (Pagination Controls) */}
        {!loading && totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-2">
            {/* ปุ่มย้อนกลับ (Previous) */}
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>

            {/* วนลูปเสกปุ่มตามจำนวนหน้าทั้งหมดที่มี (เช่น มี 9 หน้า ก็เสกมา 9 ปุ่ม) */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    page === pageNum
                      ? "bg-[#6D5DD3] text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* ปุ่มไปข้างหน้า (Next) */}
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;
