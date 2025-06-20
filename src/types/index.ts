// Global type definitions
export interface VideoData {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  embedUrl?: string
  duration: string
  views: string
  uploadDate: string
  uploadTime?: string
  category: string
  tags: string[]
  source: string
  originalUrl?: string
}

export interface Category {
  id: string
  name: string
  color: string
  thumbnail?: string
  description?: string
  videoCount?: number
}

export interface VideoSource {
  id: string
  name: string
  color: string
  description: string
  placeholder: string
  patterns: RegExp[]
  embedTemplate: (id: string, isPlaylist?: boolean) => string
  isCustom?: boolean
}

export interface CustomWebsitePattern {
  name: string
  domain: string
  patterns: RegExp[]
  embedTemplate: (id: string, domain?: string) => string
  example: string
  requiresDirectAccess?: boolean
}

export interface SecurityLog {
  id: string
  timestamp: string
  action: string
  details: string
  ipAddress?: string
  userAgent?: string
}

export interface SiteSettings {
  siteName: string
  logoUrl: string
  primaryColor: string
  secondaryColor: string
}
