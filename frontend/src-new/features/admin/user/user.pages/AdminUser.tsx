import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  useAdminUsers,
  useAdminUserMutations,
} from "@/features/admin/user/user.hook";
import { useDebounce } from "@/hooks/useBounce";
import { ConfirmDialog } from "@/components/ui/confirmModal";
import { Button } from "@/components/ui/button";
import type { User } from "@/features/admin/user/user.type";
import { useToast } from "@/context/toastContext";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const AdminUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") ?? "";

  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const { showToast } = useToast();

  const { data, isLoading, isFetching } = useAdminUsers({
    page,
    limit: 10,
    search: debouncedSearch,
    isDeleted:
      status === "deleted" ? true : status === "active" ? false : undefined,
  });

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

  const { deleteUser, restoreUser, isDeletingUser, isRestoringUser } =
    useAdminUserMutations();

  const users = data?.data.users ?? [];
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
    if (!pendingUser) return;

    try {
      if (pendingUser.isDeleted) {
        await restoreUser(pendingUser._id);
        showToast(`"${pendingUser.name}" has been restored`);
      } else {
        await deleteUser(pendingUser._id);
        showToast(`"${pendingUser.name}" has been deleted`);
      }
    } catch {
      showToast("Something went wrong. Please try again.");
    } finally {
      setPendingUser(null);
    }
  };

  const StatusBadge = ({ deleted }: { deleted: boolean }) => (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        deleted
          ? "bg-[#F0EDE6] text-[#8B8B85]"
          : "bg-green-50 text-green-700"
      }`}
    >
      {deleted ? "Deleted" : "Active"}
    </span>
  );

  const VerifiedBadge = ({ verified }: { verified: boolean }) => (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        verified
          ? "bg-[#FDEEE6] text-[#E8682F]"
          : "bg-[#F0EDE6] text-[#8B8B85]"
      }`}
    >
      {verified ? "Verified" : "Unverified"}
    </span>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-[#14151A]">Users</h1>
          <p className="mt-1 text-sm text-[#8B8B85]">
            Manage users registered on your platform.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All", value: "" },
            { label: "Active", value: "active" },
            { label: "Deleted", value: "deleted" },
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
            placeholder="Search by email..."
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
          Loading users...
        </p>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E5E2DA] bg-white py-12 text-center">
          <p className="text-[#8B8B85]">No users found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-xl border border-[#E5E2DA] bg-white md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#FAF8F4] text-xs uppercase tracking-wide text-[#8B8B85]">
                  <tr className="border-b border-[#E5E2DA]">
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Verified</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Joined</th>
                    <th className="px-6 py-4 font-semibold">
                      <div className="pl-10">Actions</div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-[#E5E2DA] transition hover:bg-[#FCFBF8] last:border-none"
                    >
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/user/${user._id}`}
                          className="font-medium text-[#14151A] hover:text-[#E8682F] hover:underline"
                        >
                          {user.name}
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-[#8B8B85]">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <VerifiedBadge verified={user.isEmailVerified} />
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge deleted={user.isDeleted} />
                      </td>

                      <td className="px-6 py-4 text-[#8B8B85]">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => setPendingUser(user)}
                            className="font-medium text-[#8B8B85] transition hover:text-red-500"
                          >
                            {user.isDeleted ? "Restore" : "Delete"}
                          </button>
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
            {users.map((user) => (
              <div
                key={user._id}
                className="w-full max-w-full rounded-xl border border-[#E5E2DA] bg-white"
              >
                <div className="p-4">
                  <Link
                    to={`/admin/user/${user._id}`}
                    className="text-base font-semibold text-[#14151A] hover:text-[#E8682F]"
                  >
                    {user.name}
                  </Link>

                  <div className="mt-4 grid grid-cols-[70px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
                    <span className="text-[#8B8B85]">Email</span>
                    <span className="break-words font-medium text-[#14151A]">
                      {user.email}
                    </span>

                    <span className="text-[#8B8B85]">Verified</span>
                    <VerifiedBadge verified={user.isEmailVerified} />

                    <span className="text-[#8B8B85]">Status</span>
                    <StatusBadge deleted={user.isDeleted} />

                    <span className="text-[#8B8B85]">Joined</span>
                    <span className="font-medium text-[#14151A]">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex border-t border-[#E5E2DA]">
                  <button
                    type="button"
                    onClick={() => setPendingUser(user)}
                    className="flex-1 py-3 text-sm font-medium text-[#8B8B85] transition hover:bg-red-50 hover:text-red-500"
                  >
                    {user.isDeleted ? "Restore" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-4 border-t border-[#E5E2DA] pt-6 sm:flex-row">
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
              <span className="font-medium">{totalPages}</span>
            </div>

            <Button
              type="button"
              variant="primary"
              className="px-3 py-2 text-sm sm:px-4 sm:py-2.5"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={!!pendingUser}
        title={pendingUser?.isDeleted ? "Restore user?" : "Delete user?"}
        message={
          pendingUser?.isDeleted
            ? `"${pendingUser?.name}" will regain access to their account.`
            : `"${pendingUser?.name}" will be soft-deleted and lose access to their account. This can be reversed later.`
        }
        confirmLabel={pendingUser?.isDeleted ? "Restore" : "Delete"}
        isLoading={isDeletingUser || isRestoringUser}
        onConfirm={handleConfirmToggle}
        onCancel={() => setPendingUser(null)}
      />
    </div>
  );
};

export default AdminUsers;