import React, { useState, useEffect } from "react";
import styles from "./ProductManagement.module.css";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    basePrice: 0,
    category: "",
    variants: [
      {
        color: "",
        stock: 0,
        price: 0,
        images: {
          front: null,
          side: null,
          back: null,
        },
      },
    ],
  });
  console.log(products)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const BASE_API_URL = "http://localhost:3000/api/v3";

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_API_URL}/product`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
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
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle variant changes
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...newProduct.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [name]:
        name.includes("price") || name.includes("stock")
          ? Number(value)
          : value,
    };
    setNewProduct((prev) => ({
      ...prev,
      variants: updatedVariants,
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
        [angle]: file,
      },
    };
    setNewProduct((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));
  };

  // Add new variant
  const addVariant = () => {
    setNewProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: "",
          stock: 0,
          price: prev.basePrice || 0,
          images: {
            front: null,
            side: null,
            back: null,
          },
        },
      ],
    }));
  };

  // Remove variant
  const removeVariant = (index) => {
    const updatedVariants = [...newProduct.variants];
    updatedVariants.splice(index, 1);
    setNewProduct((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));
  };

  // Submit new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("basePrice", newProduct.basePrice);
    formData.append("category", newProduct.category);

    newProduct.variants.forEach((variant, index) => {
      formData.append(`variant${index}_color`, variant.color);
      formData.append(`variant${index}_stock`, variant.stock);
      formData.append(`variant${index}_price`, variant.price);
      if (variant.images.front)
        formData.append(`variant${index}_front`, variant.images.front);
      if (variant.images.side)
        formData.append(`variant${index}_side`, variant.images.side);
      if (variant.images.back)
        formData.append(`variant${index}_back`, variant.images.back);
    });

    try {
      const response = await fetch(`${BASE_API_URL}/product/create`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      const result = await response.json();
      setProducts((prev) => [...prev, result.product]);
      setShowAddForm(false);
      setSuccess("Product created successfully!");
      setNewProduct({
        name: "",
        description: "",
        basePrice: 0,
        category: "",
        variants: [
          {
            color: "",
            stock: 0,
            price: 0,
            images: {
              front: null,
              side: null,
              back: null,
            },
          },
        ],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_API_URL}/product/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        setProducts((prev) => prev.filter((product) => product._id !== id));
        setSuccess("Product deleted successfully!");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Filter products by search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [
    "all",
    ...new Set(products.map((product) => product.category)),
  ];

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Product Management</h1>
        <div className={styles.controls}>
          <div className={styles.searchFilter}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.categoryFilter}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button
            className={`${styles.primaryButton} ${
              showAddForm ? styles.cancelButton : ""
            }`}
            onClick={() => {
              setShowAddForm(!showAddForm);
              setError(null);
              setSuccess(null);
            }}
          >
            {showAddForm ? (
              <>
                <i className={`${styles.icon} fas fa-times`}></i> Cancel
              </>
            ) : (
              <>
                <i className={`${styles.icon} fas fa-plus`}></i> Add Product
              </>
            )}
          </button>
        </div>
      </header>

      {error && (
        <div className={styles.alertError}>
          <i className={`${styles.icon} fas fa-exclamation-circle`}></i>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.alertSuccess}>
          <i className={`${styles.icon} fas fa-check-circle`}></i>
          {success}
        </div>
      )}

      {showAddForm && (
        <div className={styles.formContainer}>
          <form className={styles.productForm} onSubmit={handleSubmit}>
            <h2 className={styles.formTitle}>
              <i className={`${styles.icon} fas fa-cube`}></i> Add New Product
            </h2>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <i className={`${styles.icon} fas fa-tag`}></i> Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <i className={`${styles.icon} fas fa-align-left`}></i>{" "}
                  Description
                </label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  required
                  rows="3"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <i className={`${styles.icon} fas fa-dollar-sign`}></i> Base
                  Price
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={newProduct.basePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <i className={`${styles.icon} fas fa-list`}></i> Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  list="categories"
                />
                <datalist id="categories">
                  {categories
                    .filter((c) => c !== "all")
                    .map((category) => (
                      <option key={category} value={category} />
                    ))}
                </datalist>
              </div>
            </div>

            <div className={styles.variantsSection}>
              <h3 className={styles.sectionTitle}>
                <i className={`${styles.icon} fas fa-palette`}></i> Product
                Variants
              </h3>

              {newProduct.variants.map((variant, index) => (
                <div key={index} className={styles.variantCard}>
                  <div className={styles.variantHeader}>
                    <h4>Variant #{index + 1}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeVariant(index)}
                      >
                        <i className={`${styles.icon} fas fa-trash`}></i> Remove
                      </button>
                    )}
                  </div>

                  <div className={styles.variantGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Color</label>
                      <input
                        type="text"
                        name="color"
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, e)}
                        className={styles.formInput}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Price</label>
                      <input
                        type="number"
                        name="price"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, e)}
                        min="0"
                        step="0.01"
                        className={styles.formInput}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, e)}
                        min="0"
                        className={styles.formInput}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.imageUploadSection}>
                    <h5 className={styles.subSectionTitle}>Product Images</h5>
                    <div className={styles.imageUploadGrid}>
                      <div className={styles.imageUpload}>
                        <label className={styles.fileUploadLabel}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(index, "front", e)
                            }
                            className={styles.fileInput}
                            required
                          />
                          <div className={styles.fileUploadButton}>
                            <i className={`${styles.icon} fas fa-camera`}></i>
                            {variant.images.front
                              ? "Change Front Image"
                              : "Upload Front Image"}
                          </div>
                          {variant.images.front && (
                            <span className={styles.fileName}>
                              {variant.images.front.name}
                            </span>
                          )}
                        </label>
                      </div>

                      <div className={styles.imageUpload}>
                        <label className={styles.fileUploadLabel}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(index, "side", e)
                            }
                            className={styles.fileInput}
                            required
                          />
                          <div className={styles.fileUploadButton}>
                            <i className={`${styles.icon} fas fa-camera`}></i>
                            {variant.images.side
                              ? "Change Side Image"
                              : "Upload Side Image"}
                          </div>
                          {variant.images.side && (
                            <span className={styles.fileName}>
                              {variant.images.side.name}
                            </span>
                          )}
                        </label>
                      </div>

                      <div className={styles.imageUpload}>
                        <label className={styles.fileUploadLabel}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(index, "back", e)
                            }
                            className={styles.fileInput}
                            required
                          />
                          <div className={styles.fileUploadButton}>
                            <i className={`${styles.icon} fas fa-camera`}></i>
                            {variant.images.back
                              ? "Change Back Image"
                              : "Upload Back Image"}
                          </div>
                          {variant.images.back && (
                            <span className={styles.fileName}>
                              {variant.images.back.name}
                            </span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className={styles.addVariantButton}
                onClick={addVariant}
              >
                <i className={`${styles.icon} fas fa-plus-circle`}></i> Add
                Another Variant
              </button>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => {
                  setShowAddForm(false);
                  setError(null);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className={`${styles.icon} fas fa-spinner fa-spin`}></i>{" "}
                    Saving...
                  </>
                ) : (
                  <>
                    <i className={`${styles.icon} fas fa-save`}></i> Save
                    Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>
          <i className={`${styles.icon} fas fa-boxes`}></i> Product Inventory
        </h2>

        {isLoading && !showAddForm ? (
          <div className={styles.loading}>
            <i className={`${styles.icon} fas fa-spinner fa-spin`}></i> Loading
            products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <i className={`${styles.icon} fas fa-box-open`}></i>
            <p>No products found</p>
            <button
              className={styles.primaryButton}
              onClick={() => setShowAddForm(true)}
            >
              <i className={`${styles.icon} fas fa-plus`}></i> Add Your First
              Product
            </button>
          </div>
        ) : (
          <div className={styles.productsTableContainer}>
            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Base Price</th>
                  <th>Variants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className={styles.productNameCell}>
                        <span className={styles.productName}>
                          {product.name}
                        </span>
                        <span className={styles.productDescription}>
                          {product.description.substring(0, 50)}...
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.categoryBadge}>
                        {product.category}
                      </span>
                    </td>
                    <td className={styles.priceCell}>
                      ${product.basePrice.toFixed(2)}
                    </td>
                    <td>
                      <div className={styles.variantsCell}>
                        {product.variants.map((variant, i) => (
                          <div key={i} className={styles.variantBadge}>
                            <span
                              className={styles.colorIndicator}
                              style={{
                                backgroundColor: variant.color || "#ccc",
                              }}
                            ></span>
                            {variant.color}
                            <span className={styles.variantDetails}>
                              (${variant.price.toFixed(2)}, Stock:{" "}
                              {variant.stock})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button
                          className={styles.editButton}
                          onClick={() => {
                            // You would implement edit functionality here
                            alert("Edit functionality to be implemented");
                          }}
                        >
                          <i className={`${styles.icon} fas fa-edit`}></i>
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(product._id)}
                        >
                          <i className={`${styles.icon} fas fa-trash`}></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
