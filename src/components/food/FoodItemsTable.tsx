
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

const FoodItemsTable: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    const loadFoodItems = () => {
      const items = JSON.parse(localStorage.getItem('foodItems') || '[]');
      setFoodItems(items);
    };

    loadFoodItems();

    // Listen for storage changes to update the table in real-time
    const handleStorageChange = () => {
      loadFoodItems();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when items are added
    const handleFoodItemAdded = () => {
      loadFoodItems();
    };
    
    window.addEventListener('foodItemAdded', handleFoodItemAdded);

    // Refresh every 1 second to catch localStorage changes from same tab
    const interval = setInterval(loadFoodItems, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('foodItemAdded', handleFoodItemAdded);
      clearInterval(interval);
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white">Food Items Database</h2>
        <p className="text-gray-400 mt-1">Total items: {foodItems.length}</p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-800/50">
              <TableHead className="text-gray-300 font-semibold">Item Name</TableHead>
              <TableHead className="text-gray-300 font-semibold">Category</TableHead>
              <TableHead className="text-gray-300 font-semibold">Description</TableHead>
              <TableHead className="text-gray-300 font-semibold">Price</TableHead>
              <TableHead className="text-gray-300 font-semibold">Added By</TableHead>
              <TableHead className="text-gray-300 font-semibold">Date Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foodItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                  No food items found. Add some items to get started!
                </TableCell>
              </TableRow>
            ) : (
              foodItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-gray-700 hover:bg-gray-800/30 transition-colors duration-200"
                >
                  <TableCell className="text-white font-medium">{item.name}</TableCell>
                  <TableCell className="text-gray-300">
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300 max-w-xs truncate" title={item.description}>
                    {item.description}
                  </TableCell>
                  <TableCell className="text-green-400 font-semibold">
                    ${item.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.userName}</span>
                      <span className="text-sm text-gray-400">{item.userEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {formatDate(item.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FoodItemsTable;
