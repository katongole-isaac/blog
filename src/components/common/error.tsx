import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaLeftLong } from "react-icons/fa6";

interface Props {
  error: { message?: string; cause?: { status: number } };
}
const BlogError: React.FC<Props> = ({ error }) => {
  const pathname = usePathname();

  return (
    <div className="py-5 px-4 gap-5 flex flex-col items-center justify-center">
      <div className=" text-white p-5 rounded-md backdrop-blur bg-rose-500/80">
        <p>{error?.message}</p>
      </div>
      <div className="text-center flex-1 ">
        {pathname === "/" ? (
          <div onClick={() => window.location.reload()} className="w-max text-blue-400 hover:underline hover:text-blue-500" role="button">
            <p>Reload</p>
          </div>
        ) : (
          <div className="flex gap-3 items-center ">
            <Link href="/" className="flex  gap-2 items-center w-max text-blue-400 hover:underline hover:text-blue-500">
              <FaLeftLong />
              <span>Back To Home Page </span>
            </Link>
            <span className="inline-block text-xl">|</span>
            <div onClick={() => window.location.reload()} className="w-max text-blue-400 hover:underline hover:text-blue-500" role="button">
              <p>Reload</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { BlogError };
