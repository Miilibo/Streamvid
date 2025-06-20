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
import {
  Upload,
  X,
  Video,
  Trash2,
  LogOut,
  Shield,
  Grid,
  List,
  Tag,
  Key,
  Home,
  FileText,
  Palette,
  Cog,
  Target,
  Plus,
  Edit,
  Save,
} from "lucide-react"
import Link from "next/link"
import ChangePasswordModal from "./change-password-modal"
import SecurityDashboard from "./security-dashboard"
import VideoCurationManager from "./video-curation-manager"

// Interfaces
interface VideoData {
  id: string
  title: string
  description: string
  embedCode: string
  embedUrl: string
  previewUrl?: string
  thumbnail?: string
  thumbnailFile?: File
  tags: string[]
  category: string
  people: Array<{ id: string; name: string; role: string }>
  uploadDate: string
  views: string
  likes: string
  duration: string
  source?: string
  originalUrl?: string
}

interface Category {
  id: string
  name: string
  color: string
  thumbnail?: string
  videoCount?: number
}

// Initial categories data
const INITIAL_VIDEO_CATEGORIES: Category[] = [
  {
    id: "entertainment",
    name: "Entertainment",
    color: "bg-purple-500",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Entertainment",
  },
  {
    id: "education",
    name: "Education",
    color: "bg-blue-500",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Education",
  },
  { id: "music", name: "Music", color: "bg-green-500", thumbnail: "/placeholder.svg?height=200&width=300&text=Music" },
  {
    id: "sports",
    name: "Sports",
    color: "bg-orange-500",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Sports",
  },
  { id: "gaming", name: "Gaming", color: "bg-red-500", thumbnail: "/placeholder.svg?height=200&width=300&text=Gaming" },
  {
    id: "technology",
    name: "Technology",
    color: "bg-indigo-500",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Technology",
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    color: "bg-pink-500",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Lifestyle",
  },
  { id: "news", name: "News", color: "bg-gray-500", thumbnail: "/placeholder.svg?height=200&width=300&text=News" },
  {
    id: "comedy",
    name: "Comedy",
    color: "bg-yellow-500",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Comedy",
  },
  {
    id: "documentary",
    name: "Documentary",
    color: "bg-teal-500",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Documentary",
  },
  {
    id: "adult",
    name: "Adult Content",
    color: "bg-rose-600",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Adult",
  },
  { id: "other", name: "Other", color: "bg-slate-500", thumbnail: "/placeholder.svg?height=200&width=300&text=Other" },
]

const CUSTOM_WEBSITE_PATTERNS = [
  {
    name: "Pornhub",
    domain: "pornhub.com",
    patterns: [
      /^https?:\/\/(www\.)?pornhub\.com\/view_video\.php\?viewkey=([a-zA-Z0-9]+)/,
      /^https?:\/\/(www\.)?pornhub\.com\/embed\/([a-zA-Z0-9]+)/,
    ],
    embedTemplate: (id: string) => `https://www.pornhub.com/embed/${id}`,
    example: "https://www.pornhub.com/view_video.php?viewkey=VIDEO_ID",
  },
  {
    name: "XVideos",
    domain: "xvideos.com",
    patterns: [/^https?:\/\/(www\.)?xvideos\.com\/video(\d+)\//, /^https?:\/\/(www\.)?xvideos\.com\/embedframe\/(\d+)/],
    embedTemplate: (id: string) => `https://www.xvideos.com/embedframe/${id}`,
    example: "https://www.xvideos.com/video12345/",
  },
  {
    name: "RedTube",
    domain: "redtube.net",
    patterns: [
      /^https?:\/\/(www\.)?redtube\.com\/(\d+)/,
      /^https?:\/\/(www\.)?redtube\.net\/(\d+)/,
      /^https?:\/\/(www\.)?redtube\.com\/.*?\/(\d+)/,
      /^https?:\/\/(www\.)?redtube\.net\/.*?\/(\d+)/,
      /^https?:\/\/embed\.redtube\.net\/\?id=(\d+)/,
    ],
    embedTemplate: (id: string) => `https://embed.redtube.net/?id=${id}`,
    example: "https://www.redtube.net/190774661 or https://www.redtube.com/12345",
    requiresDirectAccess: true,
  },
  {
    name: "Xhamster",
    domain: "xhamster.com",
    patterns: [
      /^https?:\/\/(www\.)?xhamster\.com\/videos\/[^/]+-(\d+)/,
      /^https?:\/\/(www\.)?xhamster\.com\/embed\/(\d+)/,
    ],
    embedTemplate: (id: string) => `https://xhamster.com/embed/${id}`,
    example: "https://xhamster.com/videos/video-title-12345",
  },
  {
    name: "SpankBang",
    domain: "spankbang.com",
    patterns: [
      /^https?:\/\/(www\.)?spankbang\.com\/([a-zA-Z0-9]+)\/video\//,
      /^https?:\/\/(www\.)?spankbang\.com\/([a-zA-Z0-9]+)\/embed\//,
    ],
    embedTemplate: (id: string) => `https://spankbang.com/${id}/embed/`,
    example: "https://spankbang.com/VIDEO_ID/video/",
  },
  {
    name: "YouPorn",
    domain: "youporn.com",
    patterns: [/^https?:\/\/(www\.)?youporn\.com\/watch\/(\d+)\//, /^https?:\/\/(www\.)?youporn\.com\/embed\/(\d+)/],
    embedTemplate: (id: string) => `https://www.youporn.com/embed/${id}`,
    example: "https://www.youporn.com/watch/12345/",
  },
  {
    name: "XNXX",
    domain: "xnxx.com",
    patterns: [
      /^https?:\/\/(www\.)?xnxx\.com\/video-([a-zA-Z0-9]+)\//,
      /^https?:\/\/(www\.)?xnxx\.com\/embedframe\/(\d+)/,
    ],
    embedTemplate: (id: string) => `https://www.xnxx.com/embedframe/${id}`,
    example: "https://www.xnxx.com/video-abc123/",
  },
  {
    name: "Lesbian8",
    domain: "lesbian8.com",
    patterns: [
      /^https?:\/\/(www\.)?lesbian8\.com\/videos\/(\d+)\/[^/]*\/?$/,
      /^https?:\/\/(www\.)?lesbian8\.com\/embed\/(\d+)/,
    ],
    embedTemplate: (id: string) => `https://www.lesbian8.com/embed/${id}`,
    example: "https://www.lesbian8.com/videos/597458/video-title/",
    requiresDirectAccess: true,
  },
  {
    name: "Generic Pattern",
    domain: "custom",
    patterns: [
      /^https?:\/\/([^/]+)\/(?:watch|video|v)\/([a-zA-Z0-9_-]+)/,
      /^https?:\/\/([^/]+)\/(?:watch|video|v)\?(?:v=|id=)([a-zA-Z0-9_-]+)/,
      /^https?:\/\/([^/]+)\/([a-zA-Z0-9_-]+)$/,
    ],
    embedTemplate: (id: string, domain?: string) => {
      if (domain) {
        return `https://${domain}/embed/${id}`
      }
      return id
    },
    example: "https://example.com/watch/VIDEO_ID or https://example.com/video/VIDEO_ID",
  },
]

const VIDEO_SOURCES = [
  {
    id: "youtube",
    name: "YouTube",
    color: "bg-red-500",
    description: "Paste YouTube video or playlist URL",
    placeholder: "https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID",
    patterns: [
      /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /^https?:\/\/(www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
    ],
    embedTemplate: (id: string, isPlaylist = false) =>
      isPlaylist ? `https://www.youtube.com/embed/videoseries?list=${id}` : `https://www.youtube.com/embed/${id}`,
  },
  {
    id: "vimeo",
    name: "Vimeo",
    color: "bg-blue-500",
    description: "Paste Vimeo video URL",
    placeholder: "https://vimeo.com/VIDEO_ID",
    patterns: [/^https?:\/\/(www\.)?vimeo\.com\/(\d+)/],
    embedTemplate: (id: string) => `https://player.vimeo.com/video/${id}`,
  },
  {
    id: "dailymotion",
    name: "Dailymotion",
    color: "bg-orange-500",
    description: "Paste Dailymotion video URL",
    placeholder: "https://www.dailymotion.com/video/VIDEO_ID",
    patterns: [/^https?:\/\/(www\.)?dailymotion\.com\/video\/([a-zA-Z0-9]+)/],
    embedTemplate: (id: string) => `https://www.dailymotion.com/embed/video/${id}`,
  },
  {
    id: "twitch",
    name: "Twitch",
    color: "bg-purple-500",
    description: "Paste Twitch video or clip URL",
    placeholder: "https://www.twitch.tv/videos/VIDEO_ID or https://clips.twitch.tv/CLIP_ID",
    patterns: [/^https?:\/\/(www\.)?twitch\.tv\/videos\/(\d+)/, /^https?:\/\/clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/],
    embedTemplate: (id: string, isClip = false) =>
      isClip
        ? `https://clips.twitch.tv/embed?clip=${id}&parent=localhost`
        : `https://player.twitch.tv/?video=${id}&parent=localhost`,
  },
  {
    id: "streamable",
    name: "Streamable",
    color: "bg-green-500",
    description: "Paste Streamable video URL",
    placeholder: "https://streamable.com/VIDEO_ID",
    patterns: [/^https?:\/\/(www\.)?streamable\.com\/([a-zA-Z0-9]+)/],
    embedTemplate: (id: string) => `https://streamable.com/e/${id}`,
  },
  {
    id: "wistia",
    name: "Wistia",
    color: "bg-teal-500",
    description: "Paste Wistia video URL",
    placeholder: "https://company.wistia.com/medias/VIDEO_ID",
    patterns: [/^https?:\/\/([a-zA-Z0-9-]+)\.wistia\.com\/medias\/([a-zA-Z0-9]+)/],
    embedTemplate: (id: string) => `https://fast.wistia.net/embed/iframe/${id}`,
  },
  {
    id: "direct",
    name: "Direct Video URL",
    color: "bg-gray-500",
    description: "Direct link to MP4, WebM, or other video files",
    placeholder: "https://example.com/video.mp4",
    patterns: [/^https?:\/\/.+\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)(\?.*)?$/i],
    embedTemplate: (url: string) => url,
  },
  {
    id: "custom",
    name: "Custom Website",
    color: "bg-indigo-500",
    description: "Paste video URL from any website - we'll convert it to embed format",
    placeholder: "https://example.com/watch/VIDEO_ID or https://example.com/video/12345",
    patterns: [],
    embedTemplate: (url: string) => url,
    isCustom: true,
  },
]

// Category Management Component
const CategoryManagement = ({ setVideoCategories }: { setVideoCategories: (categories: Category[]) => void }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("bg-gray-500")
  const [newCategoryThumbnail, setNewCategoryThumbnail] = useState<File | null>(null)
  const [newCategoryThumbnailPreview, setNewCategoryThumbnailPreview] = useState<string>("")

  const colorOptions = [
    { value: "bg-red-500", label: "Red", color: "bg-red-500" },
    { value: "bg-blue-500", label: "Blue", color: "bg-blue-500" },
    { value: "bg-green-500", label: "Green", color: "bg-green-500" },
    { value: "bg-yellow-500", label: "Yellow", color: "bg-yellow-500" },
    { value: "bg-purple-500", label: "Purple", color: "bg-purple-500" },
    { value: "bg-pink-500", label: "Pink", color: "bg-pink-500" },
    { value: "bg-indigo-500", label: "Indigo", color: "bg-indigo-500" },
    { value: "bg-teal-500", label: "Teal", color: "bg-teal-500" },
    { value: "bg-orange-500", label: "Orange", color: "bg-orange-500" },
    { value: "bg-gray-500", label: "Gray", color: "bg-gray-500" },
  ]

  // Load categories from localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem("videoCategories")
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      setCategories(INITIAL_VIDEO_CATEGORIES)
      localStorage.setItem("videoCategories", JSON.stringify(INITIAL_VIDEO_CATEGORIES))
    }
  }, [])

  // Save categories to localStorage and update main state
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("videoCategories", JSON.stringify(categories))
      // Update the main videoCategories state
      setVideoCategories(categories)
    }
  }, [categories, setVideoCategories])

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewCategoryThumbnail(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewCategoryThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory: Category = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, "-"),
      name: newCategoryName.trim(),
      color: newCategoryColor,
      thumbnail:
        newCategoryThumbnailPreview ||
        `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(newCategoryName)}`,
      videoCount: 0,
    }

    setCategories([...categories, newCategory])
    window.dispatchEvent(new Event("categoryUpdate"))
    setNewCategoryName("")
    setNewCategoryColor("bg-gray-500")
    setNewCategoryThumbnail(null)
    setNewCategoryThumbnailPreview("")
    setIsAddingCategory(false)
  }

  const updateCategory = (categoryId: string, newName: string, newColor: string, newThumbnail?: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, name: newName, color: newColor, thumbnail: newThumbnail || cat.thumbnail }
          : cat,
      ),
    )
    window.dispatchEvent(new Event("categoryUpdate"))
    setEditingCategory(null)
  }

  const deleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      setCategories(categories.filter((cat) => cat.id !== categoryId))
      window.dispatchEvent(new Event("categoryUpdate"))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Category Management</h3>
        <Button onClick={() => setIsAddingCategory(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Add Category Form */}
      {isAddingCategory && (
        <div className="bg-zinc-800 rounded-lg p-6">
          <h4 className="text-white font-medium mb-4">Add New Category</h4>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-zinc-400">Category Name</Label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="mt-2 bg-zinc-700 border-zinc-600 text-white"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-zinc-400">Color</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setNewCategoryColor(color.value)}
                    className={`w-8 h-8 rounded-full ${color.color} border-2 ${
                      newCategoryColor === color.value ? "border-white" : "border-zinc-600"
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-zinc-400">Thumbnail</Label>
              <div className="mt-2">
                {newCategoryThumbnailPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={newCategoryThumbnailPreview || "/placeholder.svg"}
                      alt="Category thumbnail preview"
                      width={200}
                      height={120}
                      className="rounded-lg object-cover border border-zinc-600"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        setNewCategoryThumbnail(null)
                        setNewCategoryThumbnailPreview("")
                      }}
                      className="absolute top-2 right-2 p-1 h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 bg-zinc-700"
                    onClick={() => document.getElementById("category-thumbnail-input")?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
                    <p className="text-sm text-zinc-400">Click to upload thumbnail</p>
                  </div>
                )}
                <input
                  id="category-thumbnail-input"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addCategory} className="bg-green-600 hover:bg-green-700">
                Add Category
              </Button>
              <Button
                onClick={() => {
                  setIsAddingCategory(false)
                  setNewCategoryName("")
                  setNewCategoryColor("bg-gray-500")
                  setNewCategoryThumbnail(null)
                  setNewCategoryThumbnailPreview("")
                }}
                variant="outline"
                className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600 border-zinc-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-zinc-800 rounded-lg overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={category.thumbnail || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-2 left-2 w-4 h-4 rounded-full ${category.color}`}></div>
            </div>
            <div className="p-4">
              {editingCategory === category.id ? (
                <EditCategoryForm
                  category={category}
                  onSave={updateCategory}
                  onCancel={() => setEditingCategory(null)}
                  colorOptions={colorOptions}
                />
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{category.name}</h4>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingCategory(category.id)}
                        size="sm"
                        variant="outline"
                        className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600 border-zinc-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteCategory(category.id)}
                        size="sm"
                        variant="outline"
                        className="bg-red-900/20 text-red-400 hover:bg-red-900/40 border-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400">ID: {category.id}</p>
                  <p className="text-xs text-zinc-400">Videos: {category.videoCount || 0}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const EditCategoryForm = ({ category, onSave, onCancel, colorOptions }: any) => {
  const [name, setName] = useState(category.name)
  const [color, setColor] = useState(category.color)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(category.thumbnail || "")

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-zinc-400">Category Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 bg-zinc-700 border-zinc-600 text-white"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-zinc-400">Color</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {colorOptions.map((colorOption: any) => (
            <button
              key={colorOption.value}
              type="button"
              onClick={() => setColor(colorOption.value)}
              className={`w-6 h-6 rounded-full ${colorOption.color} border-2 ${
                color === colorOption.value ? "border-white" : "border-zinc-600"
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-zinc-400">Thumbnail</Label>
        <div className="mt-2">
          {thumbnailPreview ? (
            <div className="relative inline-block">
              <img
                src={thumbnailPreview || "/placeholder.svg"}
                alt="Thumbnail preview"
                width={150}
                height={90}
                className="rounded-lg object-cover border border-zinc-600"
              />
              <Button
                type="button"
                onClick={() => {
                  setThumbnailFile(null)
                  setThumbnailPreview("")
                }}
                className="absolute top-1 right-1 p-1 h-6 w-6 bg-red-500 hover:bg-red-600 text-white rounded"
                size="sm"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-zinc-600 rounded-lg p-4 text-center cursor-pointer hover:border-zinc-500 bg-zinc-700"
              onClick={() => document.getElementById(`edit-thumbnail-${category.id}`)?.click()}
            >
              <Upload className="w-6 h-6 mx-auto mb-1 text-zinc-400" />
              <p className="text-xs text-zinc-400">Upload thumbnail</p>
            </div>
          )}
          <input
            id={`edit-thumbnail-${category.id}`}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onSave(category.id, name, color, thumbnailPreview)}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
        <Button
          onClick={onCancel}
          size="sm"
          variant="outline"
          className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600 border-zinc-600"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [adminUser, setAdminUser] = useState<string>("")
  const [activeSection, setActiveSection] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Video management state
  const [uploadedVideos, setUploadedVideos] = useState<VideoData[]>([])
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([])
  const [videoCategories, setVideoCategories] = useState<Category[]>([])

  // Video upload form state
  const [videoSource, setVideoSource] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [embedUrl, setEmbedUrl] = useState("")
  const [urlValidation, setUrlValidation] = useState<{ isValid: boolean; message: string; detectedSite?: string }>({
    isValid: false,
    message: "",
  })
  const [videoTitle, setVideoTitle] = useState("")
  const [videoDescription, setVideoDescription] = useState("")
  const [videoCategory, setVideoCategory] = useState("")
  const [videoTags, setVideoTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [taggedPeople, setTaggedPeople] = useState<Array<{ id: string; name: string; role: string }>>([])
  const [personName, setPersonName] = useState("")
  const [personRole, setPersonRole] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [duration, setDuration] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")

  // Branding state
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [currentLogo, setCurrentLogo] = useState<string>("")
  const [siteName, setSiteName] = useState<string>("StreamHub")
  const [logoSize, setLogoSize] = useState<number>(32)

  // Load data from localStorage
  useEffect(() => {
    const authData = localStorage.getItem("adminAuth")
    if (authData) {
      const { username } = JSON.parse(authData)
      setAdminUser(username)
    }

    const savedVideos = localStorage.getItem("uploadedVideos")
    if (savedVideos) {
      const videos = JSON.parse(savedVideos)
      setUploadedVideos(videos)
      setFilteredVideos(videos)
    }

    const savedCategories = localStorage.getItem("videoCategories")
    if (savedCategories) {
      setVideoCategories(JSON.parse(savedCategories))
    } else {
      setVideoCategories(INITIAL_VIDEO_CATEGORIES)
    }

    const savedLogo = localStorage.getItem("site-logo")
    if (savedLogo) {
      setCurrentLogo(savedLogo)
      setLogoPreview(savedLogo)
    }

    const savedSiteName = localStorage.getItem("site-name")
    if (savedSiteName) {
      setSiteName(savedSiteName)
    }

    const savedLogoSize = localStorage.getItem("logo-size")
    if (savedLogoSize) {
      setLogoSize(Number.parseInt(savedLogoSize))
    }
  }, [])

  // Add this useEffect after the existing useEffect hooks in the main component
  useEffect(() => {
    const handleCategoryUpdate = () => {
      const savedCategories = localStorage.getItem("videoCategories")
      if (savedCategories) {
        setVideoCategories(JSON.parse(savedCategories))
      }
    }

    // Listen for custom category update events
    window.addEventListener("categoryUpdate", handleCategoryUpdate)
    window.addEventListener("storage", handleCategoryUpdate)

    return () => {
      window.removeEventListener("categoryUpdate", handleCategoryUpdate)
      window.removeEventListener("storage", handleCategoryUpdate)
    }
  }, [])

  // Filter videos
  useEffect(() => {
    let filtered = uploadedVideos

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query) ||
          video.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          video.people.some((person) => person.name.toLowerCase().includes(query)),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((video) => video.category === selectedCategory)
    }

    setFilteredVideos(filtered)
  }, [uploadedVideos, searchQuery, selectedCategory])

  // URL validation logic
  const convertCustomUrlToEmbed = (url: string) => {
    const trimmedUrl = url.trim()

    for (const site of CUSTOM_WEBSITE_PATTERNS) {
      for (const pattern of site.patterns) {
        const match = trimmedUrl.match(pattern)
        if (match) {
          let videoId = ""
          let domain = ""

          if (site.name === "Generic Pattern") {
            if (match[1] && match[2]) {
              domain = match[1]
              videoId = match[2]
              return {
                embedUrl: site.embedTemplate(videoId, domain),
                siteName: domain,
                videoId: videoId,
              }
            }
          } else {
            videoId = match[2] || match[1]

            if (site.name === "RedTube") {
              const redtubeMatch = trimmedUrl.match(/(?:redtube\.(?:com|net))\/(?:.*\/)?(\d+)/)
              if (redtubeMatch) {
                videoId = redtubeMatch[1]
              }
            }

            return {
              embedUrl: site.embedTemplate(videoId),
              siteName: site.name,
              videoId: videoId,
            }
          }
        }
      }
    }

    return null
  }

  useEffect(() => {
    if (!videoSource || !videoUrl.trim()) {
      setUrlValidation({ isValid: false, message: "" })
      setEmbedUrl("")
      return
    }

    const source = VIDEO_SOURCES.find((s) => s.id === videoSource)
    if (!source) return

    const url = videoUrl.trim()

    if (source.id === "custom") {
      const conversion = convertCustomUrlToEmbed(url)

      if (conversion) {
        setEmbedUrl(conversion.embedUrl)
        setUrlValidation({
          isValid: true,
          message: `Valid ${conversion.siteName} URL detected - converted to embed format`,
          detectedSite: conversion.siteName,
        })
      } else {
        setEmbedUrl("")
        setUrlValidation({
          isValid: false,
          message: "URL format not recognized. Please check supported formats below.",
        })
      }
      return
    }

    let isValid = false
    let extractedId = ""
    let isSpecialCase = false

    for (const pattern of source.patterns) {
      const match = url.match(pattern)
      if (match) {
        isValid = true
        if (source.id === "youtube") {
          if (url.includes("playlist")) {
            extractedId = match[2]
            isSpecialCase = true
          } else {
            extractedId = match[3]
          }
        } else if (source.id === "twitch") {
          if (url.includes("clips.twitch.tv")) {
            extractedId = match[1]
            isSpecialCase = true
          } else {
            extractedId = match[2]
          }
        } else if (source.id === "direct") {
          extractedId = url
        } else {
          extractedId = match[2]
        }
        break
      }
    }

    if (isValid && extractedId) {
      const generatedEmbedUrl = source.embedTemplate(extractedId, isSpecialCase)
      setEmbedUrl(generatedEmbedUrl)
      setUrlValidation({
        isValid: true,
        message: `Valid ${source.name} URL detected`,
      })
    } else {
      setEmbedUrl("")
      setUrlValidation({
        isValid: false,
        message: `Invalid ${source.name} URL format`,
      })
    }
  }, [videoSource, videoUrl])

  // Helper functions
  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin/login")
  }

  const addTag = () => {
    if (currentTag.trim() && !videoTags.includes(currentTag.trim())) {
      setVideoTags([...videoTags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setVideoTags(videoTags.filter((tag) => tag !== tagToRemove))
  }

  const addPerson = () => {
    if (personName.trim() && personRole.trim()) {
      const newPerson = {
        id: Date.now().toString(),
        name: personName.trim(),
        role: personRole.trim(),
      }
      setTaggedPeople([...taggedPeople, newPerson])
      setPersonName("")
      setPersonRole("")
    }
  }

  const removePerson = (personId: string) => {
    setTaggedPeople(taggedPeople.filter((person) => person.id !== personId))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearThumbnail = () => {
    setThumbnailFile(null)
    setThumbnailPreview("")
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"]
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (PNG, JPEG, or SVG)")
        return
      }

      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        setCurrentLogo(result)
        localStorage.setItem("site-logo", result)
        window.dispatchEvent(new Event("brandingUpdate"))
      }
      reader.readAsDataURL(file)
    }
  }

  const clearLogo = () => {
    setLogoFile(null)
    setLogoPreview("")
    setCurrentLogo("")
    localStorage.removeItem("site-logo")
    window.dispatchEvent(new Event("brandingUpdate"))
  }

  const handleSiteNameChange = (newName: string) => {
    setSiteName(newName)
    localStorage.setItem("site-name", newName)
    window.dispatchEvent(new Event("brandingUpdate"))
  }

  const handleLogoSizeChange = (newSize: number) => {
    setLogoSize(newSize)
    localStorage.setItem("logo-size", newSize.toString())
    window.dispatchEvent(new Event("brandingUpdate"))
  }

  const resetSiteName = () => {
    setSiteName("StreamHub")
    localStorage.setItem("site-name", "StreamHub")
    window.dispatchEvent(new Event("brandingUpdate"))
  }

  const resetToDefaultLogo = () => {
    setLogoFile(null)
    setLogoPreview("")
    setCurrentLogo("")
    localStorage.removeItem("site-logo")
    window.dispatchEvent(new Event("brandingUpdate"))
  }

  const handleVideoUpload = (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoSource || !videoUrl.trim() || !videoTitle.trim() || !videoCategory) {
      alert("Please fill in all required fields")
      return
    }

    if (!urlValidation.isValid || !embedUrl) {
      alert("Please provide a valid video URL for the selected source")
      return
    }

    const generateEmbedCode = (url: string) => {
      return `<iframe src="${url}" frameborder="0" width="560" height="315" scrolling="no" allowfullscreen></iframe>`
    }

    const newVideo: VideoData = {
      id: Date.now().toString(),
      title: videoTitle.trim(),
      description: videoDescription.trim(),
      embedCode: generateEmbedCode(embedUrl),
      embedUrl: embedUrl,
      previewUrl: videoSource === "direct" ? embedUrl : previewUrl,
      thumbnail: thumbnailPreview || "/placeholder.svg?height=400&width=700",
      thumbnailFile: thumbnailFile || undefined,
      tags: videoTags,
      category: videoCategory,
      people: taggedPeople,
      uploadDate: new Date().toISOString(),
      views: "0",
      likes: "0",
      duration: duration || "0:00",
      source: videoSource,
      originalUrl: videoUrl.trim(),
    }

    const updatedVideos = [newVideo, ...uploadedVideos]
    setUploadedVideos(updatedVideos)
    localStorage.setItem("uploadedVideos", JSON.stringify(updatedVideos))

    // Reset form
    setVideoTitle("")
    setVideoDescription("")
    setVideoSource("")
    setVideoUrl("")
    setEmbedUrl("")
    setPreviewUrl("")
    setVideoCategory("")
    setVideoTags([])
    setTaggedPeople([])
    setDuration("")
    setUrlValidation({ isValid: false, message: "" })
    clearThumbnail()

    alert(`Video "${newVideo.title}" uploaded successfully!`)
  }

  const deleteVideo = (videoId: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      const updatedVideos = uploadedVideos.filter((v) => v.id !== videoId)
      setUploadedVideos(updatedVideos)
      localStorage.setItem("uploadedVideos", JSON.stringify(updatedVideos))
    }
  }

  const getCategoryStats = () => {
    const stats = videoCategories.map((category) => ({
      ...category,
      count: uploadedVideos.filter((video) => video.category === category.id).length,
    }))
    return stats
  }

  const getCategoryColor = (categoryId: string) => {
    const category = videoCategories.find((cat) => cat.id === categoryId)
    return category?.color || "bg-gray-500"
  }

  const getCategoryName = (categoryId: string) => {
    const category = videoCategories.find((cat) => cat.id === categoryId)
    return category?.name || "Unknown"
  }

  // Sidebar navigation items
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "upload", label: "Posts", icon: FileText },
    { id: "videos", label: "Videos", icon: Video },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "branding", label: "Theme", icon: Palette },
    { id: "settings", label: "Settings", icon: Cog },
    { id: "curation", label: "Curation", icon: Target },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="text-sm text-zinc-400 mb-1">Total videos</div>
                <div className="text-2xl font-semibold text-white">{uploadedVideos.length}</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="text-sm text-zinc-400 mb-1">Categories</div>
                <div className="text-2xl font-semibold text-white">{videoCategories.length}</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="text-sm text-zinc-400 mb-1">People tagged</div>
                <div className="text-2xl font-semibold text-white">
                  {uploadedVideos.reduce((total, video) => total + video.people.length, 0)}
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Category distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCategoryStats().map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-zinc-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <span className="text-white text-sm">{category.name}</span>
                    </div>
                    <Badge className="bg-zinc-600 text-zinc-300">{category.count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "upload":
        return (
          <div className="space-y-6">
            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Upload New Video</h3>
              <p className="text-sm text-zinc-400 mb-6">Add new video content with proper categorization</p>

              <form onSubmit={handleVideoUpload} className="space-y-6">
                {/* Category and Import From - Single Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-zinc-400">
                      Category *
                    </Label>
                    <Select value={videoCategory} onValueChange={setVideoCategory} required>
                      <SelectTrigger className="mt-2 bg-zinc-700 border-zinc-600 text-white">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-600">
                        {videoCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="text-white">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="video-source" className="text-sm font-medium text-zinc-400">
                      Import From *
                    </Label>
                    <Select value={videoSource} onValueChange={setVideoSource} required>
                      <SelectTrigger className="mt-2 bg-zinc-700 border-zinc-600 text-white">
                        <SelectValue placeholder="Select video source" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-600">
                        {VIDEO_SOURCES.map((source) => (
                          <SelectItem key={source.id} value={source.id} className="text-white">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                              {source.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {videoSource && (
                      <p className="text-xs text-zinc-500 mt-1">
                        {VIDEO_SOURCES.find((s) => s.id === videoSource)?.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Video URL Input */}
                <div>
                  <Label htmlFor="video-url" className="text-sm font-medium text-zinc-400">
                    Video URL *
                  </Label>
                  <div className="mt-2 space-y-2">
                    <Input
                      id="video-url"
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder={
                        videoSource
                          ? VIDEO_SOURCES.find((s) => s.id === videoSource)?.placeholder
                          : "Select a source first"
                      }
                      className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                      required
                      disabled={!videoSource}
                    />
                    {urlValidation.message && (
                      <div
                        className={`text-xs ${urlValidation.isValid ? "text-green-400" : "text-red-400"} flex items-center gap-1`}
                      >
                        {urlValidation.isValid ? "✓" : "✗"} {urlValidation.message}
                      </div>
                    )}
                  </div>

                  {/* Custom Website Supported Formats */}
                  {videoSource === "custom" && (
                    <div className="mt-3 p-4 bg-indigo-900/20 border border-indigo-800 rounded-lg">
                      <h4 className="font-medium text-indigo-300 text-sm mb-2">Supported Website Formats:</h4>
                      <div className="space-y-2 text-xs text-indigo-200">
                        {CUSTOM_WEBSITE_PATTERNS.slice(0, -1).map((site, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="font-medium">{site.name}:</span>
                            <code className="bg-indigo-800/30 px-2 py-1 rounded text-xs">{site.example}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Preview */}
                {embedUrl && urlValidation.isValid && (
                  <div>
                    <Label className="text-sm font-medium text-zinc-400">Video Preview</Label>
                    <div className="mt-2 bg-zinc-700 border border-zinc-600 rounded-lg p-4">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          frameBorder="0"
                          allowFullScreen
                          title="Video preview"
                        />
                      </div>
                      <div className="mt-2 text-xs text-zinc-400 flex justify-between">
                        <span>
                          Source: {urlValidation.detectedSite || VIDEO_SOURCES.find((s) => s.id === videoSource)?.name}
                        </span>
                        <span>Embed URL: {embedUrl}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Video Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title" className="text-sm font-medium text-zinc-400">
                      Video Title *
                    </Label>
                    <Input
                      id="title"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Enter video title"
                      className="mt-2 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description" className="text-sm font-medium text-zinc-400">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      placeholder="Describe the video content..."
                      className="mt-2 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration" className="text-sm font-medium text-zinc-400">
                      Duration
                    </Label>
                    <Input
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 15:30"
                      className="mt-2 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preview-url" className="text-sm font-medium text-zinc-400">
                      Direct Video URL (Optional)
                    </Label>
                    <Input
                      id="preview-url"
                      type="url"
                      value={previewUrl}
                      onChange={(e) => setPreviewUrl(e.target.value)}
                      placeholder="https://example.com/video.mp4"
                      className="mt-2 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                    />
                  </div>

                  {/* Tags */}
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-zinc-400">Tags</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          placeholder="Add a tag"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                          className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          className="bg-zinc-600 text-white hover:bg-zinc-500 px-4"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {videoTags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-zinc-700 text-zinc-300 border border-zinc-600 flex items-center gap-1 pr-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-400 p-0.5 rounded-sm hover:bg-red-900/20"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tagged People */}
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-zinc-400">Tagged People</Label>
                    <div className="mt-2 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input
                          value={personName}
                          onChange={(e) => setPersonName(e.target.value)}
                          placeholder="Person name"
                          className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                        />
                        <Input
                          value={personRole}
                          onChange={(e) => setPersonRole(e.target.value)}
                          placeholder="Role"
                          className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                        />
                        <Button type="button" onClick={addPerson} className="bg-zinc-600 text-white hover:bg-zinc-500">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Person
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {taggedPeople.map((person) => (
                          <div
                            key={person.id}
                            className="flex items-center justify-between bg-zinc-700 border border-zinc-600 p-3 rounded-lg"
                          >
                            <div>
                              <span className="font-medium text-white">{person.name}</span>
                              <span className="text-zinc-400 ml-2">({person.role})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removePerson(person.id)}
                              className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-900/20"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <Label className="text-sm font-medium text-zinc-400">Custom Thumbnail</Label>
                  <div className="mt-2 space-y-4">
                    {thumbnailPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={thumbnailPreview || "/placeholder.svg"}
                          alt="Thumbnail preview"
                          width={300}
                          height={200}
                          className="rounded-lg object-cover border border-zinc-600"
                        />
                        <Button
                          type="button"
                          onClick={clearThumbnail}
                          className="absolute top-2 right-2 p-1 h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center hover:border-zinc-500 transition-colors cursor-pointer bg-zinc-700"
                        onClick={() => document.getElementById("thumbnail-input")?.click()}
                      >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
                        <div className="text-sm text-zinc-400">
                          <span className="text-blue-400 hover:text-blue-300 font-medium">Click to upload</span>
                          {" or drag and drop"}
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                    <input
                      id="thumbnail-input"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 h-11" size="lg">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </Button>
              </form>
            </div>
          </div>
        )

      case "videos":
        return (
          <div className="space-y-6">
            {/* Filters and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 bg-zinc-700 border-zinc-600 text-white">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-600">
                    <SelectItem value="all" className="text-white">
                      All Categories
                    </SelectItem>
                    {videoCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="text-white">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  className="bg-zinc-700 text-white border-zinc-600 hover:bg-zinc-600"
                >
                  {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                </Button>
              </div>

              <div className="text-sm text-zinc-400">
                Showing {filteredVideos.length} of {uploadedVideos.length} videos
              </div>
            </div>

            {filteredVideos.length === 0 ? (
              <div className="bg-zinc-800 rounded-lg p-12 text-center">
                <Video className="w-16 h-16 mx-auto mb-4 text-zinc-400" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {uploadedVideos.length === 0 ? "No videos uploaded yet" : "No videos match your search"}
                </h3>
                <p className="text-zinc-400 mb-4">
                  {uploadedVideos.length === 0
                    ? "Upload your first video to get started"
                    : "Try adjusting your search or category filter"}
                </p>
                {uploadedVideos.length === 0 && (
                  <Button onClick={() => setActiveSection("upload")} className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Your First Video
                  </Button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="bg-zinc-800 rounded-lg overflow-hidden">
                    <div className="relative aspect-video">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={`${getCategoryColor(video.category)} text-white text-xs`}>
                          {getCategoryName(video.category)}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-white mb-2 line-clamp-2">{video.title}</h3>
                      <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{video.description}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {video.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} className="bg-zinc-700 text-zinc-400 border border-zinc-600 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-xs text-zinc-400 mb-4">
                        <span>{video.views} views</span>
                        <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/video/${video.id}`}
                          className="flex-1 text-center py-2 px-3 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => deleteVideo(video.id)}
                          className="py-2 px-3 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="bg-zinc-800 rounded-lg p-6">
                    <div className="flex gap-4">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        width={200}
                        height={120}
                        className="rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white">{video.title}</h3>
                            <Badge className={`${getCategoryColor(video.category)} text-white text-xs`}>
                              {getCategoryName(video.category)}
                            </Badge>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Link href={`/video/${video.id}`} className="text-blue-400 hover:text-blue-300 text-sm">
                              View
                            </Link>
                            <button
                              onClick={() => deleteVideo(video.id)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{video.description}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {video.tags.map((tag) => (
                            <Badge key={tag} className="bg-zinc-700 text-zinc-400 border border-zinc-600 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-zinc-400">
                          <div>
                            <span className="font-medium">Duration:</span> {video.duration}
                          </div>
                          <div>
                            <span className="font-medium">Views:</span> {video.views}
                          </div>
                          <div>
                            <span className="font-medium">People:</span> {video.people.length}
                          </div>
                          <div>
                            <span className="font-medium">Uploaded:</span>{" "}
                            {new Date(video.uploadDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case "categories":
        return <CategoryManagement setVideoCategories={setVideoCategories} />

      case "branding":
        return (
          <div className="space-y-6">
            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Site Branding</h3>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-zinc-400">Site Name</Label>
                  <div className="flex gap-3 mt-2">
                    <Input
                      value={siteName}
                      onChange={(e) => handleSiteNameChange(e.target.value)}
                      placeholder="Enter site name (leave empty to hide)"
                      className="bg-zinc-700 border-zinc-600 text-white"
                    />
                    <Button
                      type="button"
                      onClick={resetSiteName}
                      variant="outline"
                      className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600 border-zinc-600"
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-zinc-400">Logo</Label>
                  <div className="mt-2">
                    {logoPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className="object-contain bg-white rounded-lg border border-zinc-600 p-2"
                          style={{
                            width: `${Math.max(logoSize * 2, 128)}px`,
                            height: `${Math.max(logoSize * 2, 128)}px`,
                          }}
                        />
                        <Button
                          type="button"
                          onClick={clearLogo}
                          className="absolute top-2 right-2 p-1 h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 bg-zinc-700"
                        onClick={() => document.getElementById("logo-input")?.click()}
                      >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
                        <div className="text-sm text-zinc-400">
                          <span className="text-blue-400 hover:text-blue-300 font-medium">Click to upload logo</span>
                          {" or drag and drop"}
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">PNG, JPEG, SVG up to 5MB</p>
                      </div>
                    )}
                    <input
                      id="logo-input"
                      type="file"
                      className="hidden"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                      onChange={handleLogoChange}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-zinc-400">Logo Size: {logoSize}px</Label>
                  <div className="mt-2 space-y-3">
                    <input
                      type="range"
                      min="16"
                      max="64"
                      value={logoSize}
                      onChange={(e) => handleLogoSizeChange(Number.parseInt(e.target.value))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => handleLogoSizeChange(24)}
                        variant="outline"
                        size="sm"
                        className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600 border-zinc-600 text-xs"
                      >
                        Small (24px)
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleLogoSizeChange(32)}
                        variant="outline"
                        size="sm"
                        className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600 border-zinc-600 text-xs"
                      >
                        Medium (32px)
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleLogoSizeChange(48)}
                        variant="outline"
                        size="sm"
                        className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600 border-zinc-600 text-xs"
                      >
                        Large (48px)
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => document.getElementById("logo-input")?.click()}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Logo
                  </Button>

                  {currentLogo && (
                    <Button
                      type="button"
                      onClick={resetToDefaultLogo}
                      variant="outline"
                      className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600 border-zinc-600"
                    >
                      Reset to Default
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Branding Guidelines */}
            <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-300 mb-2">Branding Guidelines</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Logo size can be adjusted from 16px to 64px</li>
                <li>• Site name can be edited or completely hidden</li>
                <li>• Supported formats: PNG, JPEG, SVG</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Square logos work best for consistent sizing</li>
                <li>• Transparent backgrounds recommended for PNG files</li>
              </ul>
            </div>
          </div>
        )

      case "settings":
        return (
          <div className="space-y-6">
            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Admin Settings</h3>

              <div className="space-y-6">
                <div className="p-4 bg-amber-900/20 border border-amber-800 rounded-lg">
                  <h4 className="font-medium text-amber-300 mb-2">Security Notice</h4>
                  <p className="text-sm text-amber-200">
                    This admin panel is protected by authentication. Session expires after 24 hours.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3">Security Settings</h4>
                  <div className="space-y-3">
                    <ChangePasswordModal
                      trigger={
                        <Button className="bg-blue-600 text-white hover:bg-blue-700">
                          <Key className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      }
                    />
                    <div className="text-sm text-zinc-400 space-y-2">
                      <div className="flex justify-between">
                        <span>Session Status:</span>
                        <span className="font-medium text-green-400">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Login Time:</span>
                        <span className="font-medium">{new Date().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-3">System Stats</h4>
                    <div className="text-sm text-zinc-400 space-y-2">
                      <div className="flex justify-between">
                        <span>Total Videos:</span>
                        <span className="font-medium">{uploadedVideos.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Categories:</span>
                        <span className="font-medium">{videoCategories.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage:</span>
                        <span className="font-medium">LocalStorage</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-700">
                  <Button onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout from Admin Panel
                  </Button>
                </div>
              </div>
            </div>

            <SecurityDashboard />
          </div>
        )

      case "curation":
        return <VideoCurationManager />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        {/* Admin Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-medium">Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-zinc-800">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-700"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top Header */}
        <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span>admin dashboard</span>
              <span>›</span>
              <span>{activeSection}</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-zinc-400 hover:text-white text-sm">
                view site
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-700"
              >
                logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800 hover:scrollbar-thumb-zinc-500">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
