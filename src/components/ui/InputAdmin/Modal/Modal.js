import React from "react";
import Button from "../../Button/Button";
import { BiLeftArrowAlt } from "react-icons/bi";

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  titleClassName = "",
  width = "600px",
}) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[2000] transition-opacity duration-300 ${
          isOpen
            ? "bg-black/30 backdrop-blur-sm"
            : "bg-transparent pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className={`fixed top-0 right-0 z-[2001] h-full shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        style={{ width: width }}
      >
        {/* Header */}

        {/* Content */}
        <div className="h-[calc(100%-64px)] overflow-y-auto p-4 glassy-card">
          <div className="flex items-center justify-between px-4 py-3  ">
            <h2
              className={`text-lg font-semibold glassy-text-primary ${titleClassName}`}
            >
              {title}
            </h2>
            <Button
              variant="primary"
              rounded="full"
              icon={<BiLeftArrowAlt />}
              onClick={onClose}
              className="glassy-button"
            >
              Back
            </Button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
// import React from "react";
// import Button from "../../Button/Button";
// import { BiLeftArrowAlt } from "react-icons/bi";

// const Modal = ({
//   isOpen,
//   onClose,
//   children,
//   title,
//   titleClassName = "",
//   width = "600px",
// }) => {
//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className={`fixed inset-0 z-[2000] transition-opacity duration-300 ${
//           isOpen
//             ? "bg-black/30 backdrop-blur-sm"
//             : "bg-transparent pointer-events-none opacity-0"
//         }`}
//         onClick={onClose}
//       />

//       {/* Modal panel */}
//       <div
//         className={`
//           fixed top-0 right-0 z-[2001] h-full shadow-xl transform transition-transform duration-300 ease-in-out
//           ${isOpen ? "translate-x-0" : "translate-x-full"}
//             md:w-[${width}]
//         `}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 md:border-none bg-white/30 backdrop-blur-sm sticky top-0 z-10">
//           <h2 className={`text-lg font-semibold glassy-text-primary ${titleClassName}`}>
//             {title}
//           </h2>
//           <Button
//             variant="primary"
//             rounded="full"
//             icon={<BiLeftArrowAlt />}
//             onClick={onClose}
//             className="glassy-button"
//           >
//             Back
//           </Button>
//         </div>

//         {/* Content */}
//         <div className="h-[calc(100%-64px)] overflow-y-auto p-4 glassy-card md:h-[calc(100%-64px)]">
//           {children}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Modal;
