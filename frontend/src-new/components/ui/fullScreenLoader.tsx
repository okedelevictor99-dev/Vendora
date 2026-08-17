interface FullScreenLoaderProps {
  text?: string;
}

const FullScreenLoader = ({
  text = "Loading...",
}: FullScreenLoaderProps) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF8F4]">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#E8682F] border-t-transparent" />

        <p className="mt-5 text-sm font-medium text-[#14151A]">
          {text}
        </p>
      </div>
    </div>
  );
};

export default FullScreenLoader;