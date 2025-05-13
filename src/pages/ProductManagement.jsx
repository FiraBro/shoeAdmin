import React, { useState, useEffect } from 'react';
import styles from './ProductManagement.module.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    basePrice: 0,
    category: '',
    variants: [{
      color: '',
      stock: 0,
      price: 0,
      images: {
        front: null,
        side: null,
        back: null
      }
    }]
  });
  const BASE_API_URL = 'http://localhost:3000/api/v3'
  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_API_URL}/product`);
        console.log(response)
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle variant changes
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...newProduct.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [name]: name.includes('price') || name.includes('stock') ? Number(value) : value
    };
    setNewProduct(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  // Handle image upload
  const handleImageUpload = (variantIndex, angle, e) => {
    const file = e.target.files[0];
    const updatedVariants = [...newProduct.variants];
    updatedVariants[variantIndex] = {
      ...updatedVariants[variantIndex],
      images: {
        ...updatedVariants[variantIndex].images,
        [angle]: file
      }
    };
    setNewProduct(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  // Add new variant
  const addVariant = () => {
    setNewProduct(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: '',
          stock: 0,
          price: prev.basePrice,
          images: {
            front: null,
            side: null,
            back: null
          }
        }
      ]
    }));
  };

  // Remove variant
  const removeVariant = (index) => {
    const updatedVariants = [...newProduct.variants];
    updatedVariants.splice(index, 1);
    setNewProduct(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  // Submit new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('basePrice', newProduct.basePrice);
    formData.append('category', newProduct.category);

    newProduct.variants.forEach((variant, index) => {
      formData.append(`variant${index}_color`, variant.color);
      formData.append(`variant${index}_stock`, variant.stock);
      formData.append(`variant${index}_price`, variant.price);
      if (variant.images.front) formData.append(`variant${index}_front`, variant.images.front);
      if (variant.images.side) formData.append(`variant${index}_side`, variant.images.side);
      if (variant.images.back) formData.append(`variant${index}_back`, variant.images.back);
    });

    try {
      const response = await fetch(`${BASE_API_URL}/product/create`, {
        method: 'POST',
        body: formData,
      });
console.log(response)
      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const result = await response.json();
      setProducts(prev => [...prev, result.product]);
      setShowAddForm(false);
      setNewProduct({
        name: '',
        description: '',
        basePrice: 0,
        category: '',
        variants: [{
          color: '',
          stock: 0,
          price: 0,
          images: {
            front: null,
            side: null,
            back: null
          }
        }]
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_API_URL}/product/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        setProducts(prev => prev.filter(product => product._id !== id));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Product Management</h1>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <button 
        className={styles.addButton}
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Cancel' : 'Add New Product'}
      </button>

      {showAddForm && (
        <form className={styles.productForm} onSubmit={handleSubmit}>
          <h2>Add New Product</h2>
          
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Description:</label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Base Price:</label>
            <input
              type="number"
              name="basePrice"
              value={newProduct.basePrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <h3>Variants</h3>
          {newProduct.variants.map((variant, index) => (
            <div key={index} className={styles.variantGroup}>
              <h4>Variant {index + 1}</h4>
              
              <div className={styles.formGroup}>
                <label>Color:</label>
                <input
                  type="text"
                  name="color"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, e)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, e)}
                  min="0"
                  required
                />
              </div>
              
              <div className={styles.imageUploads}>
                <div className={styles.formGroup}>
                  <label>Front Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, 'front', e)}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Side Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, 'side', e)}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Back Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, 'back', e)}
                    required
                  />
                </div>
              </div>
              
              {index > 0 && (
                <button
                  type="button"
                  className={styles.removeVariant}
                  onClick={() => removeVariant(index)}
                >
                  Remove Variant
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            className={styles.addVariant}
            onClick={addVariant}
          >
            Add Another Variant
          </button>
          
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      )}
      
      <div className={styles.productList}>
        <h2>Products</h2>
        {isLoading && !showAddForm ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <table className={styles.productsTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Base Price</th>
                <th>Variants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.basePrice.toFixed(2)}</td>
                  <td>
                    <ul className={styles.variantList}>
                      {product.variants.map((variant, i) => (
                        <li key={i}>
                          {variant.color} (${variant.price.toFixed(2)}, Stock: {variant.stock})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;