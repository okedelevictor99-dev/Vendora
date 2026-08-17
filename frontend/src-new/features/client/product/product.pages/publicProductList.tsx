

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/features/client/product/product.hook";
import { ProductCard } from "@/components/ui/productCard";
import { PageTransition } from "@/components/layout/pageTransition";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useBounce";
import ShopNavbar from "@/components/ui/shopNavbar";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const [searchInput, setSearchInput] = useState(search);
const debouncedSearch = useDebounce(searchInput, 500);

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useProducts({
    search,
    category,
    page,
    limit: 12,
  });

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    if (key !== "page") {
      next.delete("page");
    }

    setSearchParams(next);
  };

 useEffect(() => {
  if (debouncedSearch !== search) {
    updateParam("search", debouncedSearch);
  }
}, [debouncedSearch, search]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const products = data?.data.products ?? [];
  const totalPages = data?.data.totalPages ?? 1;
  const isSearching =
  isFetching && debouncedSearch.trim().length > 0

  return (
    <PageTransition>
      <ShopNavbar/>
      <div className="bg-[#FAF8F4] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-serif text-3xl text-[#14151A]">
            Shop all products
          </h1>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) =>
                  setSearchInput(e.target.value)
                }
                className="w-full rounded-lg border border-[#E5E2DA] bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-[#E8682F]"
              />

              {/* Search Icon */}
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8B8B85]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>

              {/* Loading Spinner */}
              {isSearching && (
                <svg
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#E8682F]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-20"
                  />
                  <path
                    fill="currentColor"
                    className="opacity-90"
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                  />
                </svg>
              )}
            </div>

            <select
              value={category}
              onChange={(e) =>
                updateParam("category", e.target.value)
              }
              className="rounded-lg border border-[#E5E2DA] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#E8682F]"
            >
              <option value="">All categories</option>
              <option value="Phones">Phones</option>
              <option value="Laptops">Laptops</option>
              <option value="Fashion">Fashion</option>
              <option value="Gaming">Gaming</option>
              <option value="Home">Home</option>
            </select>
          </div>
                    {isLoading && (
            <p className="mt-12 text-center text-sm text-[#8B8B85]">
              Loading products...
            </p>
          )}

          {isError && (
            <p className="mt-12 text-center text-sm text-red-500">
              Couldn't load products. Please try again.
            </p>
          )}

          {!isLoading && !isError && products.length === 0 && (
            <p className="mt-12 text-center text-sm text-[#8B8B85]">
              No products found.
            </p>
          )}

          {!isLoading && !isError && products.length > 0 && (
            <>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-[#8B8B85]">
                  Page {page} of {totalPages}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={page === 1}
                    onClick={() =>
                      updateParam("page", String(page - 1))
                    }
                  >
                    ← Previous
                  </Button>

                  <span className="text-sm text-[#8B8B85]">
                    Page{" "}
                    <span className="font-medium text-[#14151A]">
                      {page}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-[#14151A]">
                      {totalPages}
                    </span>
                  </span>

                  <Button
                    type="button"
                    variant="secondary"
                    disabled={page === totalPages}
                    onClick={() =>
                      updateParam("page", String(page + 1))
                    }
                  >
                    Next →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductList;