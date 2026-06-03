import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MAX_SUGGESTIONS = 5;

const serverBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:7777";

const apiBaseUrl = `${serverBaseUrl}/api`;

const ProductHeaderBar = ({ category = "Craft & Handmade" }) => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const trimmedSearch = searchText.trim();
  const shouldShowDropdown = trimmedSearch.length > 0;

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!trimmedSearch) {
        setSuggestions([]);
        return;
      }

      try {
        setIsSearching(true);

        const response = await fetch(
          `${apiBaseUrl}/products?search=${encodeURIComponent(
            trimmedSearch,
          )}&limit=${MAX_SUGGESTIONS}`,
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to search products");
        }

        setSuggestions(result.data.slice(0, MAX_SUGGESTIONS));
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    const delaySearch = setTimeout(fetchSearchResults, 300);

    return () => clearTimeout(delaySearch);
  }, [trimmedSearch]);

  return (
    <section className="w-full bg-[#eeecfb]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:gap-6 md:px-8 md:py-8">
        <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
          <form
            className="relative w-full md:max-w-md"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="product-search" className="sr-only">
              Search product
            </label>

            <div className="flex items-center rounded-xl border-2 border-[#393276] bg-white px-3 py-2.5 md:px-4 md:py-3">
              <input
                id="product-search"
                type="text"
                placeholder="Search product"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="w-full bg-transparent text-sm font-medium tracking-[0.01em] text-[#393276] outline-none placeholder:font-normal placeholder:text-[#6c67b0] md:text-base"
              />

              <button
                type="submit"
                className="ml-3 text-[#4b45a3]"
                aria-label="Search product"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 md:h-6 md:w-6"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>
            </div>

            {shouldShowDropdown && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[420px] overflow-y-auto overscroll-contain rounded-xl border border-[#b7b2d7] bg-white shadow-xl">
                {isSearching ? (
                  <p className="px-4 py-4 text-sm font-medium text-[#6b648b]">
                    Searching...
                  </p>
                ) : suggestions.length > 0 ? (
                  <ul className="divide-y divide-[#eeecfb]">
                    {suggestions.map((product) => {
                      const thumbnail = product.images?.[0];
                      const productDetail =
                        product.description?.[0] || product.category;

                      return (
                        <li key={product._id || product.slug}>
                          <Link
                            to={`/product/${product.slug}`}
                            className="flex gap-3 px-3 py-3 transition hover:bg-[#f5f3ff]"
                            onClick={() => setSearchText("")}
                          >
                            {thumbnail ? (
                              <img
                                src={thumbnail}
                                alt={product.name}
                                className="h-12 w-12 shrink-0 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 shrink-0 rounded-md bg-[#eeecfb]" />
                            )}

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#2f2b78]">
                                {product.name}
                              </p>
                              <p className="mt-1 truncate text-xs leading-5 text-[#6b648b]">
                                {productDetail}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="px-4 py-4 text-sm font-medium text-[#6b648b]">
                    No products found
                  </p>
                )}
              </div>
            )}
          </form>

          <h1 className="text-center text-[1.85rem] font-semibold tracking-[-0.02em] text-[#4b45a3] sm:text-4xl md:flex-1 md:text-right">
            {category}
          </h1>
        </div>

        <div className="h-[2px] w-full bg-[#6b648b]" />
      </div>
    </section>
  );
};

export default ProductHeaderBar;
