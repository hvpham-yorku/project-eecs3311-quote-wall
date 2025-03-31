"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {BookText,
  Brain,
  ChevronRight,
  Clock,
  Cpu,
  Film,
  Gamepad2,
  HeartPulse,
  LandPlot,
  Leaf,
  Microscope,
  Music,
  Trophy,
  ChevronDown,
  ChevronUp} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/theme-toggle";
import BackgroundSelector from "@/components/background-selector";
import SettingsPanel from "@/components/settings-panel";
import AuthButton from "@/components/auth-button";

const allGenres = [
  { id: "philosophy", name: "Philosophy", icon: Brain },
  { id: "technology", name: "Technology", icon: Cpu },
  { id: "history", name: "History", icon: Clock },
  { id: "literature", name: "Literature", icon: BookText },
  { id: "psychology", name: "Psychology", icon: HeartPulse },
  { id: "politics", name: "Politics", icon: LandPlot },
  { id: "sport", name: "Sport", icon: Trophy },
  { id: "movie", name: "Movie", icon: Film },
  { id: "music", name: "Music", icon: Music },
  { id: "science", name: "Science", icon: Microscope },
  { id: "videogames", name: "Video Games", icon: Gamepad2 },
  { id: "nature", name: "Nature", icon: Leaf },
];

const handleAIGenerated = async () => {
  try {
    const res = await fetch("http://localhost:5000/ai-quote");
    const data = await res.json();

    if (data.quote) {
      alert(`AI Quote:\n\n"${data.quote}"`);
    } else {
      alert("Error generating quote. Try again.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong contacting the AI.");
  }
};

export default function HomePage() {
  const router = useRouter();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]); // Store multiple selected genres
  const [showMore, setShowMore] = useState(false);

  const toggleGenreSelection = (id: string) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((genre) => genre !== id) // Remove if already selected
        : [...prevSelected, id] // Add if not selected
    );
  };

  const handleContinue = () => {
    if (selectedGenres.length > 0) {
      router.push(`/quotes?genres=${selectedGenres.join(",")}`);
    }
  };

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
            {/* <SettingsPanel getNewQuote={() => {}} setFloatingEnabled={() => {}} /> */}
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
            Discover inspiring quotes from various genres to motivate and inspire your day.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">Select Genres</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {allGenres.slice(0, 6).map((genre) => {
              const Icon = genre.icon;
              return (
                <Card
                  key={genre.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                    selectedGenres.includes(genre.id)
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => toggleGenreSelection(genre.id)}
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <Icon
                      className={`h-8 w-8 mb-2 ${
                        selectedGenres.includes(genre.id) ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <h3 className={`font-medium ${selectedGenres.includes(genre.id) ? "text-primary font-semibold" : ""}`}>
                      {genre.name}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Show More Section */}
          {showMore && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {allGenres.slice(6).map((genre) => {
                const Icon = genre.icon;
                return (
                  <Card
                    key={genre.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedGenres.includes(genre.id)
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleGenreSelection(genre.id)}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <Icon
                        className={`h-8 w-8 mb-2 ${
                          selectedGenres.includes(genre.id) ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <h3 className={`font-medium ${selectedGenres.includes(genre.id) ? "text-primary font-semibold" : ""}`}>
                        {genre.name}
                      </h3>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Show More Button */}
          <div className="flex justify-center mt-6">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowMore(!showMore)}
              className="px-6 py-4 text-lg flex items-center"
            >
            {showMore ? "Show Less" : "Show More"} 
            {showMore ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={selectedGenres.length === 0}
            className="px-8 py-6 text-lg rounded-full transition-all duration-300 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
          >
            Continue <ChevronRight className="ml-2 h-5 w-5" />
          </Button>

          <span className="text-muted-foreground text-lg font-medium">or</span>

          <Button
            className="px-8 py-6 text-lg rounded-full transition-all duration-300 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
            onClick={() => handleAIGenerated()}
          >
            AI Generated Quote
            <Sparkles className="ml-2 h-5 w-5" />
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
  );
}
