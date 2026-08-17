import { Link } from "react-router-dom";
import { useAdminDashboardStats } from "@/features/admin/dashboard/dashboard.hook";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const ORDER_STATUS_STYLES: Record<string, string> = {
  initiated: "bg-[#F4F1EA] text-[#8B8B85]",
  paid: "bg-[#FFF1E6] text-[#D9711D]",
  failed: "bg-[#FBEAEA] text-[#C0392B]",
  cannot_fulfill: "bg-[#FBEAEA] text-[#C0392B]",
  shipped: "bg-[#EAF2FB] text-[#2E6DB4]",
  delivered: "bg-[#EAF7EE] text-[#2E9E5B]",
};

const MetricCard = ({
  label,
  value,
  isLoading,
  accent = false,
}: {
  label: string;
  value: string;
  isLoading: boolean;
  accent?: boolean;
}) => (
  <div className="rounded-xl border border-[#ECEAE2] bg-white p-5">
    <p className="text-sm text-[#8B8B85]">{label}</p>
    {isLoading ? (
      <div className="mt-2 h-7 w-20 animate-pulse rounded bg-[#F4F1EA]" />
    ) : (
      <p
        className={`mt-1 font-serif text-2xl ${
          accent ? "text-[#D9711D]" : "text-[#14151A]"
        }`}
      >
        {value}
      </p>
    )}
  </div>
);

const AdminDashboard = () => {
  const { data, isLoading } = useAdminDashboardStats();
  const stats = data?.data;

  const recentOrders = stats?.recentOrders ?? [];
  const lowStockProducts = stats?.lowStockProducts ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-[#14151A]">Dashboard</h1>
        <p className="mt-2 text-sm text-[#8B8B85]">
          Overview of your store's performance.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Revenue"
          value={formatCurrency(stats?.revenue ?? 0)}
          isLoading={isLoading}
          accent
        />
        <MetricCard
          label="Total Orders"
          value={String(stats?.totalOrders ?? 0)}
          isLoading={isLoading}
        />
        <MetricCard
          label="Total Users"
          value={String(stats?.totalUsers ?? 0)}
          isLoading={isLoading}
        />
        <MetricCard
          label="Low Stock Products"
          value={String(stats?.lowStockCount ?? 0)}
          isLoading={isLoading}
        />
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-[#ECEAE2] bg-white">
        <div className="flex items-center justify-between border-b border-[#ECEAE2] p-5">
          <h2 className="font-serif text-lg text-[#14151A]">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-[#D9711D] hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-[#F4F1EA]" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="p-5 text-sm text-[#8B8B85]">No orders yet.</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#8B8B85]">
                    <th className="px-5 py-3 font-normal">Reference</th>
                    <th className="px-5 py-3 font-normal">Customer</th>
                    <th className="px-5 py-3 font-normal">Amount</th>
                    <th className="px-5 py-3 font-normal">Status</th>
                    <th className="px-5 py-3 font-normal">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-t border-[#ECEAE2]">
                      <td className="px-5 py-3 text-[#14151A]">
                        <Link to={`/admin/orders/${order._id}`} className="hover:underline">
                          {order.reference}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-[#14151A]">{order.user.name}</td>
                      <td className="px-5 py-3 text-[#14151A]">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs capitalize ${
                            ORDER_STATUS_STYLES[order.status]
                          }`}
                        >
                          {order.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[#8B8B85]">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 p-5 md:hidden">
              {recentOrders.map((order) => (
                <Link
                  key={order._id}
                  to={`/admin/orders/${order._id}`}
                  className="block rounded-lg border border-[#ECEAE2] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#14151A]">
                        {order.reference}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-[#8B8B85]">
                        {order.user.name}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs capitalize ${
                        ORDER_STATUS_STYLES[order.status]
                      }`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-medium text-[#14151A]">
                      {formatCurrency(order.totalAmount)}
                    </span>
                    <span className="text-[#8B8B85]">{formatDate(order.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Low Stock */}
      <div className="rounded-xl border border-[#ECEAE2] bg-white">
        <div className="flex items-center justify-between border-b border-[#ECEAE2] p-5">
          <h2 className="font-serif text-lg text-[#14151A]">Low Stock</h2>
          <Link to="/admin/products" className="text-sm text-[#D9711D] hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-[#F4F1EA]" />
            ))}
          </div>
        ) : lowStockProducts.length === 0 ? (
          <p className="p-5 text-sm text-[#8B8B85]">All products are well stocked.</p>
        ) : (
          <ul className="divide-y divide-[#ECEAE2]">
            {lowStockProducts.map((product) => {
              const available = product.stock - product.reservedStock;
              return (
                <li key={product._id}>
                  <Link
                    to={`/admin/products/${product._id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-[#FCFBF8]"
                  >
                    <span className="min-w-0 truncate text-sm text-[#14151A]">
                      {product.name}
                    </span>
                    <span
                      className={`flex-shrink-0 text-sm ${
                        available <= 0 ? "text-[#C0392B]" : "text-[#D9711D]"
                      }`}
                    >
                      {available <= 0 ? "Out of stock" : `${available} left`}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;