import React, { useState } from 'react';

interface FilterBarProps {
    onSearch: (query: string) => void;
    onFilter: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onSearch, onFilter }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilter(filter);
    };

    return (
        <div className="filter-bar">
            <form onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button type="submit">Search</button>
            </form>
            <form onSubmit={handleFilterSubmit}>
                <select value={filter} onChange={handleFilterChange}>
                    <option value="">Select Filter</option>
                    <option value="price">Price</option>
                    <option value="brand">Brand</option>
                    <option value="model">Model</option>
                </select>
                <button type="submit">Filter</button>
            </form>
        </div>
    );
};

export default FilterBar;