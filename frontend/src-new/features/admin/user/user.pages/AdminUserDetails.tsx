
import { Link, useParams } from "react-router-dom";
import { isAxiosError } from "axios";

import { useAdminUser } from "@/features/admin/user/user.hook";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

const StatusBadge = ({ deleted }: { deleted: boolean }) => (
  <span
    className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
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
    className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
      verified
        ? "bg-[#FDEEE6] text-[#E8682F]"
        : "bg-[#F0EDE6] text-[#8B8B85]"
    }`}
  >
    {verified ? "Verified" : "Unverified"}
  </span>
);

const AdminUserDetails = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useAdminUser(id ?? "");

  const notFound =
    isAxiosError(error) && error.response?.status === 404;

  if (isLoading) {
    return (
      <p className="py-10 text-center text-sm text-[#8B8B85]">
        Loading user...
      </p>
    );
  }

  if (notFound || !data?.data) {
    return (
      <div className="mx-4 rounded-xl border border-dashed border-[#E5E2DA] bg-white py-12 text-center sm:mx-0">
        <p className="text-[#8B8B85]">User not found.</p>

        <Link
          to="/admin/users"
          className="mt-3 inline-block font-medium text-[#E8682F] hover:underline"
        >
          Back to users
        </Link>
      </div>
    );
  }

  const user = data.data;

  return (
    <div className="w-full space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div>
        <Link
          to="/admin/users"
          className="text-sm font-medium text-[#8B8B85] hover:text-[#E8682F]"
        >
          ← Back to users
        </Link>

        <h1 className="mt-2 break-words font-serif text-2xl text-[#14151A]">
          {user.name}
        </h1>
      </div>

      {/* User details */}
      <div className="w-full overflow-hidden rounded-xl border border-[#E5E2DA] bg-white">
        {/* Email */}
        <div className="grid grid-cols-1 gap-1 border-b border-[#E5E2DA] px-4 py-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center sm:gap-x-4 sm:px-6">
          <span className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
            Email
          </span>

          <span className="min-w-0 break-words text-sm font-medium text-[#14151A]">
            {user.email}
          </span>
        </div>

        {/* Verified */}
        <div className="grid grid-cols-1 gap-1 border-b border-[#E5E2DA] px-4 py-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center sm:gap-x-4 sm:px-6">
          <span className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
            Verified
          </span>

          <VerifiedBadge verified={user.isEmailVerified} />
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 gap-1 border-b border-[#E5E2DA] px-4 py-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center sm:gap-x-4 sm:px-6">
          <span className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
            Status
          </span>

          <StatusBadge deleted={user.isDeleted} />
        </div>

        {/* Joined */}
        <div className="grid grid-cols-1 gap-1 px-4 py-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center sm:gap-x-4 sm:px-6">
          <span className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
            Joined
          </span>

          <span className="text-sm font-medium text-[#14151A]">
            {formatDate(user.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;

