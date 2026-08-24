import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section
      style={{
        minHeight: "80vh",
        padding: "80px 40px",
        textAlign: "center",
      }}
    >

      <p>
        NOVA STORE
      </p>

      <h1
        style={{
          fontSize: "56px",
          marginBottom: "20px",
        }}
      >
        Simple things,
        <br />
        beautifully chosen.
      </h1>

      <p
        style={{
          fontSize: "18px",
          marginBottom: "30px",
        }}
      >
        Welcome to NOVA.
      </p>

      <Link
        to="/shop"
        style={{
          display: "inline-block",
          padding: "14px 28px",
          background: "#111",
          color: "#fff",
          textDecoration: "none",
        }}
      >
        Explore Shop →
      </Link>

    </section>
  );
}