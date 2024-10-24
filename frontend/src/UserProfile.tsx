// UserProfile.tsx
import React, { useState } from 'react';

const UserProfile: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      <div className="form-group">
        <label>Add New Category:</label>
        <input
          type="text"
          className="form-control"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleAddCategory}>
          Add Category
        </button>
      </div>

      <h3 className="mt-4">Your Categories</h3>
      <ul className="list-group">
        {categories.map((category, index) => (
          <li key={index} className="list-group-item">
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;