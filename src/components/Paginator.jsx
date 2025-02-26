export default function Paginator({ links, handleChangePage }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1 p-4 flex justify-between sm:hidden">
                <button
                    onClick={() => handleChangePage(links?.prev_page_url)}
                    disabled={!links?.prev_page_url}
                    className="relative inline-flex min-w-24 items-center justify-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => handleChangePage(links?.next_page_url)}
                    disabled={!links?.next_page_url}
                    className="ml-3 relative inline-flex min-w-24 items-center justify-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between my-4">
                <div>
                    <p className="text-xs sm:text-sm text-gray-700 p-1">
                        Showing
                        <span className="font-medium mx-1">{links?.from}</span>
                        to
                        <span className="font-medium mx-1">{links?.to}</span>
                        of
                        <span className="font-medium mx-1">{links?.total}</span>
                        results
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {links?.links && links?.links?.length > 1
                            ? links?.links?.map((link, index) => (
                                  <button
                                      key={index}
                                      onClick={() => handleChangePage(link?.url)}
                                      disabled={!link.url}
                                      className={
                                          link.active
                                              ? "z-10 bg-indigo-500 text-white border-indigo-500 scale-110 relative inline-flex items-center px-2 py-1 rounded-sm border text-sm font-bold"
                                              : "border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-2 py-1 border text-xs font-medium"
                                      }
                                  >
                                      {link.label === "&laquo; Previous" ? (
                                          <svg
                                              className="h-5 w-5"
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                              aria-hidden="true"
                                          >
                                              <path
                                                  fillRule="evenodd"
                                                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                  clipRule="evenodd"
                                              />
                                          </svg>
                                      ) : link.label === "Next &raquo;" ? (
                                          <svg
                                              className="h-5 w-5"
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                              aria-hidden="true"
                                          >
                                              <path
                                                  fillRule="evenodd"
                                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                  clipRule="evenodd"
                                              />
                                          </svg>
                                      ) : (
                                          link.label
                                      )}
                                  </button>
                              ))
                            : null}
                    </nav>
                </div>
            </div>
        </div>
    );
}
