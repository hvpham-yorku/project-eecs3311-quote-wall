"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import BackgroundSelector from "@/components/background-selector";
import SettingsPanel from "@/components/settings-panel";
import AuthButton from "@/components/auth-button";
import CloudQuote from "@/components/cloud-quote";
import { useSession } from "next-auth/react";

export default function QuotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedGenres = useMemo(
    () => searchParams.get("genres")?.split(",") || ["sport"],
    [searchParams]
  );

  const [currentTime, setCurrentTime] = useState("");
  const [currentQuote, setCurrentQuote] = useState<{
    text: string;
    author: string;
  } | null>(null);
  const [isChanging, setIsChanging] = useState(false);
  const [floatingEnabled, setFloatingEnabled] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth");
    }
  }, [status, router]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const genre =
          selectedGenres[Math.floor(Math.random() * selectedGenres.length)];
        const response = await fetch(
          `http://127.0.0.1:5000/user-quote/${session?.user?.email}?genre=${genre}`
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setCurrentQuote(data[0]);
        } else {
          console.error("No quote received:", data);
        }
      } catch (err) {
        console.error("Error fetching quote:", err);
      }
    };

    if (session?.user?.email && selectedGenres.length > 0) fetchQuote();
  }, [selectedGenres, session]);

  const getNewQuote = async () => {
    if (!session?.user?.email || selectedGenres.length === 0) return;
    setIsChanging(true);

    try {
      const genre =
        selectedGenres[Math.floor(Math.random() * selectedGenres.length)];
      const response = await fetch(
        `http://127.0.0.1:5000/user-quote/${session.user.email}?genre=${genre}`
      );
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setTimeout(() => {
          setCurrentQuote(data[0]);
          setIsChanging(false);
        }, 500);
      } else {
        console.error("No quote received:", data);
        setIsChanging(false);
      }
    } catch (err) {
      console.error("Error fetching quote:", err);
      setIsChanging(false);
    }
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
              <SettingsPanel
                getNewQuote={getNewQuote}
                setFloatingEnabled={setFloatingEnabled}
              />
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
          genre={selectedGenres.join(", ")}
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
