import type { Category, VideoSource, CustomWebsitePattern } from "@/src/types"

// Initial categories data
export const INITIAL_VIDEO_CATEGORIES: Category[] = [
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

export const VIDEO_SOURCES: VideoSource[] = [
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

export const CUSTOM_WEBSITE_PATTERNS: CustomWebsitePattern[] = [
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
