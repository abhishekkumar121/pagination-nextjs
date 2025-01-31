"use client";
import { useState, useEffect, useCallback } from 'react';
import HotelCard from '../components/HotelCard';
import { hotels } from '../utils/dummyData';
import { Hotel } from '../types';

const Home = () => {
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(hotels); 
  const [visibleHotels, setVisibleHotels] = useState<Hotel[]>([]); 
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState<{
    minPrice: number | null;
    maxPrice: number | null;
    minRating: number | null;
    sortBy: string;
  }>({
    minPrice: null,
    maxPrice: null,
    minRating: null,
    sortBy: 'priceLowToHigh',
  });

  const loadMoreHotels = useCallback(() => {
    if (loading) return;

    setLoading(true);

    const newVisibleHotels = filteredHotels.slice(page * 10, (page + 1) * 10);
    setTimeout(() => {
      setVisibleHotels((prev) => [...prev, ...newVisibleHotels]); 
      setPage((prev) => prev + 1);
      setLoading(false);
    }, 1000);
  }, [filteredHotels, page, loading]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, sortBy: event.target.value });
  };

  const clearFilters = () => {
    setFilter({ minPrice: null, maxPrice: null, minRating: null, sortBy: 'priceLowToHigh' });
  };

  useEffect(() => {
    let filteredData = hotels.filter(
      (hotel) =>
        (filter.minPrice === null || hotel.price >= filter.minPrice) &&
        (filter.maxPrice === null || hotel.price <= filter.maxPrice) &&
        (filter.minRating === null || hotel.rating >= filter.minRating)
    );

    if (filter.sortBy === 'priceLowToHigh') {
      filteredData = filteredData.sort((a, b) => a.price - b.price);
    } else if (filter.sortBy === 'priceHighToLow') {
      filteredData = filteredData.sort((a, b) => b.price - a.price);
    } else if (filter.sortBy === 'ratingHighToLow') {
      filteredData = filteredData.sort((a, b) => b.rating - a.rating);
    }

    setFilteredHotels(filteredData);
    setVisibleHotels(filteredData.slice(0, 10));
    setPage(1);
  }, [filter]);


  useEffect(() => {
    const handleScroll = () => {
      const bottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
      if (bottom && !loading) {
        loadMoreHotels();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, loadMoreHotels]);

  return (
    <div className="container mx-auto p-6 bg-gray-500 min-h-screen">
    
      <div className="filters flex flex-col md:flex-row space-y-4 md:space-x-6 mb-8 p-4 bg-white rounded-xl shadow-lg sticky top-0 z-10 bg-opacity-90">
        <div className="flex items-center">
          <label className="mr-2 text-lg font-semibold text-gray-700">Min Price:</label>
          <input
            type="number"
            value={filter.minPrice === null ? '' : filter.minPrice}
            onChange={(e) =>
              setFilter({ ...filter, minPrice: e.target.value === '' ? null : +e.target.value })
            }
            className="border p-3 rounded-md bg-slate-300 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <label className="mr-2 text-lg font-semibold text-gray-700">Max Price:</label>
          <input
            type="number"
            value={filter.maxPrice === null ? '' : filter.maxPrice}
            onChange={(e) =>
              setFilter({ ...filter, maxPrice: e.target.value === '' ? null : +e.target.value })
            }
            className="border p-3 rounded-md bg-slate-300 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <label className="mr-2 text-lg font-semibold text-gray-700">Min Rating:</label>
          <input
            type="number"
            value={filter.minRating === null ? '' : filter.minRating}
            max={5}
            min={0}
            onChange={(e) =>
              setFilter({ ...filter, minRating: e.target.value === '' ? null : +e.target.value })
            }
            className="border p-3 rounded-md bg-slate-300 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <label className="mr-2 text-lg font-semibold text-gray-700">Sort By:</label>
          <select
            onChange={handleSortChange}
            value={filter.sortBy}
            className="border p-3 rounded-md bg-slate-300 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500"
          >
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="ratingHighToLow">Rating: High to Low</option>
          </select>
        </div>
        <button
          onClick={clearFilters}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all transform duration-300 ease-in-out"
        >
          Clear Filters
        </button>
      </div>

     
      <div className="featured-hotels mb-6">
        <h2 className="text-2xl font-semibold mb-4">Featured Hotels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleHotels.slice(0, 3).map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>

      
      <div className="hotel-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {visibleHotels.map((hotel) => (
          <div className="transition-all duration-500 ease-in-out transform hover:scale-105" key={hotel.id}>
            <HotelCard hotel={hotel} />
          </div>
        ))}
      </div>

     
      {loading && (
        <div className="text-center py-4 text-white animate-pulse">Loading...</div>
      )}
    </div>
  );
};

export default Home;
