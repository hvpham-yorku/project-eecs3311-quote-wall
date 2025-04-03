"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Heart, Trash2, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/theme-toggle";
import SettingsPanel from "@/components/settings-panel";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<FavoriteQuote[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  type FavoriteQuote = {
    id: string;
    text: string;
    author: string;
    category: string;
    timestamp?: string;
  };

  useEffect(() => {
    const storedFavorites = localStorage.getItem("quotewall-favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleRemoveFavorite = (id: string) => {
    const updatedFavorites = favorites.filter((quote) => quote.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem(
      "quotewall-favorites",
      JSON.stringify(updatedFavorites)
    );
  };

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      window.location.href = "/";
    }, 1500);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading or not signed in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400 text-transparent bg-clip-text">
              The QuoteWall
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <SettingsPanel
              getNewQuote={function (): void {
                throw new Error("Function not implemented.");
              }}
              setFloatingEnabled={function (value: boolean): void {
                throw new Error("Function not implemented.");
              }}
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="border-2">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage
                    src={session.user?.image || "/placeholder.svg"}
                    alt={session.user?.name || "User"}
                  />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">
                  {session.user?.name || "Anonymous"}
                </CardTitle>
                <CardDescription>
                  {session.user?.email || "No email"}
                </CardDescription>
                <Badge variant="outline" className="mt-2">
                  Member since March 2023
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Favorite Quotes
                    </span>
                    <span className="font-medium">{favorites.length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Collections
                    </span>
                    <span className="font-medium">2</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Shared Quotes
                    </span>
                    <span className="font-medium">7</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove all your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete Account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              Your Favorite Quotes
            </h2>

            {favorites.length > 0 ? (
              <div className="flex flex-col items-center gap-6">
                {favorites.map((quote) => (
                  <Card
                    key={quote.id}
                    className="w-full md:w-[600px] border-2 relative overflow-hidden"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => handleRemoveFavorite(quote.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove from favorites</span>
                    </Button>
                    <CardContent className="p-6">
                      <Badge className="mb-4">{quote.category}</Badge>
                      <blockquote className="mb-4 text-xl italic leading-relaxed">
                        "{quote.text}"
                      </blockquote>
                      <cite className="text-muted-foreground not-italic block">
                        — {quote.author}
                      </cite>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="p-6 text-center">
                  <div className="py-8 space-y-4">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-lg font-medium">No favorites yet</h3>
                    <p className="text-muted-foreground">
                      When you find quotes you love, save them to your favorites
                      for easy access.
                    </p>
                    <Button asChild>
                      <Link href="/">Discover Quotes</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
