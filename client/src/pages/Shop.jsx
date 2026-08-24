import { useState } from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Essential Tote",
    category: "Accessories",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    name: "Classic Sneakers",
    category: "Footwear",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    name: "Minimal Watch",
    category: "Accessories",
    price: 3299,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    name: "Everyday Jacket",
    category: "Clothing",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 5,
    name: "Leather Wallet",
    category: "Accessories",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 6,
    name: "Everyday Backpack",
    category: "Bags",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
  },
];

export default function Shop() {
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Clothing",
    "Footwear",
    "Accessories",
    "Bags",
  ];

  const filteredProducts =
    category === "All"
      ? products
      : products.filter(
          (product) =>
            product.category === category
        );

  return (
    <section className="shop-page">

      <div className="page-heading">

        <span className="eyebrow">
          NOVA COLLECTION
        </span>

        <h1>
          Shop everything.
        </h1>

        <p>
          Explore our complete collection of
          thoughtfully selected essentials.
        </p>

      </div>

      {/* CATEGORY NAVIGATION */}
      <div className="category-navigation">

        {categories.map((item) => (
          <button
            key={item}
            className={
              category === item
                ? "category-button active"
                : "category-button"
            }
            onClick={() =>
              setCategory(item)
            }
          >
            {item}
          </button>
        ))}

      </div>

      {/* PRODUCTS */}
      <div className="shop-grid">

        {filteredProducts.map((product) => (
          <Link
            to={`/product/${product.id}`}
            className="shop-product"
            key={product.id}
          >

            <div className="product-image">
              <img
                src={product.image}
                alt={product.name}
              />
            </div>

            <div className="product-information">

              <span>
                {product.category}
              </span>

              <h3>
                {product.name}
              </h3>

              <strong>
                ₹{product.price.toLocaleString()}
              </strong>

            </div>

          </Link>
        ))}

      </div>

    </section>
  );
}