import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { urlConfig } from '../../config';

function SearchPage() {
    // ✅ Task 1: Define state variables
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6);
    const [searchResults, setSearchResults] = useState([]);

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    const navigate = useNavigate();

    // ✅ Task 2: Fetch all products on load
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = `${urlConfig.backendUrl}/api/gifts`;
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Fetch error:', error.message);
            }
        };

        fetchProducts();
    }, []);

    // ✅ Task 2: Handle search operation
    const handleSearch = async () => {
        const baseUrl = `${urlConfig.backendUrl}/api/search?`;
        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
            category: document.getElementById('categorySelect').value,
            condition: document.getElementById('conditionSelect').value,
        }).toString();

        try {
            const response = await fetch(`${baseUrl}${queryParams}`);
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Failed to fetch search results:', error);
        }
    };

    // ✅ Task 6: Navigate to gift details page
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            {/* ✅ Task 3: Category Dropdown */}
                            <label htmlFor="categorySelect">Category</label>
                            <select id="categorySelect" className="form-control my-1">
                                <option value="">All</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            {/* ✅ Task 3: Condition Dropdown */}
                            <label htmlFor="conditionSelect">Condition</label>
                            <select id="conditionSelect" className="form-control my-1">
                                <option value="">All</option>
                                {conditions.map(condition => (
                                    <option key={condition} value={condition}>{condition}</option>
                                ))}
                            </select>

                            {/* ✅ Task 4: Age Range Slider */}
                            <label htmlFor="ageRange">Less than {ageRange} years</label>
                            <input
                                type="range"
                                className="form-control-range"
                                id="ageRange"
                                min="1"
                                max="10"
                                value={ageRange}
                                onChange={e => setAgeRange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* ✅ Task 7: Search input */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by gift name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* ✅ Task 8: Search button */}
                    <div className="mb-4 text-end">
                        <button onClick={handleSearch} className="btn btn-primary">Search</button>
                    </div>

                    {/* ✅ Task 5: Display search results */}
                    <div className="search-results">
                        {searchResults.length > 0 ? (
                            searchResults.map(product => (
                                <div key={product.id} className="card mb-3">
                                    {product.image && (
                                        <img src={product.image} alt={product.name} className="card-img-top" />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">{product.description?.slice(0, 100)}...</p>
                                    </div>
                                    <div className="card-footer">
                                        <button onClick={() => goToDetailsPage(product.id)} className="btn btn-info">
                                            View More
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-info" role="alert">
                                No products found. Please revise your filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
