
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import FoodItemForm from '../food/FoodItemForm';
import FoodItemsTable from '../food/FoodItemsTable';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
  };

  const handleSave = () => {
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-white">Food Management Dashboard</h1>
                <p className="text-gray-300 mt-1">Welcome back, {user?.name}!</p>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content - Side by side layout */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Form */}
            <div>
              <FoodItemForm editItem={editingItem} onSave={handleSave} />
            </div>
            
            {/* Right side - Table */}
            <div>
              <FoodItemsTable onEdit={handleEdit} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
