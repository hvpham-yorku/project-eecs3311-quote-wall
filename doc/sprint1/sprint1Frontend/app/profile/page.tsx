"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Trash2, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ThemeToggle from "@/components/theme-toggle"
import SettingsPanel from "@/components/settings-panel"

// Mock user data - would come from your auth provider
const user = {
  name: "Jane Doe",
  email: "jane@example.com",
  image: "/placeholder.svg?height=128&width=128",
  joinDate: "March 2023",
}

type FavoriteQuote = {
  id: string
  text: string
  author: string
  category: string
  timestamp?: string
}

export default function ProfilePage() {
  const [favorites, setFavorites] = useState<FavoriteQuote[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("quotewall-favorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  const handleRemoveFavorite = (id: string) => {
    const updatedFavorites = favorites.filter((quote) => quote.id !== id)
    setFavorites(updatedFavorites)
    localStorage.setItem("quotewall-favorites", JSON.stringify(updatedFavorites))
  }

  const handleDeleteAccount = () => {
    setIsDeleting(true)

    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false)
      // In a real app, you would redirect to home or login page after account deletion
      window.location.href = "/"
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile sidebar */}
          <div className="md:col-span-1">
            <Card className="border-2">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <Badge variant="outline" className="mt-2">
                  Member since {user.joinDate}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Favorite Quotes</span>
                    <span className="font-medium">{favorites.length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Collections</span>
                    <span className="font-medium">2</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Shared Quotes</span>
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
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data
                        from our servers.
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

          {/* Main content area */}
          <div className="md:col-span-2">
            <Tabs defaultValue="favorites" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="settings">Account Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="favorites" className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-red-500" />
                  Your Favorite Quotes
                </h2>

                {favorites.length > 0 ? (
                  <div className="space-y-4">
                    {favorites.map((quote) => (
                      <Card key={quote.id} className="border-2 relative overflow-hidden">
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
                          <blockquote className="mb-4 text-lg italic">"{quote.text}"</blockquote>
                          <cite className="text-muted-foreground not-italic block">— {quote.author}</cite>
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
                          When you find quotes you love, save them to your favorites for easy access.
                        </p>
                        <Button asChild>
                          <Link href="/">Discover Quotes</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal information and how we can reach you</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <input
                        type="text"
                        className="w-full p-2 rounded-md border border-border bg-background"
                        defaultValue={user.name}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        className="w-full p-2 rounded-md border border-border bg-background"
                        defaultValue={user.email}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <input type="password" className="w-full p-2 rounded-md border border-border bg-background" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <input type="password" className="w-full p-2 rounded-md border border-border bg-background" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <input type="password" className="w-full p-2 rounded-md border border-border bg-background" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Update Password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

