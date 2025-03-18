"use client"

import { useState, useEffect, useMemo  } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"
import BackgroundSelector from "@/components/background-selector"
import SettingsPanel from "@/components/settings-panel"
import AuthButton from "@/components/auth-button"
import CloudQuote from "@/components/cloud-quote"
import { useSession } from "next-auth/react"; // Import session hook

// Sample quotes by genre
const quotesByGenre: Record<string, { text: string; author: string }[]> = {
  sport: [
    { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
    { text: "It's not whether you get knocked down; it's whether you get up.", author: "Vince Lombardi" },
  ],
  movie: [
    { text: "May the Force be with you.", author: "Star Wars" },
    { text: "Life is like a box of chocolates, you never know what you're gonna get.", author: "Forrest Gump" },
    { text: "I'll be back.", author: "The Terminator" },
  ],
  music: [
    {
      text: "Music gives a soul to the universe, wings to the mind, flight to the imagination and life to everything.",
      author: "Plato",
    },
    { text: "One good thing about music, when it hits you, you feel no pain.", author: "Bob Marley" },
    { text: "Music is the universal language of mankind.", author: "Henry Wadsworth Longfellow" },
  ],
  science: [
    {
      text: "The important thing is to not stop questioning. Curiosity has its own reason for existing.",
      author: "Albert Einstein",
    },
    {
      text: "The good thing about science is that it's true whether or not you believe in it.",
      author: "Neil deGrasse Tyson",
    },
    { text: "Science is organized knowledge. Wisdom is organized life.", author: "Immanuel Kant" },
  ],
  videogames: [
    { text: "It's dangerous to go alone! Take this.", author: "The Legend of Zelda" },
    { text: "War. War never changes.", author: "Fallout" },
    { text: "A man chooses, a slave obeys.", author: "BioShock" },
  ],
  nature: [
    { text: "Look deep into nature, and then you will understand everything better.", author: "Albert Einstein" },
    { text: "In every walk with nature one receives far more than he seeks.", author: "John Muir" },
    { text: "The clearest way into the Universe is through a forest wilderness.", author: "John Muir" },
  ],
  philosophy: [
    { text: "The unexamined life is not worth living.", author: "Socrates" },
    { text: "I think, therefore I am.", author: "René Descartes" },
    { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  ],
  technology: [
    { text: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    {
      text: "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life.",
      author: "Bill Gates",
    },
  ],
  history: [
    { text: "Those who cannot remember the past are condemned to repeat it.", author: "George Santayana" },
    { text: "History is written by the victors.", author: "Winston Churchill" },
    { text: "The farther backward you can look, the farther forward you can see.", author: "Winston Churchill" },
  ],
  literature: [
    {
      text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
      author: "George R.R. Martin",
    },
    { text: "Books are a uniquely portable magic.", author: "Stephen King" },
    { text: "That's the thing about books. They let you travel without moving your feet.", author: "Jhumpa Lahiri" },
  ],
  psychology: [
    { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    {
      text: "The only person you are destined to become is the person you decide to be.",
      author: "Ralph Waldo Emerson",
    },
  ],
  politics: [
    {
      text: "In politics, nothing happens by accident. If it happens, you can bet it was planned that way.",
      author: "Franklin D. Roosevelt",
    },
    {
      text: "Politics is the art of looking for trouble, finding it everywhere, diagnosing it incorrectly and applying the wrong remedies.",
      author: "Groucho Marx",
    },
    { text: "The ballot is stronger than the bullet.", author: "Abraham Lincoln" },
  ],
}

export default function QuotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // **Fix: Ensure selectedGenres is always an array**
  const selectedGenres = useMemo(
    () => searchParams.get("genres")?.split(",") || ["sport"],
    [searchParams]
  );

  const [currentTime, setCurrentTime] = useState("");
  const [currentQuote, setCurrentQuote] = useState<{ text: string; author: string } | null>(null);
  const [isChanging, setIsChanging] = useState(false);
  const [floatingEnabled, setFloatingEnabled] = useState(true);
  const { data: session, status } = useSession();

  // **Fix: Ensure hooks always run in the same order**
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth");
    }
  }, [status, router]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // **Fix: Use useMemo to avoid unnecessary re-renders**
  const mergedQuotes = useMemo(
    () => selectedGenres.flatMap((genre) => quotesByGenre[genre] || []),
    [selectedGenres]
  );

  useEffect(() => {
    if (mergedQuotes.length > 0) {
      setCurrentQuote(mergedQuotes[Math.floor(Math.random() * mergedQuotes.length)]);
    }
  }, [mergedQuotes]);

  const getNewQuote = () => {
    if (mergedQuotes.length === 0) return;
    setIsChanging(true);

    setTimeout(() => {
      let newQuote;
      do {
        newQuote = mergedQuotes[Math.floor(Math.random() * mergedQuotes.length)];
      } while (newQuote?.text === currentQuote?.text && mergedQuotes.length > 1);

      setCurrentQuote(newQuote);
      setIsChanging(false);
    }, 500);
  };

  const goBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={goBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400 text-transparent bg-clip-text">
              The QuoteWall
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground">{currentTime}</div>
            <div className="flex items-center gap-2">
              <AuthButton />
              <SettingsPanel getNewQuote={getNewQuote} setFloatingEnabled={setFloatingEnabled} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8 md:py-16 flex items-center justify-center">
        <CloudQuote 
          quote={currentQuote} 
          onRefresh={getNewQuote} 
          isChanging={isChanging} 
          genre={selectedGenres.join(", ")} // Display multiple genres
          className={floatingEnabled ? "floating-animation" : ""} 
        />
      </main>

      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
        <div className="backdrop-blur-lg bg-background/80 border border-border rounded-full p-2 shadow-sm">
          <BackgroundSelector />
        </div>
      </div>
    </div>
  );
}