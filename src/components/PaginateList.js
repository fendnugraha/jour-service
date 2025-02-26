import React from "react";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange, className }) => {
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Handle page change
    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            onPageChange(page); // Pass back the new page to the parent component
        }
    };

    // Generate the page numbers to display
    const generatePageNumbers = () => {
        const pageNumbers = [];
        const range = 2; // Number of pages to display before and after the current page

        if (totalPages <= 5) {
            // If there are less than or equal to 5 pages, display all pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show the first page
            pageNumbers.push(1);

            // Add ellipsis if necessary
            if (currentPage - range > 2) {
                pageNumbers.push("...");
            }

            // Add pages before and after the current page within the range
            for (let i = Math.max(2, currentPage - range); i <= Math.min(totalPages - 1, currentPage + range); i++) {
                pageNumbers.push(i);
            }

            // Add ellipsis if necessary
            if (currentPage + range < totalPages - 1) {
                pageNumbers.push("...");
            }

            // Always show the last page
            if (totalPages > 1) {
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    return (
        <>
            <div className={`flex sm:hidden justify-between text-xs items-center mt-3 ${className}`}>
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border border-slate-300 rounded-lg py-1 px-4 disabled:text-slate-300 disabled:border-slate-300"
                >
                    Prev
                </button>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border border-slate-300 rounded-lg py-1 px-4 disabled:text-slate-300 disabled:border-slate-300"
                >
                    Next
                </button>
            </div>
            <div className={`sm:flex justify-between hidden text-xs items-center mt-3 ${className}`}>
                <div className="w-1/2 text-slate-500">
                    <span>
                        {currentPage} of {totalPages}
                    </span>
                </div>

                <div className="flex justify-end items-center gap-1 w-1/2">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border border-slate-300 rounded-lg py-1 px-4 disabled:text-slate-300 disabled:border-slate-300"
                    >
                        Prev
                    </button>

                    {/* Render page numbers with ellipsis */}
                    <div className="flex gap-1">
                        {generatePageNumbers().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => (typeof page === "number" ? goToPage(page) : null)}
                                className={`border border-slate-300 rounded-lg py-1 px-3 ${currentPage === page ? "bg-slate-600 text-white scale-110" : ""}`}
                                disabled={page === "..."}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border border-slate-300 rounded-lg py-1 px-4 disabled:text-slate-300 disabled:border-slate-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default Pagination;
