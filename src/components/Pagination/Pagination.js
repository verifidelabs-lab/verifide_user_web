import React, { memo } from 'react'
import { LuChevronRight, LuChevronLeft } from "react-icons/lu";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    // const isTruncated = totalPages > maxPagesToShow 
    
    // Always show first page
    pageNumbers.push(1)
    
    // Determine range around current page
    let startPage = Math.max(2, currentPage - 1)
    let endPage = Math.min(totalPages - 1, currentPage + 1)
    
    // Add ellipsis if needed after first page
    if (currentPage > 3) {
      pageNumbers.push('...')
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pageNumbers.push(i)
      }
    }
    
    // Add ellipsis if needed before last page
    if (currentPage < totalPages - 2) {
      pageNumbers.push('...')
    }
    
    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }
    
    return pageNumbers
  }

  const pageNumbers = renderPageNumbers()

  return (
    <div className='flex items-center justify-between w-full max-w-full mx-auto my-4 px-4'>
 
      <button
        className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <LuChevronLeft className="glassy-text-secondary" />
      </button>

      {/* Page Numbers - Centered */}
      <div className="flex items-center space-x-1 mx-4">
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            className={`flex items-center justify-center w-10 h-10 rounded-full border ${page === '...' 
              ? 'border-transparent cursor-default' 
              : currentPage === page 
                ? 'border-blue-500 bg-blue-500 glassy-text-primary' 
                : 'border-gray-300 hover:bg-gray-100'}`}
            onClick={() => handlePageChange(page)}
            disabled={page === '...'}
            aria-label={page === '...' ? 'More pages' : `Page ${page}`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <LuChevronRight className="glassy-text-secondary" />
      </button>
    </div>
  )
}

export default memo(Pagination)