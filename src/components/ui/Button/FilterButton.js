import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

const FilterButton = () => {
  return (
    <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg hover:glassy-card w-auto sm:w-auto justify-center">
      <HiOutlineAdjustmentsHorizontal className="glassy-text-primary" size={21} />
      <span>Filter</span>
    </button>
  );
};

export default FilterButton;