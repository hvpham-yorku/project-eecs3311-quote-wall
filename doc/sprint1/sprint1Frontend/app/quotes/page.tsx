"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"
import BackgroundSelector from "@/components/background-selector"
import SettingsPanel from "@/components/settings-panel"
import AuthButton from "@/components/auth-button"
import CloudQuote from "@/components/cloud-quote"
import { useSession } from "next-auth/react";

export default function QuotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedGenres = useMemo(() => {
    const genreParam = searchParams.get("genres")
    return genreParam ? genreParam.split(",") : []
  }, [searchParams])
  const aiPrompt = useMemo(() => {
    return searchParams.get("prompt") || "Generate short inspirational quote (1 sentence).";
  }, [searchParams]);

  const [currentTime, setCurrentTime] = useState("")
  const [currentQuote, setCurrentQuote] = useState<{ text: string; author: string } | null>(null)
  const [isChanging, setIsChanging] = useState(false)
  const [floatingEnabled, setFloatingEnabled] = useState(true)
  const { data: session, status } = useSession()
  const [useAIQuote, setUseAIQuote] = useState(!!searchParams.get("aiQuote"))
  const [backgroundTheme, setBackgroundTheme] = useState("default");
  const hasFetched = useRef(false);

  // **Fix: Ensure hooks always run in the same order**
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth");
    }
  }, [status, router]);

  useEffect(() => {
    const now = new Date()
    setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const aiQuoteText = searchParams.get("aiQuote");
    const aiQuoteAuthor = searchParams.get("author") || "AI";

    if (aiQuoteText) {
      setCurrentQuote({ text: decodeURIComponent(aiQuoteText), author: decodeURIComponent(aiQuoteAuthor) });
      setUseAIQuote(true);
    } else if (session?.user?.email && selectedGenres.length > 0) {
      fetchQuoteByGenre();
      setUseAIQuote(false);
    }
  }, [searchParams, selectedGenres, session]);


  const fetchQuoteByGenre = async () => {
    try {
      const response = await fetch("http://localhost:5000/get-quote-by-genre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          genres: selectedGenres,
        }),
      })

      const data = await response.json()
      if (data?.quote && data?.author) {
        setCurrentQuote({ text: data.quote, author: data.author })
      }
    } catch (err) {
      console.error("Error fetching quote:", err)
    }
  }

  const getNewQuote = async () => {
    setIsChanging(true)
    setTimeout(async () => {
      if (useAIQuote) {
        try {
          const res = await fetch("http://localhost:5000/ai-quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: aiPrompt }),
          })
          const data = await res.json()
          if (data.quote) {
            setCurrentQuote({ text: data.quote, author: "AI" })
          } else {
            alert("Failed to fetch AI quote")
          }
        } catch (err) {
          alert("Error calling AI quote API")
        }
      } else {
        await fetchQuoteByGenre()
      }
      setIsChanging(false)
    }, 500)
  }
  const goBack = () => {
    router.push("/")
  }

  return (
    <div className={`min-h-screen flex flex-col bg-${backgroundTheme}`}>
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

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12 md:py-20 flex items-center justify-center relative">
        <div className="translate-y-20 md:translate-y-28 max-w-[90%] text-center">
        {!isChanging && currentQuote && (
          <CloudQuote 
            quote={currentQuote} 
            onRefresh={getNewQuote} 
            isChanging={isChanging} 
            genre={selectedGenres.join(", ")} 
            className={floatingEnabled ? "floating-animation" : ""} 
          />
        )}
          {useAIQuote && (
            <p className="text-muted-foreground mt-4 italic text-sm">
              AI Prompt: <span className="font-medium">"{aiPrompt}"</span>
            </p>
          )}
        </div>
      </main>

      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
        <div className="backdrop-blur-lg bg-background/80 border border-border rounded-full p-2 shadow-sm">
        <BackgroundSelector 
          selectedTheme={backgroundTheme} 
          onChangeTheme={setBackgroundTheme}
        />
        </div>
      </div>
    </div>
  );
}