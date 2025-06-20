"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, TrendingUp, X, Search, ArrowUp, ArrowDown, Save, Eye, GripVertical } from "lucide-react"

interface VideoData {
  id: string
  title: string
  description: string
  thumbnail?: string
  tags: string[]
  category: string
  uploadDate: string
  views: string
  duration: string
  position?: number
}

const VIDEO_CATEGORIES = [
  { id: "all", name: "All Categories" },
  { id: "entertainment", name: "Entertainment" },
  { id: "education", name: "Education" },
  { id: "music", name: "Music" },
  { id: "sports", name: "Sports" },
  { id: "gaming", name: "Gaming" },
  { id: "technology", name: "Technology" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "news", name: "News" },
  { id: "comedy", name: "Comedy" },
  { id: "documentary", name: "Documentary" },
  { id: "adult", name: "Adult Content" },
  { id: "other", name: "Other" },
]

export default function VideoCurationManager() {
  const [uploadedVideos, setUploadedVideos] = useState<VideoData[]>([])
  const [bestVideos, setBestVideos] = useState<VideoData[]>([])
  const [trendingVideos, setTrendingVideos] = useState<VideoData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      if (typeof window !== "undefined") {
        // Load uploaded videos
        const savedVideos = localStorage.getItem("uploadedVideos")
        if (savedVideos) {
          setUploadedVideos(JSON.parse(savedVideos))
        }

        // Load best videos
        const savedBestVideos = localStorage.getItem("bestVideos")
        if (savedBestVideos) {
          setBestVideos(JSON.parse(savedBestVideos))
        }

        // Load trending videos
        const savedTrendingVideos = localStorage.getItem("trendingVideos")
        if (savedTrendingVideos) {
          setTrendingVideos(JSON.parse(savedTrendingVideos))
        }
      }
    }

    loadData()
  }, [])

  // Filter available videos
  const filteredVideos = uploadedVideos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Add video to collection
  const addToCollection = (video: VideoData, collection: "best" | "trending") => {
    const targetCollection = collection === "best" ? bestVideos : trendingVideos
    const setTargetCollection = collection === "best" ? setBestVideos : setTrendingVideos

    // Check if video is already in collection
    if (targetCollection.find((v) => v.id === video.id)) {
      return
    }

    const newVideo = { ...video, position: targetCollection.length }
    setTargetCollection([...targetCollection, newVideo])
    setHasUnsavedChanges(true)
  }

  // Remove video from collection
  const removeFromCollection = (videoId: string, collection: "best" | "trending") => {
    const targetCollection = collection === "best" ? bestVideos : trendingVideos
    const setTargetCollection = collection === "best" ? setBestVideos : setTrendingVideos

    const updatedCollection = targetCollection
      .filter((v) => v.id !== videoId)
      .map((video, index) => ({ ...video, position: index }))

    setTargetCollection(updatedCollection)
    setHasUnsavedChanges(true)
  }

  // Move video position
  const moveVideo = (videoId: string, direction: "up" | "down", collection: "best" | "trending") => {
    const targetCollection = collection === "best" ? bestVideos : trendingVideos
    const setTargetCollection = collection === "best" ? setBestVideos : setTrendingVideos

    const currentIndex = targetCollection.findIndex((v) => v.id === videoId)
    if (currentIndex === -1) return

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= targetCollection.length) return

    const updatedCollection = [...targetCollection]
    const [movedVideo] = updatedCollection.splice(currentIndex, 1)
    updatedCollection.splice(newIndex, 0, movedVideo)

    // Update positions
    const reorderedCollection = updatedCollection.map((video, index) => ({
      ...video,
      position: index,
    }))

    setTargetCollection(reorderedCollection)
    setHasUnsavedChanges(true)
  }

  // Save changes
  const saveChanges = () => {
    localStorage.setItem("bestVideos", JSON.stringify(bestVideos))
    localStorage.setItem("trendingVideos", JSON.stringify(trendingVideos))
    setHasUnsavedChanges(false)

    // Dispatch storage event to update other components
    window.dispatchEvent(new Event("storage"))

    alert("Changes saved successfully!")
  }

  const isVideoInCollection = (videoId: string, collection: "best" | "trending") => {
    const targetCollection = collection === "best" ? bestVideos : trendingVideos
    return targetCollection.some((v) => v.id === videoId)
  }

  return (
    <div className="space-y-6">
      {/* Header with save button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Video Curation</h2>
          <p className="text-zinc-400">Manage Best Videos and Trending Videos collections</p>
        </div>
        {hasUnsavedChanges && (
          <Button onClick={saveChanges} className="bg-green-600 hover:bg-green-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <Tabs defaultValue="best" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-900 p-1 rounded-xl">
          <TabsTrigger
            value="best"
            className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-300 data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg"
          >
            <Star className="w-4 h-4" />
            Best Videos ({bestVideos.length})
          </TabsTrigger>
          <TabsTrigger
            value="trending"
            className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-300 data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg"
          >
            <TrendingUp className="w-4 h-4" />
            Trending Videos ({trendingVideos.length})
          </TabsTrigger>
          <TabsTrigger
            value="pool"
            className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-300 data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg"
          >
            <Eye className="w-4 h-4" />
            Video Pool ({uploadedVideos.length})
          </TabsTrigger>
        </TabsList>

        {/* Best Videos Tab */}
        <TabsContent value="best">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Best Videos Collection
              </CardTitle>
              <p className="text-sm text-zinc-400">Curated collection of highest quality videos</p>
            </CardHeader>
            <CardContent>
              {bestVideos.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
                  <p className="text-zinc-400">No videos in Best Videos collection yet</p>
                  <p className="text-zinc-500 text-sm">Add videos from the Video Pool tab</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bestVideos.map((video, index) => (
                    <div
                      key={video.id}
                      className="flex items-center gap-4 p-4 bg-zinc-800 border border-zinc-700 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-zinc-400" />
                        <Badge className="bg-yellow-500 text-white">#{index + 1}</Badge>
                      </div>

                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-16 h-12 object-cover rounded"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">{video.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <span>{video.views} views</span>
                          <span>•</span>
                          <span>{video.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveVideo(video.id, "up", "best")}
                          disabled={index === 0}
                          className="bg-zinc-700 border-zinc-600 text-zinc-300 hover:bg-zinc-600"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveVideo(video.id, "down", "best")}
                          disabled={index === bestVideos.length - 1}
                          className="bg-zinc-700 border-zinc-600 text-zinc-300 hover:bg-zinc-600"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCollection(video.id, "best")}
                          className="bg-red-900 border-red-700 text-red-300 hover:bg-red-800"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </div>
        </TabsContent>

        {/* Trending Videos Tab */}
        <TabsContent value="trending">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-500" />
                Trending Videos Collection
              </CardTitle>
              <p className="text-sm text-zinc-400">Currently trending videos based on engagement</p>
            </CardHeader>
            <CardContent>
              {trendingVideos.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
                  <p className="text-zinc-400">No videos in Trending Videos collection yet</p>
                  <p className="text-zinc-500 text-sm">Add videos from the Video Pool tab</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {trendingVideos.map((video, index) => (
                    <div
                      key={video.id}
                      className="flex items-center gap-4 p-4 bg-zinc-800 border border-zinc-700 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-zinc-400" />
                        <Badge className="bg-red-500 text-white">#{index + 1}</Badge>
                      </div>

                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-16 h-12 object-cover rounded"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">{video.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <span>{video.views} views</span>
                          <span>•</span>
                          <span>{video.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveVideo(video.id, "up", "trending")}
                          disabled={index === 0}
                          className="bg-zinc-700 border-zinc-600 text-zinc-300 hover:bg-zinc-600"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveVideo(video.id, "down", "trending")}
                          disabled={index === trendingVideos.length - 1}
                          className="bg-zinc-700 border-zinc-600 text-zinc-300 hover:bg-zinc-600"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCollection(video.id, "trending")}
                          className="bg-red-900 border-red-700 text-red-300 hover:bg-red-800"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </div>
        </TabsContent>

        {/* Video Pool Tab */}
        <TabsContent value="pool">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                Video Pool
              </CardTitle>
              <p className="text-sm text-zinc-400">All uploaded videos available for curation</p>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                    {VIDEO_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="text-white">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Video List */}
              {filteredVideos.length === 0 ? (
                <div className="text-center py-8">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
                  <p className="text-zinc-400">No videos found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredVideos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center gap-4 p-4 bg-zinc-800 border border-zinc-700 rounded-xl"
                    >
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-16 h-12 object-cover rounded"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">{video.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <span>{video.views} views</span>
                          <span>•</span>
                          <span>{video.duration}</span>
                          <span>•</span>
                          <Badge className="bg-zinc-700 text-zinc-300 text-xs">
                            {VIDEO_CATEGORIES.find((c) => c.id === video.category)?.name || video.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => addToCollection(video, "best")}
                          disabled={isVideoInCollection(video.id, "best")}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white disabled:bg-zinc-700 disabled:text-zinc-400"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          {isVideoInCollection(video.id, "best") ? "In Best" : "Add to Best"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => addToCollection(video, "trending")}
                          disabled={isVideoInCollection(video.id, "trending")}
                          className="bg-red-600 hover:bg-red-700 text-white disabled:bg-zinc-700 disabled:text-zinc-400"
                        >
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {isVideoInCollection(video.id, "trending") ? "In Trending" : "Add to Trending"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
