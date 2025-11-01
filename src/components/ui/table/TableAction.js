import { BiEdit } from "react-icons/bi";
import { BsEye, BsTrash2 } from "react-icons/bs";
import { TbPasswordUser } from "react-icons/tb";
import { MdOutlineAssignmentInd } from "react-icons/md";
import { IoListSharp } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";

const ActionButtons = ({ onView, onEdit, onDelete,
  onUpdatePassword,
  showEditButton = true,
  showDeleteButton = true,
  showUpdatePasswordButton = false,
  showAssignButton = false,
  onAssign,
  onList,
  showEye = true,
  showListButton = false, 
showPermission=false,
onPermission
}) => (
  <div className="flex items-center space-x-2">
    {showEye && (
      <button
        onClick={onView}
        className="p-1 glassy-text-primary hover:text-blue-600 transition-colors glassy-card border rounded-full"
        title="View"
      >
        <BsEye size={16} title="View" />
      </button>
    )}
    {showEditButton && (
      <button
        onClick={onEdit}
        className="p-1 text-[#13B156] hover:text-green-600 transition-colors glassy-card border rounded-full"
        title="Edit"
      >
        <BiEdit size={16} title="Edit" />
      </button>
    )}
    {showDeleteButton && (
      <button
        onClick={onDelete}
        className="p-1 text-[#FF0000] hover:text-red-600 transition-colors glassy-card border rounded-full"
        title="Delete"
      >
        <BsTrash2 size={16} title="Delete" />
      </button>
    )}
    {showUpdatePasswordButton && (
      <button
        onClick={onUpdatePassword}
        className="p-1 text-[#002fff] hover:text-blue-600 transition-colors glassy-card border rounded-full"
        title="Update Password"
      >
        <TbPasswordUser size={16} />
      </button>
    )}
    {showAssignButton && (
      <button
        onClick={onAssign}
        className="p-1 text-[#002fff] hover:text-blue-600 transition-colors glassy-card border rounded-full"
        title="Assign"
      >
        <MdOutlineAssignmentInd />
      </button>
    )}
    {showListButton && (
      <button
        onClick={onList}
        className="p-1 text-[#002fff] hover:text-blue-600 transition-colors glassy-card border rounded-full"
        title="List"
      >
        <IoListSharp size={16} />
      </button>
    )}
    {showPermission && (
      <button
        onClick={onPermission}
        className="p-1 text-[#116311a4] hover:text-blue-600 transition-colors glassy-card border rounded-full"
        title="List"
      >
        <GrUserAdmin size={16} />
      </button>
    )}
  </div>
);

export default ActionButtons