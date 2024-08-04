
import React from 'react';

function Side({ categories, onCategorySelect }) {
  const handleCategorySelect = (category) => {
    onCategorySelect(category.category_id);
  };

  return (
    <div>
      {categories.map(category => (
        <div key={category.category_id} onClick={() => handleCategorySelect(category)} className="cursor-pointer mb-[1rem]">
          {category.name}
          
        </div>
      ))}
    </div>
  );
}

export default Side;