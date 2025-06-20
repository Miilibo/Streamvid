"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Play } from "lucide-react"
import type { VideoData } from "@/src/types"

export default function VideoGrid() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load videos from localStorage
    const loadVideos = () => {
      if (typeof window !== "undefined") {
        const savedVideos = localStorage.getItem("uploadedVideos")
        if (savedVideos) {
          setVideos(JSON.parse(savedVideos))
        }
        setLoading(false)
      }
    }

    loadVideos()

    // Listen for storage changes
    const handleStorageChange = () => {
      loadVideos()
    }

    window.addEventListener("storage", handleStorageChange)
    const interval = setInterval(loadVideos, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-video bg-zinc-800 rounded-lg mb-3"></div>
            <div className="h-4 bg-zinc-800 rounded mb-2"></div>
            <div className="h-3 bg-zinc-800 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
          <Play className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No videos available</h3>
        <p className="text-zinc-400">Videos will appear here once they are uploaded</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {videos.map((video) => (
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
