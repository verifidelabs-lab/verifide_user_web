import React from "react";

import Button from "../../Button/Button";
import { BiLeftArrowAlt } from "react-icons/bi";



const Modal = ({
    isOpen,
    onClose,
    children,
    title,
    titleClassName = '',
    width = "50px"
}) => {


    return (
        <>
            <div
                className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out   ${isOpen ? "glassy-card-header bg-opacity-30 backdrop-blur-sm" :
                    "bg-transparent pointer-events-none"}  `} onClick={onClose} />

            <div className={`  fixed inset-y-0 right-0 h-full glassy-card-header shadow-xl z-50  transform transition-transform duration-300 ease-in-out
                         lg:w-[600px] md:w-[500px] w-md  ${isOpen ? "translate-x-0" : "translate-x-full"} `}
                style={!isOpen ? { pointerEvents: "none" } : {}}
            >
                <div className="flex items-center justify-between px-4 py-3 ">
                    <h2 className={`text-lg font-semibold text-gray-800 ${titleClassName}`}>{title}</h2>
                    <Button variant="zinc" rounded="full" icon={<BiLeftArrowAlt />} onClick={onClose}>
                        Back
                    </Button>
                </div>

                <div className="h-[calc(100%-64px)] overflow-y-auto p-4">{children}</div>
            </div>

        </>
    );
};

export default Modal;