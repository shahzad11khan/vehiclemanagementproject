// components/Card.js
// import Image from "next/image";
import Link from "next/link";

const Card = ({ image, company, companyId }) => {
  const handleCardClick = () => {
    if (typeof window === "undefined") return;
  
    try {
      localStorage.setItem("companyName", company || "");
      localStorage.setItem("companyID", companyId || "");
      localStorage.setItem("flag", "true");
      localStorage.setItem("Iscompanyselected", "Yes");
      console.log("Company details saved to localStorage.");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };
  

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border-2 border-gray-400">
      <Link href="/Dashboard/Home">
        <div onClick={handleCardClick}>
          <img
            src={image}
            alt={company}
            width={500}
            height={300}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold">{company}</h2>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
