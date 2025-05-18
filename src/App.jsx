import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AdminLayout from "./ui/AdminLayout";
import ProductManagement from "./pages/ProductManagement";
import TestimonialManagement from "./pages/ReviewManagement";
import AuthForm from "./pages/AuthForm";
import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin/login" replace />,
  },
  {
    path: "/admin/login",
    element: <AuthForm />,
  },
  {
    element: <PrivateRoute />, // Auth guard here
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/products" replace />,
          },
          {
            path: "/products", // Relative path
            element: <ProductManagement />,
          },
          {
            path: "/reviews", // Relative path
            element: <TestimonialManagement />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
