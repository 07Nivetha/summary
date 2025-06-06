'use client';
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Projects", href: "/projects" },
    { title: "Team", href: "/team" },
    { title: "Settings", href: "/settings" }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-gray-600 hover:text-gray-900 p-2"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed md:static
          inset-y-0 left-0
          w-64
          bg-white
          shadow-lg
          md:shadow-none
          transform
          transition-transform
          duration-300
          ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Summary App</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2 p-4">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link
              href="/profile"
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Profile Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Main content wrapper for mobile */}
      <main className={`
        flex-1
        md:ml-64
        transition-all
        duration-300
        ease-in-out
        ${isOpen ? "ml-64" : "ml-0"}
      `}>
        <div className="p-4">
          {/* Your main content will go here */}
        </div>
      </main>
    </div>
  );
}
