import { IoIosCheckmark } from "react-icons/io";

const CustomToggle = ({ handleClick, isToggle }) => {
  return (
    <div className="flex">
      <label className="relative inline-flex items-center w-11 h-6">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isToggle}
          readOnly
           onClick={handleClick}
        />
        <div
         
          className={`w-9 h-5 rounded-full bg-[#E9E9EA] 
            peer-checked:bg-[#2563EB] transition-all duration-300 cursor-pointer`}
        ></div>
        <div
          className={`absolute top-[4px] left-[1px] w-4 h-4 rounded-full flex items-center justify-center 
            transition-all duration-300 transform ${
              isToggle ? "translate-x-full bg-white text-white" : "bg-white"
            }`}
        >
          {isToggle && <IoIosCheckmark className="text-md" size={24} />}
        </div>
      </label>
    </div>
  );
};

export default CustomToggle;