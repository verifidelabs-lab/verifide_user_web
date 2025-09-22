import React from "react";
import { IoCaretDownOutline, IoCaretUpOutline, IoClose } from "react-icons/io5";
import Button from "../Button/Button";

const TableSkeletonLoader = ({ columns, rows }) => (
  <div className="animate-pulse">
    <div className="border-b border-gray-200">
      <div className="flex">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1 p-4">
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="border-b border-gray-100">
        <div className="flex">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="flex-1 p-4">
              <div className="h-4 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const NoData = ({ message = "No Data found", description = "There are no data to display" }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <svg
      className="w-24 h-24 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
    <h3 className="mt-4 text-lg font-medium text-[#000000E6]">{message}</h3>
    <p className="mt-1 text-sm text-gray-500">{description}</p>
  </div>
);

const Table = ({
  tableHeadings = [],
  isHeaderCheckbox = false,
  showExtraHeading,
  data,
  sortColumn,
  sortDirection,
  handleSort,
  showTableSorting = true,
  totalData,
  totalSize,
  currentPage,
  onPageChange,
  loading = false,
  sortableColumns = [],
  keyWord, 
  setKeyword, 
  handleSearch, 
  handleRemoveSearch,
  emptyMessage = "No Data found",
  isLoading
}) => {
  return (
    <div className="w-full overflow-hidden">
      <div className="py-3 flex justify-between place-items-center">
        <div className="flex justify-start items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={keyWord}
              className="min-w-[250px] px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setKeyword(e.target.value)}
            />
            {
              keyWord ? <IoClose className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" onClick={handleRemoveSearch} /> : <svg
                className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            }
          </div>
          <Button variant="warning" onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <section className="w-full">
        <div className="w-full">
          {loading || isLoading ? (
            <TableSkeletonLoader
              columns={tableHeadings.length}
              rows={totalSize || 10}
            />
          ) : (
            <>
              <div className="hidden w-full border-b-[#E2E8F0] bg-[#FFFFFF] lg:block overflow-hidden overflow-x-auto overflow-y-auto">
                <table className="table-auto w-full text-sm text-gray-800 border-collapse bg-transparent border border-[#E2E8F0]">
                  <thead className="">
                    <tr className="border-b border-[#edeff1] bg-[#EEF0FA]">
                      {tableHeadings.map((heading, index) => (
                        <th
                          key={`heading-${index}`}
                          className={`px-4 py-4 font-medium text-left text-[#000000E6] whitespace-nowrap ${sortableColumns.includes(index)
                            ? "cursor-pointer"
                            : "cursor-default"
                            }`}
                          onClick={
                            sortableColumns.includes(index)
                              ? () => handleSort && handleSort(index)
                              : undefined
                          }
                        >
                          <div className="flex items-center gap-1">
                            {heading}
                            {sortableColumns.includes(index) &&
                              showTableSorting && (
                                <div className="flex flex-col">
                                  <IoCaretUpOutline
                                    size={8}
                                    className={`${sortColumn === index &&
                                      sortDirection === "asc"
                                      ? "text-blue-600"
                                      : "text-gray-400"
                                      }`}
                                  />
                                  <IoCaretDownOutline
                                    size={8}
                                    className={`${sortColumn === index &&
                                      sortDirection === "desc"
                                      ? "text-blue-600"
                                      : "text-gray-400"
                                      }`}
                                  />
                                </div>
                              )}
                          </div>
                        </th>
                      ))}
                      {showExtraHeading &&
                        [...Array(Math.max(0, 10 - tableHeadings.length))].map(
                          (_, index) => <th key={`extra-${index}`} className="p-2"></th>
                        )}
                    </tr>
                  </thead>
                  <tbody className="">
                    {data && Array.isArray(data) && data.length > 0 ? (
                      data.map((row, rowIndex) => (
                        <tr
                          key={`row-${rowIndex}`}
                          className="border-t border-[#edeff1] hover:bg-gray-100"
                        >
                          {row && Array.isArray(row) && row.length > 0 ? (
                            row.map((cell, cellIndex) => (
                              <td
                                key={`cell-${rowIndex}-${cellIndex}`}
                                className="px-4 py-4 align-top text-gray-700"
                              >
                                {cell}
                              </td>
                            ))
                          ) : (
                            <td
                              colSpan={
                                tableHeadings.length + (showExtraHeading ? 5 : 0)
                              }
                              className="p-2 text-center text-gray-500 whitespace-nowrap"
                            >
                              No Data Available
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={tableHeadings.length} className="py-12">
                          <NoData message={emptyMessage} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {data && data.length > 0 && (
                  <div className="flex justify-start items-center gap-4 text-sm text-gray-500 p-2">
                    <p>Total Records:</p>
                    <p>{totalData}</p>
                  </div>
                )}
              </div>
              
              {/* Mobile view */}
              <div className="mt-4 overflow-hidden lg:hidden">
                {data && Array.isArray(data) && data.length > 0 ? (
                  data.map((row, rowIndex) => (
                    <div
                      key={`mobile-row-${rowIndex}`}
                      className="p-4 mb-4 border border-gray-200 rounded-lg shadow-sm"
                    >
                      <div className="grid grid-cols-1 gap-3">
                        {row && Array.isArray(row) && row.length > 0 ? (
                          row.map((cell, cellIndex) => (
                            <div
                              key={`mobile-cell-${rowIndex}-${cellIndex}`}
                              className="flex justify-between items-center border-b pb-1 last:border-0"
                            >
                              <span className="text-xs font-medium text-gray-500 uppercase">
                                {tableHeadings[cellIndex] || `Field ${cellIndex + 1}`}
                              </span>
                              <span className="text-sm text-gray-800">
                                {cell || '-'}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="h-4 p-4 text-sm text-center text-gray-500">
                            No Data Available
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <NoData message={emptyMessage} />
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Table;