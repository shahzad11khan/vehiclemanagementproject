// components/Card.js
import Image from "next/image";
import Link from "next/link";

const Card = ({ id, image, company }) => {
  const handleCardClick = () => {
    // alert(company, id);
    // // Store company name and id in localStorage
    localStorage.setItem("companyName", company);
    // localStorage.setItem("companyId", id);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <Link href="/Dashboard/Home">
        <div onClick={handleCardClick}>
          <Image
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
