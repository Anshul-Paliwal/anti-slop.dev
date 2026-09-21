// Test fixture: Contains React anti-patterns for detection testing
// DO NOT clean up this file — it is used as test input

import React from 'react';

interface ListItem {
  id: string;
  name: string;
}

interface ListProps {
  items: ListItem[];
  onSelect: (id: string) => void;
}

// REACT-001: Inline object and function in JSX props
export function ItemList({ items, onSelect }: ListProps) {
  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          style={{ padding: '10px', border: '1px solid #ccc' }}
          onClick={() => onSelect(item.id)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
