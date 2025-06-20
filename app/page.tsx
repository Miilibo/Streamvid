import MainHeader from "@/src/components/layout/main-header"
import CategoryFilters from "@/src/components/video/category-filters"
import VideoGrid from "@/src/components/video/video-grid"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <MainHeader />

      <main className="container mx-auto px-4 py-6 max-w-full overflow-hidden">
        <div className="mb-6">
          <CategoryFilters />
        </div>

        <VideoGrid />
      </main>
    </div>
  )
}
