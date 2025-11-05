"use client";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { redirect } from "next/dist/server/api-utils";

export default function Profile() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!session) return <p>Please sign in!</p>;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setMessage(" Profile updated!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(" Failed to update");
      }
    } catch (error) {
      setMessage(" Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1> Profile</h1>
        <button
          onClick={() => signOut({callbackUrl: "/"})}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>

      <div
        style={{
          color: "#333",
          backgroundColor: "#f9fafb",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #e5e7eb",
        }}
      >
        <p style={{ marginBottom: "10px" }}>
          <strong>Email:</strong> {session.user?.email}
        </p>
        <p>
          <strong>Joined:</strong> {new Date().toLocaleDateString()}
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          style={{
            padding: "10px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />
      </div>

      {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "4px",
            backgroundColor: message.includes("✅") ? "#dcfce7" : "#fee2e2",
            color: message.includes("✅") ? "#166534" : "#991b1b",
          }}
        >
          {message}
        </div>
      )}

      <button
        onClick={handleUpdate}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>

      <Link href="/todos">
        <button
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Back to Todos
        </button>
      </Link>
    </div>
  );
}
