"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-800">
          Welcome to <span className="text-indigo-600">Taskify</span> 
        </h1>
        <p className="text-lg text-gray-600">
          Your simple, powerful todo app. Manage tasks, stay organized.
        </p>

        {!session ? (
          <div className="space-y-4">
            <button
              onClick={() => signIn("google")}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
            >
               Sign in with Google
            </button>
            <p className="text-sm text-gray-500">
              Quick login, no passwords needed!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xl text-gray-700">
              Hey,{" "}
              <span className="font-semibold">
                {session.user?.name || "friend"}
              </span>
              !
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/todos"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                 My Todos
              </Link>
              <Link
                href="/profile"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                 Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                 Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
