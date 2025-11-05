"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Todos() {
  const { data: session, status } = useSession();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user && (session.user as any)?.id) {
      fetchTodos();
    }
  }, [session]);

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      console.log("Fetch response:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch");
      }

      const data = await res.json();
      setTodos(data);
      setError("");
    } catch (err) {
      setError(`Failed to load todos: ${err}`);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) {
      setError("Please enter a task!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create");
      }

      setTitle("");
      setError("");
      await fetchTodos();
    } catch (err) {
      console.error("Add todo error:", err);
      setError(`Failed to add todo: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!res.ok) throw new Error("Failed to update");
      await fetchTodos();
    } catch (err) {
      console.error("Toggle error:", err);
      setError(`Failed to update todo: ${err}`);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchTodos();
    } catch (err) {
      console.error("Delete error:", err);
      setError(`Failed to delete todo: ${err}`);
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please sign in to manage todos!</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1> My Todos</h1>
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

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        >
           {error}
        </div>
      )}

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a new task..."
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        />
        <button
          onClick={addTodo}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {todos.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
           No todos yet. Add one to get started!
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.map((todo: any) => (
            <li
              key={todo.id}
              style={{
                padding: "12px",
                backgroundColor: "#f9fafb",
                marginBottom: "10px",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #e5e7eb",
              }}
            >
              <span
                onClick={() => toggleTodo(todo.id, todo.completed)}
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#999" : "#000",
                  cursor: "pointer",
                  paddingLeft: "10px",
                }}
              >
                {todo.completed ? "✅" : "⭕"} {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
