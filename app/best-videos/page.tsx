import MainHeader from "@/components/main-header"
import CategoryFilters from "@/components/category-filters"
import BestVideosGrid from "@/components/best-videos-grid"

export default function BestVideosPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <MainHeader />

      <main className="container mx-auto px-4 py-6 max-w-full overflow-hidden">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">★</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Best Videos</h1>
          </div>
          <p className="text-zinc-400 mb-6">Curated collection of our highest quality and most popular videos</p>
          <CategoryFilters />
        </div>

        <BestVideosGrid />
      </main>
    </div>
  )
}
