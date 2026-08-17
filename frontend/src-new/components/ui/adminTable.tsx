interface AdminTableProps {
  headers: string[];
  children: React.ReactNode;
  empty?: boolean;
  emptyMessage?: string;
}

const AdminTable = ({
  headers,
  children,
  empty = false,
  emptyMessage = "No data found.",
}: AdminTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E2DA] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#FAF8F4] text-xs uppercase tracking-wide text-[#8B8B85]">
            <tr className="border-b border-[#E5E2DA]">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {empty ? (
            <tbody>
              <tr>
                <td
                  colSpan={headers.length}
                  className="py-12 text-center text-sm text-[#8B8B85]"
                >
                  {emptyMessage}
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {children}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default AdminTable;