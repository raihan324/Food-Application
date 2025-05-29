
import React, { useState } from 'react';
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
  price: number;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

const FoodItemForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !category || !price) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (!user) return;

    const newItem: FoodItem = {
      id: Date.now().toString(),
      name,
      description,
      category,
      price: parseFloat(price),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      createdAt: new Date().toISOString()
    };

    const existingItems = JSON.parse(localStorage.getItem('foodItems') || '[]');
    existingItems.push(newItem);
    localStorage.setItem('foodItems', JSON.stringify(existingItems));

    // Reset form
    setName('');
    setDescription('');
    setCategory('');
    setPrice('');

    toast({
      title: "Success",
      description: "Food item added successfully!",
    });
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-700 p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Add New Food Item</h2>
      
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
        
        <div className="space-y-2">
          <Label htmlFor="price" className="text-white">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Add Food Item
        </Button>
      </form>
    </div>
  );
};

export default FoodItemForm;
