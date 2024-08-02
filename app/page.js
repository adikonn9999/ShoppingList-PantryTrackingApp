'use client';
import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Tabs, Tab, Modal, Button, TextField, IconButton, Snackbar, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { firestore } from '@/firebase';
import { collection, doc, getDocs, query, setDoc, deleteDoc } from 'firebase/firestore';

const categories = {
  Meats: ['bacon', 'chicken', 'ham', 'hot dogs', 'pork', 'sausages', 'turkey'],
  Dairy: ['butter', 'cheese', 'cream', 'milk', 'yogurt'],
  Vegetables: ['broccoli', 'carrots', 'lettuce', 'spinach', 'tomatoes'],
  Fruits: ['apples', 'bananas', 'oranges', 'strawberries', 'watermelon'],
  Beverages: ['coffee', 'juice', 'soda', 'tea', 'water'],
  Bakery: ['bagels', 'bread', 'croissants', 'donuts', 'muffins'],
};

const units = ['Unit', 'Pack', 'Bottle'];

export default function ShoppingList() {
  const [groceryList, setGroceryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [newItem, setNewItem] = useState({ category: '', name: '', quantity: '', unit: '' });

  useEffect(() => {
    const fetchGroceryList = async () => {
      const q = query(collection(firestore, 'groceries'));
      const querySnapshot = await getDocs(q);
      const groceries = querySnapshot.docs.map(doc => doc.data());
      setGroceryList(groceries);
    };
    fetchGroceryList();
  }, []);

  const handleCategoryChange = (_, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const addItem = async (e) => {
    e.preventDefault();
    const { category, name, quantity, unit } = newItem;
    const existingItemIndex = groceryList.findIndex(item => item.name === name && item.category === category && item.unit === unit);
    if (existingItemIndex >= 0) {
      const updatedGroceryList = [...groceryList];
      updatedGroceryList[existingItemIndex].quantity = String(Number(updatedGroceryList[existingItemIndex].quantity) + Number(quantity));
      setGroceryList(updatedGroceryList);
      await setDoc(doc(collection(firestore, 'groceries'), `${category}-${name}`), updatedGroceryList[existingItemIndex]);
      setSnackbarMessage(`${name} quantity updated`);
    } else {
      const itemDoc = doc(collection(firestore, 'groceries'), `${category}-${name}`);
      const newItemData = { category, name, quantity, unit };
      await setDoc(itemDoc, newItemData);
      setGroceryList([...groceryList, newItemData]);
      setSnackbarMessage(`${name} added to grocery list`);
    }
    setSnackbarOpen(true);
    handleModalClose();
  };

  const removeItem = async (category, name) => {
    const itemDoc = doc(collection(firestore, 'groceries'), `${category}-${name}`);
    await deleteDoc(itemDoc);
    setGroceryList(groceryList.filter(item => item.name !== name || item.category !== category));
    setSnackbarMessage(`${name} removed from grocery list`);
    setSnackbarOpen(true);
  };

  const handleQuantityChange = async (name, category, unit, quantity) => {
    const updatedGroceryList = groceryList.map(item => 
      item.name === name && item.category === category && item.unit === unit 
      ? { ...item, quantity } 
      : item
    );
    setGroceryList(updatedGroceryList);
    const itemDoc = doc(collection(firestore, 'groceries'), `${category}-${name}`);
    await setDoc(itemDoc, { name, category, unit, quantity });
  };

  const filteredItems = selectedCategory === 'All'
    ? groceryList
    : groceryList.filter(item => item.category === selectedCategory);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Inventory</Typography>
        </Toolbar>
      </AppBar>
      <Box padding={2}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab key="All" label="All" value="All" />
          {Object.keys(categories).map(category => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
        <Box marginTop={2}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleModalOpen}>
            Add Item
          </Button>
        </Box>
        <Modal open={modalOpen} onClose={handleModalClose}>
          <Box display="flex" flexDirection="column" padding={3} bgcolor="white" borderRadius={1} margin="auto" marginTop={5} width={400}>
            <Typography variant="h6" marginBottom={2}>Add New Item</Typography>
            <TextField
              select
              label="Category"
              name="category"
              value={newItem.category}
              onChange={handleInputChange}
              margin="normal"
              fullWidth
            >
              {Object.keys(categories).map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Item"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              margin="normal"
              fullWidth
            >
              {(newItem.category && categories[newItem.category]) ? categories[newItem.category].map(item => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              )) : (
                <MenuItem disabled>Select a category first</MenuItem>
              )}
            </TextField>
            <TextField
              label="Quantity"
              name="quantity"
              value={newItem.quantity}
              onChange={handleInputChange}
              margin="normal"
              fullWidth
            />
            <TextField
              select
              label="Unit"
              name="unit"
              value={newItem.unit}
              onChange={handleInputChange}
              margin="normal"
              fullWidth
            >
              {units.map(unit => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" color="primary" onClick={addItem} fullWidth>
              Add
            </Button>
          </Box>
        </Modal>
        <TableContainer component={Paper} marginTop={2} className="table-container">
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map(({ category, name, quantity, unit }) => (
                <TableRow key={`${category}-${name}`}>
                  <TableCell>{name}</TableCell>
                  <TableCell>
                    <TextField
                      value={quantity}
                      onChange={(e) => handleQuantityChange(name, category, unit, e.target.value)}
                      type="number"
                      inputProps={{ min: "0" }}
                      margin="dense"
                      style={{ width: '60px' }}
                      className="quantity-input"
                    />
                  </TableCell>
                  <TableCell>{unit}</TableCell>
                  <TableCell>
                    <IconButton color="secondary" onClick={() => removeItem(category, name)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          action={
            <IconButton size="small" color="inherit" onClick={handleSnackbarClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Box>
    </Box>
  );
}
