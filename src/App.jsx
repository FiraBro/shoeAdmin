import React from "react";
import ProductManagement from "./pages/ProductManagement";
import TestimonialManagement from "./pages/ReviewManagement";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AdminLayout from "./ui/AdminLayout";

const router = createBrowserRouter([
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/admin/products" replace />,
      },
      {
        path: "/admin/products",
        element: <ProductManagement />,
      },
      {
        path: "/admin/reviews",
        element: <TestimonialManagement />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
