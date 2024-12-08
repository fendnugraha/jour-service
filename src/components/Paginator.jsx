export default function Paginator({ links, handleChangePage }) {
    return (
        <div className="flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => handleChangePage(links.prev_page_url)}
                    disabled={!links.prev_page_url}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                </button>
                <button
                    onClick={() => handleChangePage(links.next_page_url)}
                    disabled={!links.next_page_url}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between my-4">
                <div>
                    <p className="text-xs text-gray-700 p-1">
                        Showing
                        <span className="font-medium mx-1">{links.from}</span>
                        to
                        <span className="font-medium mx-1">{links.to}</span>
                        of
                        <span className="font-medium mx-1">{links.total}</span>
                        results
                    </p>
                </div>
                <div>
                    <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination">
                        {links.links && links.links.length > 1
                            ? links.links.map((link, index) => (
                                  <button
                                      key={index}
                                      onClick={() =>
                                          handleChangePage(link?.url)
                                      }
                                      disabled={!link.url}
                                      className={
                                          link.active
                                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-xs font-medium'
                                              : 'border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-xs font-medium'
                                      }>
                                      {link.label === '&laquo; Previous'
                                          ? '<'
                                          : link.label === 'Next &raquo;'
                                            ? '>'
                                            : link.label}
                                  </button>
                              ))
                            : null}
                    </nav>
                </div>
            </div>
        </div>
    )
}
