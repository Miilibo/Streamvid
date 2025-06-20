"use client"

import type React from "react"

import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<Array<{ id: string; name: string; color: string }>>([])

  useEffect(() => {
    // Load categories from localStorage
    const loadCategories = () => {
      const savedCategories = localStorage.getItem("videoCategories")
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories))
      }
    }

    loadCategories()

    // Listen for category updates
    const handleStorageChange = () => {
      loadCategories()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("categoriesUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("categoriesUpdated", handleStorageChange)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">StreamHub</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 pr-10"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Secondary Navigation */}
        <div className="border-t border-zinc-800 py-3">
          <nav className="flex items-center space-x-6 overflow-x-auto">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors whitespace-nowrap px-3 py-2 rounded-md hover:bg-zinc-800"
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <Link
                href="/categories"
                className="text-gray-300 hover:text-white transition-colors whitespace-nowrap px-3 py-2 rounded-md hover:bg-zinc-800 flex items-center"
              >
                Categories
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {/* Categories Dropdown Menu */}
              {categories.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link
                      href="/categories"
                      className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-zinc-700 transition-colors"
                    >
                      All Categories
                    </Link>
                    <div className="border-t border-zinc-700 my-1"></div>
                    {categories.slice(0, 8).map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-zinc-700 transition-colors"
                      >
                        <span className="flex items-center">
                          <span
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></span>
                          {category.name}
                        </span>
                      </Link>
                    ))}
                    {categories.length > 8 && (
                      <Link
                        href="/categories"
                        className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors text-sm"
                      >
                        View all categories...
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/trending"
              className="text-gray-300 hover:text-white transition-colors whitespace-nowrap px-3 py-2 rounded-md hover:bg-zinc-800"
            >
              Trending Videos
            </Link>

            <Link
              href="/best-videos"
              className="text-gray-300 hover:text-white transition-colors whitespace-nowrap px-3 py-2 rounded-md hover:bg-zinc-800"
            >
              Best Videos
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-zinc-800">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-zinc-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/categories"
                className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-zinc-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              {/* Mobile Categories List */}
              {categories.length > 0 && (
                <div className="ml-4 space-y-2">
                  {categories.slice(0, 5).map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-zinc-800 text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: category.color }}></span>
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
              <Link
                href="/trending"
                className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-zinc-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Trending Videos
              </Link>
              <Link
                href="/best-videos"
                className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-zinc-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Best Videos
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
