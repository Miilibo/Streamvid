"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, LogOut, Shield, Grid, Cog, Edit } from "lucide-react"
import ChangePasswordModal from "@/src/components/admin/change-password-modal"
import SecurityDashboard from "@/src/components/admin/security-dashboard"
import type { VideoData, Category } from "@/src/types"
import { INITIAL_VIDEO_CATEGORIES } from "@/src/lib/constants"
import { getCategoryColor, getCategoryName } from "@/src/lib/utils"

const AdminDashboard: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"videos" | "security" | "settings">("videos")
  const [videos, setVideos] = useState<VideoData[]>([])
  const [newVideoTitle, setNewVideoTitle] = useState("")
  const [newVideoDescription, setNewVideoDescription] = useState("")
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [newVideoCategory, setNewVideoCategory] = useState<string>("Educational")
  const [videoCategories, setVideoCategories] = useState<Category[]>(INITIAL_VIDEO_CATEGORIES)
  const [isAddingNewVideo, setIsAddingNewVideo] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null)
  const [isEditingVideo, setIsEditingVideo] = useState(false)
  const [editedVideoTitle, setEditedVideoTitle] = useState("")
  const [editedVideoDescription, setEditedVideoDescription] = useState("")
  const [editedVideoUrl, setEditedVideoUrl] = useState("")
  const [editedVideoCategory, setEditedVideoCategory] = useState<string>("Educational")
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)

  useEffect(() => {
    // Fetch videos from local storage or an API endpoint
    const storedVideos = localStorage.getItem("videos")
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos))
    }
  }, [])

  useEffect(() => {
    // Save videos to local storage whenever the videos state changes
    localStorage.setItem("videos", JSON.stringify(videos))
  }, [videos])

  const handleLogout = () => {
    // Clear authentication token or session
    localStorage.removeItem("authToken")
    // Redirect to the login page
    router.push("/login")
  }

  const handleAddNewVideo = () => {
    setIsAddingNewVideo(true)
  }

  const handleSaveNewVideo = () => {
    if (newVideoTitle && newVideoDescription && newVideoUrl) {
      const newVideo: VideoData = {
        id: Date.now().toString(),
        title: newVideoTitle,
        description: newVideoDescription,
        url: newVideoUrl,
        category: newVideoCategory,
        uploadDate: new Date().toISOString(),
        views: 0,
        likes: 0,
        dislikes: 0,
      }
      setVideos([...videos, newVideo])
      setNewVideoTitle("")
      setNewVideoDescription("")
      setNewVideoUrl("")
      setNewVideoCategory("Educational")
      setIsAddingNewVideo(false)
    }
  }

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter((video) => video.id !== id))
    setSelectedVideo(null)
  }

  const handleEditVideo = (video: VideoData) => {
    setSelectedVideo(video)
    setIsEditingVideo(true)
    setEditedVideoTitle(video.title)
    setEditedVideoDescription(video.description)
    setEditedVideoUrl(video.url)
    setEditedVideoCategory(video.category)
  }

  const handleSaveEditedVideo = () => {
    if (selectedVideo) {
      const updatedVideo: VideoData = {
        ...selectedVideo,
        title: editedVideoTitle,
        description: editedVideoDescription,
        url: editedVideoUrl,
        category: editedVideoCategory,
      }
      setVideos(videos.map((video) => (video.id === selectedVideo.id ? updatedVideo : video)))
      setIsEditingVideo(false)
      setSelectedVideo(null)
    }
  }

  const handleCancelEdit = () => {
    setIsEditingVideo(false)
    setSelectedVideo(null)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-200 p-4">
        <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
        <ul>
          <li
            className={`mb-2 p-2 rounded cursor-pointer ${activeTab === "videos" ? "bg-gray-300" : ""}`}
            onClick={() => setActiveTab("videos")}
          >
            <Grid className="inline-block mr-2" size={16} />
            Video Management
          </li>
          <li
            className={`mb-2 p-2 rounded cursor-pointer ${activeTab === "security" ? "bg-gray-300" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Shield className="inline-block mr-2" size={16} />
            Security
          </li>
          <li
            className={`mb-2 p-2 rounded cursor-pointer ${activeTab === "settings" ? "bg-gray-300" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Cog className="inline-block mr-2" size={16} />
            Settings
          </li>
        </ul>
        <Button variant="destructive" className="mt-4 w-full" onClick={handleLogout}>
          <LogOut className="mr-2" size={16} />
          Logout
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {activeTab === "videos" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">Video Management</h1>
              <Button onClick={handleAddNewVideo}>Add New Video</Button>
            </div>

            {isAddingNewVideo && (
              <div className="mb-4 p-4 bg-white rounded shadow-md">
                <h2 className="text-lg font-semibold mb-2">Add New Video</h2>
                <div className="mb-2">
                  <Label htmlFor="newVideoTitle">Title</Label>
                  <Input
                    type="text"
                    id="newVideoTitle"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="newVideoDescription">Description</Label>
                  <Textarea
                    id="newVideoDescription"
                    value={newVideoDescription}
                    onChange={(e) => setNewVideoDescription(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="newVideoUrl">Video URL</Label>
                  <Input
                    type="text"
                    id="newVideoUrl"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="newVideoCategory">Category</Label>
                  <Select value={newVideoCategory} onValueChange={setNewVideoCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {videoCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSaveNewVideo}>Save Video</Button>
              </div>
            )}

            {isEditingVideo && selectedVideo && (
              <div className="mb-4 p-4 bg-white rounded shadow-md">
                <h2 className="text-lg font-semibold mb-2">Edit Video</h2>
                <div className="mb-2">
                  <Label htmlFor="editedVideoTitle">Title</Label>
                  <Input
                    type="text"
                    id="editedVideoTitle"
                    value={editedVideoTitle}
                    onChange={(e) => setEditedVideoTitle(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="editedVideoDescription">Description</Label>
                  <Textarea
                    id="editedVideoDescription"
                    value={editedVideoDescription}
                    onChange={(e) => setEditedVideoDescription(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="editedVideoUrl">Video URL</Label>
                  <Input
                    type="text"
                    id="editedVideoUrl"
                    value={editedVideoUrl}
                    onChange={(e) => setEditedVideoUrl(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="editedVideoCategory">Category</Label>
                  <Select value={editedVideoCategory} onValueChange={setEditedVideoCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {videoCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSaveEditedVideo}>Save</Button>
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div key={video.id} className="bg-white rounded shadow-md p-4">
                  <h3 className="text-lg font-semibold">{video.title}</h3>
                  <p className="text-gray-600">{video.description}</p>
                  <Badge
                    className="mt-2"
                    style={{ backgroundColor: getCategoryColor(video.category, videoCategories) }}
                  >
                    {getCategoryName(video.category, videoCategories)}
                  </Badge>
                  <div className="mt-2 flex justify-end space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEditVideo(video)}>
                      <Edit className="mr-2" size={16} />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteVideo(video.id)}>
                      <Trash2 className="mr-2" size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "security" && <SecurityDashboard onChangePassword={() => setShowChangePasswordModal(true)} />}

        {activeTab === "settings" && (
          <div>
            <h1 className="text-2xl font-semibold mb-4">Settings</h1>
            {/* Add settings content here */}
            <p>Customize your admin settings.</p>
          </div>
        )}
      </div>

      <ChangePasswordModal isOpen={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} />
    </div>
  )
}

export default AdminDashboard
