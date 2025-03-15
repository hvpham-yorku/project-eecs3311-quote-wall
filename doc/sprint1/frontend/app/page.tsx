"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Film, Gamepad2, Leaf, Music, Microscope, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ThemeToggle from "@/components/theme-toggle"
import BackgroundSelector from "@/components/background-selector"
import SettingsPanel from "@/components/settings-panel"
import AuthButton from "@/components/auth-button"

const genres = [
  { id: "sport", name: "Sport", icon: BookOpen },
  { id: "movie", name: "Movie", icon: Film },
  { id: "music", name: "Music", icon: Music },
  { id: "science", name: "Science", icon: Microscope },
  { id: "videogames", name: "Video Games", icon: Gamepad2 },
  { id: "nature", name: "Nature", icon: Leaf },
]

export default function HomePage() {
  const router = useRouter()
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  const handleContinue = () => {
    if (selectedGenre) {
      router.push(`/quotes?genre=${selectedGenre}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with auth button */}
      <header className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400 text-transparent bg-clip-text">
            The QuoteWall
          </h1>
          <div className="flex items-center gap-2">
            <AuthButton />
            <SettingsPanel getNewQuote={function (): void {
              throw new Error("Function not implemented.")
            } } setFloatingEnabled={function (value: boolean): void {
              throw new Error("Function not implemented.")
            } } />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400 text-transparent bg-clip-text mb-4">
            The QuoteWall
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Discover inspiring quotes from various genres to motivate and inspire your day
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">Select a Genre</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {genres.map((genre) => {
              const Icon = genre.icon
              return (
                <Card
                  key={genre.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                    selectedGenre === genre.id
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedGenre(genre.id)}
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <Icon
                      className={`h-8 w-8 mb-2 ${
                        selectedGenre === genre.id ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <h3 className={`font-medium ${selectedGenre === genre.id ? "text-primary font-semibold" : ""}`}>
                      {genre.name}
                    </h3>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedGenre}
            className="px-8 py-6 text-lg rounded-full transition-all duration-300 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
          >
            Continue <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </main>

      {/* Settings sidebar (fixed position) */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
        <div className="backdrop-blur-lg bg-background/80 border border-border rounded-full p-2 shadow-sm">
          <BackgroundSelector />
        </div>
      </div>
    </div>
  )
}

