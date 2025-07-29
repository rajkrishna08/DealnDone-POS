import React from 'react';

const ProductCard = ({ product, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(product)}
      className={`cursor-pointer border-2 rounded-lg p-4 transition-all hover:shadow-md ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 object-cover rounded-md mb-3"
      />
      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">SKU: {product.id}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-green-600">${product.price}</span>
        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
      </div>
    </div>
  );
};

export default ProductCard; 