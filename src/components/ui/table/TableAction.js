import { BiEdit } from "react-icons/bi";
import { BsEye, BsTrash2 } from "react-icons/bs";

const ActionButtons = ({ onView, onEdit, onDelete }) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={onView}
      className="p-1 text-[#000000] hover:text-blue-600 transition-colors bg-[#F9F9F9] border rounded-full"
      title="View"
    >
      <BsEye size={16} title="View" />
    </button>
    <button
      onClick={onEdit}
      className="p-1 text-[#13B156] hover:text-green-600 transition-colors bg-[#F9F9F9] border rounded-full"
      title="Edit"
    >
      <BiEdit size={16} title="Edit" />
    </button>
    <button
      onClick={onDelete}
      className="p-1 text-[#FF0000] hover:text-red-600 transition-colors bg-[#F9F9F9] border rounded-full"
      title="Delete"
    >
      <BsTrash2 size={16} title="Delete" />
    </button>
  </div>
);

export default ActionButtons