"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const categories = [
  { id: "all", name: "All", active: true },
  { id: "gaming", name: "Gaming" },
  { id: "music", name: "Music" },
  { id: "live", name: "Live" },
  { id: "news", name: "News" },
  { id: "sports", name: "Sports" },
  { id: "learning", name: "Learning" },
  { id: "fashion", name: "Fashion & Beauty" },
  { id: "podcasts", name: "Podcasts" },
  { id: "travel", name: "Travel" },
  { id: "cooking", name: "Cooking" },
  { id: "technology", name: "Technology" },
  { id: "fitness", name: "Fitness" },
  { id: "comedy", name: "Comedy" },
  { id: "entertainment", name: "Entertainment" },
]

export default function CategoryFilters() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <div className="w-full max-w-full overflow-hidden px-0 py-2.5">
      <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className={`
              whitespace-nowrap flex-shrink-0 transition-colors
              px-3 py-1.5 text-xs h-8 min-w-fit
              sm:px-4 sm:py-2 sm:text-sm sm:h-10
              ${
                activeCategory === category.id
                  ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-300"
                  : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
              }
            `}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
