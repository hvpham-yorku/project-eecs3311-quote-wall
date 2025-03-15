"use client"

import { useState, useEffect } from "react"
import { Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const backgrounds = [
  { id: "gradient-1", name: "Default", class: "bg-gradient-to-br from-background to-background" },
  {
    id: "gradient-2",
    name: "Soft Blue",
    class: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950",
  },
  {
    id: "gradient-3",
    name: "Warm Sunset",
    class: "bg-gradient-to-br from-orange-50 to-rose-100 dark:from-slate-900 dark:to-rose-950",
  },
  {
    id: "gradient-4",
    name: "Cool Mint",
    class: "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-emerald-950",
  },
  {
    id: "gradient-5",
    name: "Purple Haze",
    class: "bg-gradient-to-br from-purple-50 to-violet-100 dark:from-slate-900 dark:to-violet-950",
  },
]

export default function BackgroundSelector() {
  const [currentBackground, setCurrentBackground] = useState("gradient-1")

  useEffect(() => {
    // Apply the background to the html element
    const htmlElement = document.documentElement

    // Remove any existing background classes
    backgrounds.forEach((bg) => {
      const classNames = bg.class.split(" ")
      classNames.forEach((className) => {
        htmlElement.classList.remove(className)
      })
    })

    // Add the new background classes
    const selectedBg = backgrounds.find((bg) => bg.id === currentBackground)
    if (selectedBg) {
      const classNames = selectedBg.class.split(" ")
      classNames.forEach((className) => {
        htmlElement.classList.add(className)
      })
    }

    // Save to localStorage
    localStorage.setItem("quotewall-background", currentBackground)
  }, [currentBackground])

  // Load from localStorage on mount
  useEffect(() => {
    const savedBg = localStorage.getItem("quotewall-background")
    if (savedBg) {
      setCurrentBackground(savedBg)
    }
  }, [])

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Palette className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Change background</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent align="end">
            {backgrounds.map((bg) => (
              <DropdownMenuItem
                key={bg.id}
                onClick={() => setCurrentBackground(bg.id)}
                className={currentBackground === bg.id ? "bg-accent" : ""}
              >
                {bg.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>
          <p>Change background</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

