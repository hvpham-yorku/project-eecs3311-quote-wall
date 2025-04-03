"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type CloudQuoteProps = {
  quote: {
    text: string;
    author: string;
    category?: string;
  } | null;
  onRefresh: () => void;
  isChanging: boolean;
  genre: string;
  className?: string
};

export default function CloudQuote({ quote, onRefresh, isChanging, genre }: CloudQuoteProps) {
  const [floatingEnabled, setFloatingEnabled] = useState(true);
  const [autoChangeEnabled, setAutoChangeEnabled] = useState(false);
  const [quoteDisplayTime, setQuoteDisplayTime] = useState(30);
  const [isFavorited, setIsFavorited] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("quotewall-settings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings) ?? {};
        setFloatingEnabled(settings.floatingAnimation ?? true);
        setAutoChangeEnabled(settings.autoChangeQuotes ?? false);
        setQuoteDisplayTime(settings.quoteDisplayTime ?? 30);
      } catch (error) {
        console.error("Error parsing settings:", error);
      }
    }
  }, []);
  

  // Check if current quote is in favorites
  useEffect(() => {
    if (!quote) return;

    const favorites = JSON.parse(localStorage.getItem("quotewall-favorites") || "[]");
    const isInFavorites = favorites.some((fav: any) => fav.text === quote.text && fav.author === quote.author);

    setIsFavorited(isInFavorites);
  }, [quote]);

  // Set up auto-change timer
  useEffect(() => {
    if (autoChangeEnabled && !isChanging) {
      timerRef.current = setTimeout(() => {
        onRefresh();
      }, quoteDisplayTime * 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoChangeEnabled, quoteDisplayTime, quote, isChanging, onRefresh]);

  // Toggle favorite
  const toggleFavorite = () => {
    if (!quote) return;

    const favorites = JSON.parse(localStorage.getItem("quotewall-favorites") || "[]");

    if (isFavorited) {
      // Remove from favorites
      const updatedFavorites = favorites.filter((fav: any) => !(fav.text === quote.text && fav.author === quote.author));
      localStorage.setItem("quotewall-favorites", JSON.stringify(updatedFavorites));
      setIsFavorited(false);
    } else {
      // Add to favorites
      const newFavorite = {
        id: Date.now().toString(),
        text: quote.text,
        author: quote.author,
        category: quote.category || (genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : "Unknown"),
        timestamp: new Date().toISOString(),
      };

      favorites.push(newFavorite);
      localStorage.setItem("quotewall-favorites", JSON.stringify(favorites));
      setIsFavorited(true);
    }
  };

  // Animation variants
  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  const fadeAnimation = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto"
      animate={floatingEnabled ? "animate" : undefined}
      variants={floatingAnimation}
    >
      {/* Cloud shape with quote */}
      <motion.div
        className="relative p-8 md:p-12 bg-background/80 backdrop-blur-md border border-border/50 shadow-lg"
        style={{
          borderRadius: "60% 40% 50% 50% / 60% 50% 50% 40%" as any,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        }}
        {...fadeAnimation}
        key={quote?.text} // Force re-render on quote change
      >
        {/* Favorite button */}
        {quote && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-4 right-4 h-10 w-10 rounded-full ${
                    isFavorited ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={toggleFavorite}
                >
                  <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
                  <span className="sr-only">{isFavorited ? "Remove from favorites" : "Add to favorites"}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFavorited ? "Remove from favorites" : "Add to favorites"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {quote && (
          <div className="text-center">
            <blockquote className="mb-6 mt-10">
              <p className="font-serif leading-relaxed" style={{ fontSize: "var(--quote-font-size, 100%)" }}>
                "{quote.text}"
              </p>
            </blockquote>
            <cite className="text-lg md:text-xl font-medium text-muted-foreground not-italic block mb-8">
              — {quote.author}
            </cite>
            <Button onClick={onRefresh} className="rounded-full px-6" disabled={isChanging}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isChanging ? "animate-spin" : ""}`} />
              New Quote
            </Button>
          </div>
        )}
      </motion.div>

      {/* Cloud decorations */}
      <div
        className="absolute -top-6 -left-6 w-16 h-16 bg-background/80 rounded-full border border-border/50"
        style={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
      />
      <div
        className="absolute -bottom-4 -right-4 w-12 h-12 bg-background/80 rounded-full border border-border/50"
        style={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
      />
      <div
        className="absolute top-1/4 -right-8 w-14 h-14 bg-background/80 rounded-full border border-border/50"
        style={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
      />
    </motion.div>
  );
}
