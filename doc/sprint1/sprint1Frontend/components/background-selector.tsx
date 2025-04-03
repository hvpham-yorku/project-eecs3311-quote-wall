"use client"

import { useEffect } from "react"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const backgrounds = [
  { id: "default", name: "Default", class: "bg-default" },
  { id: "soft-blue", name: "Soft Blue", class: "bg-soft-blue" },
  { id: "warm-sunset", name: "Warm Sunset", class: "bg-warm-sunset" },
  { id: "cool-mint", name: "Cool Mint", class: "bg-cool-mint" },
  { id: "purple-haze", name: "Purple Haze", class: "bg-purple-haze" },
]

interface BackgroundSelectorProps {
  selectedTheme: string
  onChangeTheme: (theme: string) => void
}

export default function BackgroundSelector({
  selectedTheme,
  onChangeTheme,
}: BackgroundSelectorProps) {
  useEffect(() => {
    // Apply background class to body
    document.body.className = backgrounds.find(bg => bg.id === selectedTheme)?.class || "bg-default"
    localStorage.setItem("quotewall-background", selectedTheme)
  }, [selectedTheme])

  // Load from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("quotewall-background")
    if (saved) onChangeTheme(saved)
  }, [onChangeTheme])

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
                onClick={() => onChangeTheme(bg.id)}
                className={selectedTheme === bg.id ? "bg-accent" : ""}
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
