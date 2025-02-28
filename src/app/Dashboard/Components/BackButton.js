import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();

  return (
  
    <button
      onClick={() => router.back()}
      className={`font-sans text-sm font-semibold  px-5 h-10  border-[1px] rounded-lg border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500`}
    >
      Back
    </button>

  );
};

export default BackButton;
