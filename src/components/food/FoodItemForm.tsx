
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: string;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

interface FoodItemFormProps {
  editItem?: FoodItem | null;
  onSave?: () => void;
}

const FoodItemForm: React.FC<FoodItemFormProps> = ({ editItem, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setDescription(editItem.description);
      setCategory(editItem.category);
    } else {
      // Reset form when not editing
      setName('');
      setDescription('');
      setCategory('');
    }
  }, [editItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (!user) return;

    const existingItems = JSON.parse(localStorage.getItem('foodItems') || '[]');

    if (editItem) {
      // Update existing item
      const updatedItems = existingItems.map((item: FoodItem) => 
        item.id === editItem.id 
          ? { ...item, name, description, category }
          : item
      );
      localStorage.setItem('foodItems', JSON.stringify(updatedItems));
      
      toast({
        title: "Success",
        description: "Food item updated successfully!",
      });
    } else {
      // Create new item
      const newItem: FoodItem = {
        id: Date.now().toString(),
        name,
        description,
        category,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        createdAt: new Date().toISOString()
      };

      existingItems.push(newItem);
      localStorage.setItem('foodItems', JSON.stringify(existingItems));

      toast({
        title: "Success",
        description: "Food item added successfully!",
      });
    }

    // Reset form
    setName('');
    setDescription('');
    setCategory('');

    // Dispatch custom event to update table
    window.dispatchEvent(new Event('foodItemAdded'));
    
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-700 p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        {editItem ? 'Edit Food Item' : 'Add New Food Item'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Item Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              placeholder="Enter food item name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">Category</Label>
            <Input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              placeholder="e.g., Appetizer, Main Course"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 min-h-[100px]"
            placeholder="Describe your food item..."
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          {editItem ? 'Update Food Item' : 'Add Food Item'}
        </Button>
      </form>
    </div>
  );
};

export default FoodItemForm;
