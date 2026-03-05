export default function SearchBar({ searchTerm, sortOrder, onSearchChange, onSortChange }) {
    return (
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-2xl">
                        {/* Ô tìm kiếm */}
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Nhập tên bài học để tìm..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                value={searchTerm}
                                onChange={onSearchChange}
                            />
                            <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Dropdown Sort */}
                        <div className="relative min-w-[140px]">
                            <select
                                value={sortOrder}
                                onChange={onSortChange}
                                className="w-full pl-3 pr-8 py-2.5 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer font-medium text-gray-700"
                            >
                                <option value="newer">Mới nhất (Newer)</option>
                                <option value="older">Cũ nhất (Older)</option>
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
