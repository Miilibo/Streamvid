"use client"

import MainHeader from "@/src/components/layout/main-header"
import Link from "next/link"
import Image from "next/image"
import { Play, Video } from "lucide-react"
import { useState, useEffect } from "react"
import type { Category } from "@/src/types"
import { INITIAL_VIDEO_CATEGORIES } from "@/src/lib/constants"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // Load categories from localStorage (admin dashboard)
    const savedCategories = localStorage.getItem("videoCategories")
    const savedVideos = localStorage.getItem("uploadedVideos")

    let loadedCategories: Category[] = []

    if (savedCategories) {
      loadedCategories = JSON.parse(savedCategories)
    } else {
      // Use default categories if none are saved
      loadedCategories = INITIAL_VIDEO_CATEGORIES
    }

    // Calculate video counts for each category
    if (savedVideos) {
      const videos = JSON.parse(savedVideos)
      loadedCategories = loadedCategories.map((category) => ({
        ...category,
        videoCount: videos.filter((video: any) => video.category === category.id).length,
      }))
    }

    setCategories(loadedCategories)

    // Listen for category updates
    const handleCategoryUpdate = () => {
      const updatedCategories = localStorage.getItem("videoCategories")
      const updatedVideos = localStorage.getItem("uploadedVideos")

      if (updatedCategories) {
        let cats = JSON.parse(updatedCategories)

        // Update video counts
        if (updatedVideos) {
          const videos = JSON.parse(updatedVideos)
          cats = cats.map((category: Category) => ({
            ...category,
            videoCount: videos.filter((video: any) => video.category === category.id).length,
          }))
        }

        setCategories(cats)
      }
    }

    // Listen for storage changes and custom events
    window.addEventListener("storage", handleCategoryUpdate)
    window.addEventListener("categoryUpdate", handleCategoryUpdate)

    return () => {
      window.removeEventListener("storage", handleCategoryUpdate)
      window.removeEventListener("categoryUpdate", handleCategoryUpdate)
    }
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950">
      <MainHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Browse by Category</h1>
          <p className="text-xl text-zinc-400">Discover content organized by your interests</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="group cursor-pointer">
              <Link href={`/category/${category.id}`}>
                <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-800">
                  <Image
                    src={category.thumbnail || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    {category.videoCount || 0}
                  </div>
                </div>
              </Link>

              <div className="mt-3">
                <Link href={`/category/${category.id}`}>
                  <h3 className="font-medium text-white line-clamp-2 text-sm leading-5 group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-zinc-400 mb-4">No categories available</div>
            <p className="text-sm text-zinc-500">
              Categories will appear here once they are created in the admin dashboard.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
