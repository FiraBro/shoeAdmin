import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ReviewManagement.module.css"; 

  const BASE_API_URL =
    import.meta.env.VITE_BASE_URL || "http://localhost:3000/api/v3";
const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/review/testimonials`
      );
      console.log(res);
      setTestimonials(res.data.data || []);
    } catch (error) {
      console.error("Failed to load testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?"))
      return;

    try {
      await axios.delete(`${BASE_API_URL}/review/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      alert("Failed to delete testimonial.");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  if (loading) return <p className={styles.loading}>Loading testimonials...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Manage Testimonials</h2>
      {testimonials.length === 0 ? (
        <p>No testimonials found.</p>
      ) : (
        <ul className={styles.reviewList}>
          {testimonials.map((item) => (
            <li key={item._id} className={styles.reviewItem}>
              <img
                src={`http://localhost:3000/uploads/userImage/${item.userId.userImage}`}
                alt={item.userId.name}
                className={styles.avatar}
              />

              <div className={styles.reviewContent}>
                <h4 className={styles.username}>{item.userId.name}</h4>
                <p className={styles.rating}>Rating: {item.rating}★</p>
                <p className={styles.title}>{item.title}</p>
                <p className={styles.comment}>{item.comment}</p>
                <p className={styles.title}>
                  Product: {item.productId?.name || "N/A"}
                </p>
                <button
                  onClick={() => deleteTestimonial(item._id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestimonialManagement;
