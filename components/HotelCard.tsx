
import React from 'react';

const HotelCard = ({ hotel }: { hotel: { name: string; rating: number; price: number } }) => {
  return (
    <div className="bg-white p-6 m-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800">{hotel.name}</h3>
      <p className="text-gray-600">Rating: {hotel.rating} stars</p>
      <p className="text-gray-600">Price: {hotel.price}</p>
    </div>
  );
};

export default HotelCard;
