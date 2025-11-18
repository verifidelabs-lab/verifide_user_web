// import { IoIosCheckmark } from "react-icons/io";

// const CustomToggle = ({ handleClick, isToggle }) => {
//   return (
//     <div className="flex">
//       <label className="relative inline-flex items-center w-11 h-6">
//         <input
//           type="checkbox"
//           className="sr-only peer glassy-input"
//           checked={isToggle}
//           readOnly
//            onClick={handleClick}
//         />
//         <div
         
//           className={`w-9 h-5 rounded-full  
//             peer-checked:glassy-text-primary transition-all duration-300 cursor-pointer`}
//         ></div>
//         <div
//           className={`absolute top-[4px] left-[1px] w-4 h-4 rounded-full flex items-center justify-center 
//             transition-all duration-300 transform ${
//               isToggle ? "translate-x-full  bg-blue-600 border-blue-600 glassy-text-primary" : "bg-blue-600 border-blue-600 glassy-card-header"
//             }`}
//         >
//           {isToggle && <IoIosCheckmark className="text-md" size={24} />}
//         </div>
//       </label>
//     </div>
//   );
// };

// export default CustomToggle;
import { IoIosCheckmark } from "react-icons/io";

const CustomToggle = ({ handleClick, isToggle }) => {
  return (
    <div className="flex px-2">
      <label className="relative inline-flex items-center w-11 h-6 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isToggle}
          onChange={handleClick}
        />

        {/* Toggle Track */}
        <div
          className={`w-11 h-6 rounded-full transition-all duration-300 border 
            ${isToggle 
              ? " border-blue-600" 
              : "bg-transparent border-blue-600"
            }
          `}
        ></div>

        {/* Toggle Thumb */}
        <div
          className={`absolute top-[2px] left-[2px] w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300
            ${isToggle 
              ? "translate-x-5 bg-blue-600 glassy-text-primary shadow-md" 
              : "bg-white border border-blue-600"
            }
          `}
        >
          {isToggle && <IoIosCheckmark size={18} />}
        </div>
      </label>
    </div>
  );
};

export default CustomToggle;
