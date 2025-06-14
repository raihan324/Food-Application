
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

interface FoodItemsTableProps {
  onEdit: (item: FoodItem) => void;
}

const FoodItemsTable: React.FC<FoodItemsTableProps> = ({ onEdit }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [deleteItem, setDeleteItem] = useState<FoodItem | null>(null);

  const loadFoodItems = () => {
    const items = JSON.parse(localStorage.getItem('foodItems') || '[]');
    // Filter for today's orders only
    const today = new Date().toDateString();
    const todaysItems = items.filter((item: FoodItem) => {
      return new Date(item.createdAt).toDateString() === today;
    });
    setFoodItems(todaysItems);
  };

  useEffect(() => {
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

  const handleDelete = (item: FoodItem) => {
    const items = JSON.parse(localStorage.getItem('foodItems') || '[]');
    const updatedItems = items.filter((i: FoodItem) => i.id !== item.id);
    localStorage.setItem('foodItems', JSON.stringify(updatedItems));
    loadFoodItems();
    setDeleteItem(null);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Food Orders - ${today}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .no-data { text-align: center; color: #666; padding: 40px; }
          </style>
        </head>
        <body>
          <h1>Food Orders - ${today}</h1>
          ${foodItems.length === 0 ? 
            '<div class="no-data">No food orders for today</div>' :
            `<table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Description</th>
                  <th>User Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                ${foodItems.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.description || 'No description'}</td>
                    <td>${item.userName}</td>
                    <td>${item.userEmail}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>`
          }
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Today's Food Orders</h2>
          <div className="flex items-center gap-4">
            <p className="text-gray-400">Total items: {foodItems.length}</p>
            <Button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Print List
            </Button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-800/50">
              <TableHead className="text-gray-300 font-semibold">Item Name</TableHead>
              <TableHead className="text-gray-300 font-semibold">Description</TableHead>
              <TableHead className="text-gray-300 font-semibold">Date Added</TableHead>
              <TableHead className="text-gray-300 font-semibold w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foodItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-400 py-8">
                  No food items found for today. Add some items to get started!
                </TableCell>
              </TableRow>
            ) : (
              foodItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-gray-700 hover:bg-gray-800/30 transition-colors duration-200"
                >
                  <TableCell className="text-white font-medium">{item.name}</TableCell>
                  <TableCell className="text-gray-300 max-w-xs truncate" title={item.description}>
                    {item.description || 'No description'}
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {formatDate(item.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-700">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-600">
                        <DropdownMenuItem 
                          onClick={() => onEdit(item)}
                          className="text-gray-300 hover:bg-gray-700 cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeleteItem(item)}
                          className="text-red-400 hover:bg-gray-700 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent className="bg-gray-800 border-gray-600">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This action cannot be undone. This will permanently delete the food item "{deleteItem?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-gray-300 hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteItem && handleDelete(deleteItem)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FoodItemsTable;
