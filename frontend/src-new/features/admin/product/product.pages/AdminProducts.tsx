import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  useAdminProducts,
  useAdminProductMutations,
} from "@/features/admin/product/product.hook";
import { useDebounce } from "@/hooks/useBounce";
import { ConfirmDialog } from "@/components/ui/confirmModal";
import { Button } from "@/components/ui/button";
import type { Product } from "@/features/client/product/product.type";
import { useToast } from "@/context/toastContext";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(price);

const AdminProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") ?? "";

  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const { showToast } = useToast();

  const {
    data,
    isLoading,
    isFetching,
  } = useAdminProducts({
    page,
    limit: 10,
    search: debouncedSearch,
    status:
      status === "active" || status === "inactive"
        ? status
        : undefined,
  });

  // Tracks whether the current in-flight fetch was actually caused by
  // debouncedSearch changing, as opposed to a refetch triggered by
  // something else (e.g. activate/deactivate invalidating the query).
  const lastFetchedSearch = useRef(debouncedSearch);
  const [isSearchFetching, setIsSearchFetching] = useState(false);

  useEffect(() => {
    if (debouncedSearch !== lastFetchedSearch.current) {
      setIsSearchFetching(true);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (!isFetching) {
      lastFetchedSearch.current = debouncedSearch;
      setIsSearchFetching(false);
    }
  }, [isFetching, debouncedSearch]);

  const {
    deactivateProduct,
    activateProduct,
    isDeactivatingProduct,
    isActivatingProduct,
  } = useAdminProductMutations();

  const products = data?.data.products ?? [];
  const totalPages = data?.data.totalPages ?? 1;

  const updateStatus = (value: string) => {
  const next = new URLSearchParams(searchParams);

  if (value) {
    next.set("status", value);
  } else {
    next.delete("status");
  }

  setPage(1);
  setSearch(""); // Clear search when changing status
  setSearchParams(next);
};

  const handleConfirmToggle = async () => {
    if (!pendingProduct) return;

    try {
      if (pendingProduct.isActive) {
        await deactivateProduct(pendingProduct._id);
        showToast(`"${pendingProduct.name}" has been deactivated`);
      } else {
        await activateProduct(pendingProduct._id);
        showToast(`"${pendingProduct.name}" has been activated`);
      }
    } catch {
      showToast("Something went wrong. Please try again.");
    } finally {
      setPendingProduct(null);
    }
  };

  const StatusBadge = ({ active }: { active: boolean }) => (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-green-50 text-green-700"
          : "bg-[#F0EDE6] text-[#8B8B85]"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-[#14151A]">
            Products
          </h1>

          <p className="mt-1 text-sm text-[#8B8B85]">
            Manage products available in your store.
          </p>
        </div>

        <Link to="/admin/products/new">
          <Button className="w-full sm:w-auto">
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All", value: "" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => updateStatus(filter.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                status === filter.value
                  ? "bg-[#E8682F] text-white"
                  : "border border-[#E5E2DA] bg-white text-[#8B8B85] hover:bg-[#F7F4EE]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-[#E5E2DA] bg-white py-2.5 pl-4 pr-10 text-sm outline-none transition focus:border-[#E8682F]"
          />

          {isSearchFetching && search.trim().length > 0 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#E8682F] border-t-transparent" />
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-[#8B8B85]">
          Loading products...
        </p>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E5E2DA] bg-white py-12 text-center">
          <p className="text-[#8B8B85]">
            No products found.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-xl border border-[#E5E2DA] bg-white md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#FAF8F4] text-xs uppercase tracking-wide text-[#8B8B85]">
                  <tr className="border-b border-[#E5E2DA]">
                    <th className="px-6 py-4 font-semibold">
                      Product
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Price
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Stock
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4  font-semibold">
                       <div className="pl-30">Actions</div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-[#E5E2DA] transition hover:bg-[#FCFBF8] last:border-none"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded-lg bg-[#F0EDE6]">
                            {product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-[#14151A]">
                              {product.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {formatPrice(product.price)}
                      </td>

                      <td className="px-6 py-4">
                        {product.stock}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge
                          active={product.isActive}
                        />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <div className=" pl-14 flex w-56">
                            <Link
                              to={`/admin/products/${product._id}/edit`}
                              className="w-16 font-medium text-[#E8682F] hover:underline"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() => setPendingProduct(product)}
                              className="w-24 text-left font-medium text-[#8B8B85] transition hover:text-red-500"
                            >
                              {product.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {products.map((product) => (
              <div
                key={product._id}
                className="w-full max-w-full  rounded-xl border border-[#E5E2DA] bg-white"
              >
                <div className="flex items-start gap-4 p-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#F0EDE6]">
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className=" text-base font-semibold text-[#14151A]">
                      {product.name}
                    </h3>

                    <div className="mt-4 grid grid-cols-[70px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
                      <span className="text-[#8B8B85]">
                        Price
                      </span>

                      <span className="font-medium break-words text-[#14151A]">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-[#8B8B85]">
                        Stock
                      </span>

                      <span className="font-medium text-[#14151A]">
                        {product.stock}
                      </span>

                      <span className="text-[#8B8B85]">
                        Status
                      </span>

                      <StatusBadge
                        active={product.isActive}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex border-t border-[#E5E2DA]">
                  <Link
                    to={`/admin/products/${product._id}/edit`}
                    className="flex-1 border-r border-[#E5E2DA] py-3 text-center text-sm font-medium text-[#E8682F] transition hover:bg-[#F8F5EF]"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => setPendingProduct(product)}
                    className="flex-1 py-3 text-sm font-medium text-[#8B8B85] transition hover:bg-red-50 hover:text-red-500"
                  >
                    {product.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex  items-center justify-between gap-4 border-t border-[#E5E2DA] pt-6 sm:flex-row">
            <Button
              type="button"
              variant="primary"
              className="px-3 py-2 text-sm sm:px-4 sm:py-2.5"
              disabled={page === 1 || isFetching}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <div className="text-sm text-[#8B8B85]">
              Page <span className="font-medium">{page}</span> of{" "}
              <span className="font-medium">
                {totalPages}
              </span>
            </div>

            <Button
              type="button"
              variant="primary"
              className="px-3 py-2 text-sm sm:px-4 sm:py-2.5"
              disabled={
                page >= totalPages || isFetching
              }
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={!!pendingProduct}
        title={
          pendingProduct?.isActive
            ? "Deactivate product?"
            : "Activate product?"
        }
        message={
          pendingProduct?.isActive
            ? `"${pendingProduct?.name}" will be hidden from the storefront. You can reactivate it anytime.`
            : `"${pendingProduct?.name}" will become visible on the storefront again.`
        }
        confirmLabel={
          pendingProduct?.isActive
            ? "Deactivate"
            : "Activate"
        }
        isLoading={
          isDeactivatingProduct ||
          isActivatingProduct
        }
        onConfirm={handleConfirmToggle}
        onCancel={() => setPendingProduct(null)}
      />
    </div>
  );
};

export default AdminProducts;