"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Star } from "lucide-react"

export default function BestVideosGrid() {
  const [bestVideos, setBestVideos] = useState<any[]>([])

  // Load best videos from localStorage
  useEffect(() => {
    const loadBestVideos = () => {
      if (typeof window !== "undefined") {
        const savedBestVideos = localStorage.getItem("bestVideos")
        if (savedBestVideos) {
          setBestVideos(JSON.parse(savedBestVideos))
        }
      }
    }

    loadBestVideos()

    // Listen for storage changes to update when videos are curated
    const handleStorageChange = () => {
      loadBestVideos()
    }

    window.addEventListener("storage", handleStorageChange)

    // Also check periodically for updates (in case of same-tab updates)
    const interval = setInterval(loadBestVideos, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  if (bestVideos.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="w-16 h-16 mx-auto mb-4 text-zinc-400" />
        <h3 className="text-lg font-medium text-white mb-2">No best videos curated yet</h3>
        <p className="text-zinc-400">Admin can add videos to this collection from the dashboard</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {bestVideos.map((video, index) => (
        <div key={video.id} className="group cursor-pointer">
          <Link href={`/video/${video.id}`}>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-800">
              <Image
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {video.duration}
              </div>
              {/* Best Video Badge */}
              <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Star className="w-3 h-3" />#{index + 1}
              </div>
            </div>
          </Link>

          <div className="mt-3">
            <Link href={`/video/${video.id}`}>
              <h3 className="font-medium text-white line-clamp-2 text-sm leading-5 group-hover:text-blue-400 transition-colors">
                {video.title}
              </h3>
            </Link>

            <div className="mt-2 flex items-center gap-1 text-zinc-400 text-sm">
              <span>{video.views} views</span>
              <span>•</span>
              <span>{video.uploadTime || new Date(video.uploadDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
