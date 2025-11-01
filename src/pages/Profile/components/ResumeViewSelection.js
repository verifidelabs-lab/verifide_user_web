import React from "react";
import Button from "../../../components/ui/Button/Button";
import { BiLeftArrowAlt } from "react-icons/bi";
import { FaFileAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ResumeViewSelection = ({ isOpen, onClose, title, userData }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    return (
        <div className="!fixed inset-0 z-50 flex items-center justify-center glassy-card">
            <div className="w-full max-w-md p-4 mx-auto glassy-card border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="md:text-sm text-xs font-semibold tracking-wide glassy-text-primary uppercase">
                        {title}
                    </h2>
                    <Button
                        onClick={onClose}
                        variant="primary" rounded="full"
                        children="Back"
                        icon={<BiLeftArrowAlt className="rotate-45" />}
                        className="hover:scale-105 transition-transform duration-200"
                    />
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="w-full p-4 mx-auto glassy-card border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-center cursor-pointer" onClick={() => navigate(`/user/resume/${userData.username}`)}>
                            <FaFileAlt className="text-2xl glassy-text-secondary mb-2" />
                            <span className="text-sm font-medium glassy-text-primary">Resume</span>
                        </div>

                        <div className="w-full p-4 mx-auto glassy-card border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-center cursor-pointer" onClick={() => navigate(`/user/profile/${userData.username}/${userData?.userId}`)}>
                            <FaUser className="text-2xl glassy-text-secondary mb-2" />
                            <span className="text-sm font-medium glassy-text-primary">Profile</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeViewSelection;
