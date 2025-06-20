import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { VideoData, Category } from "@/src/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Video utility functions
export const getCategoryColor = (categoryId: string, categories: Category[]) => {
  const category = categories.find((cat) => cat.id === categoryId)
  return category?.color || "bg-gray-500"
}

export const getCategoryName = (categoryId: string, categories: Category[]) => {
  const category = categories.find((cat) => cat.id === categoryId)
  return category?.name || "Unknown"
}

// Format timestamp utility
export const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString()
}

// Password validation utility
export const validatePassword = (password: string) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    return "Password must be at least 8 characters long"
  }
  if (!hasUpperCase) {
    return "Password must contain at least one uppercase letter"
  }
  if (!hasLowerCase) {
    return "Password must contain at least one lowercase letter"
  }
  if (!hasNumbers) {
    return "Password must contain at least one number"
  }
  if (!hasSpecialChar) {
    return "Password must contain at least one special character"
  }
  return null
}

// Local storage utilities
export const getStoredVideos = (): VideoData[] => {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem("uploadedVideos")
  return saved ? JSON.parse(saved) : []
}

export const getStoredCategories = (): Category[] => {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem("videoCategories")
  return saved ? JSON.parse(saved) : []
}

export const saveVideos = (videos: VideoData[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("uploadedVideos", JSON.stringify(videos))
  }
}

export const saveCategories = (categories: Category[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("videoCategories", JSON.stringify(categories))
  }
}
