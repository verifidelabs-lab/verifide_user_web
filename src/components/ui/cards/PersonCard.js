import { BsPersonFillAdd, BsPersonFillCheck } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

const PersonCard = ({ person, handleConnect, handleConnectUser, isLoading, isConnected }) => {
  console.log("this is person", person)
  return (
    <div className="flex items-center justify-between p-2 transition-colors hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <img
          src={person?.logo_url || '/0684456b-aa2b-4631-86f7-93ceaf33303c.png'}
          alt={person.name}
          className="object-contain shadow lg:w-11 lg:h-11 md:w-10 md:h-10 border rounded-full cursor-pointer"
          onClick={() => handleConnect(person)}
        />
        <div className="break-all text-wrap">
          <h3
            className="font-medium lg:text-[16px] md:text-[14px] text-[12px] text-[#212121] capitalize cursor-pointer w-48"
            onClick={() => handleConnect(person)}
          >
            {person.name ? person.name : person?.first_name} {person?.last_name}
          </h3>
          <p className="lg:text-xs md:text-[10px] text-[11px] text-[#646464] w-44 break-words break-all">
            {person.headline || "Not specified"}
          </p>
        </div>
      </div>

      <button
        className={`p-2 transition-colors rounded-full flex items-center justify-center ${person?.userConnection || isConnected
          ? "text-green-600 bg-green-100 hover:bg-green-200"
          : "text-blue-600 bg-[#2563EB1A] hover:bg-[#2564eb48]"
          }`}
        onClick={() => handleConnectUser(person)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ImSpinner2 className="animate-spin" size={20} />
        ) : person?.userConnection || isConnected ? (
          <BsPersonFillCheck size={20} />
        ) : (
          <BsPersonFillAdd size={20} />
        )}
      </button>
    </div>
  );
};

export default PersonCard;

