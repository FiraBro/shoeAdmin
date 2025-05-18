const BASE_API_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000/api/v3";

// Helper function to get the auth token (you might store it in localStorage, cookies, etc.)
const getAuthToken = () => {
  return localStorage.getItem("token"); // or however you store your token
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
    // Add other headers if needed
  };
};

export const fetchProducts = async () => {
  const response = await fetch(`${BASE_API_URL}/product`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const data = await response.json();
  return data.data.product;
};

export const createProduct = async (productData) => {
  const formData = new FormData();
  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("basePrice", productData.basePrice);
  formData.append("category", productData.category);

  productData.variants.forEach((variant, index) => {
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

  const response = await fetch(`${BASE_API_URL}/product/create`, {
    method: "POST",
    body: formData,
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create product");
  }

  return await response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${BASE_API_URL}/product/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

  return id; // Return the deleted product ID
};
