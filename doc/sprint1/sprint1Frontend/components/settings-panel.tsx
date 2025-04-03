"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { X, Sliders, Type, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type SettingsType = {
  fontSize: number;
  quoteDisplayTime: number;
  autoChangeQuotes: boolean;
  floatingAnimation: boolean;
};

const defaultSettings: SettingsType = {
  fontSize: 100,
  quoteDisplayTime: 30,
  autoChangeQuotes: false,
  floatingAnimation: true,
};

export default function SettingsPanel({ getNewQuote, setFloatingEnabled }: { getNewQuote: () => void; setFloatingEnabled: (value: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  const [quoteInterval, setQuoteInterval] = useState<NodeJS.Timeout | null>(null);
  // const { data: session } = useSession();

  // const handleSavePreferences = async () => {
  //   if (!session?.user?.email) return;

  //   try {
  //     const res = await fetch("http://localhost:5000/update-preferences", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: session.user.email,
  //         preferences: {
  //           fontSize: settings.fontSize,
  //           quoteDelay: settings.quoteDisplayTime,
  //           lightMode: true,
  //           doAnimation: settings.floatingAnimation,
  //           cycleQuotes: settings.autoChangeQuotes,
  //         },
  //       }),
  //     });

  //     const data = await res.json();
  //     if (data.success) {
  //       alert("Preferences saved!");
  //     } else {
  //       alert("Failed to save preferences.");
  //     }
  //   } catch (err) {
  //     console.error("Save error:", err);
  //     alert("Error saving preferences.");
  //   }
  // };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("quotewall-settings");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);

      // Apply text size immediately
      document.documentElement.style.setProperty("--quote-font-size", `${parsedSettings.fontSize}%`);

    }
  }, []);

  // Save settings and handle auto-change quotes
  useEffect(() => {
    localStorage.setItem("quotewall-settings", JSON.stringify(settings));

    // Apply text size
    document.documentElement.style.setProperty("--quote-font-size", `${settings.fontSize}%`);

    // Handle auto-change quotes
    if (settings.autoChangeQuotes) {
      if (quoteInterval) clearInterval(quoteInterval);
      const interval = setInterval(() => {
        getNewQuote();
      }, settings.quoteDisplayTime * 1000);
      setQuoteInterval(interval);
    } else {
      if (quoteInterval) clearInterval(quoteInterval);
    }

    return () => {
      if (quoteInterval) clearInterval(quoteInterval);
    };
  }, [settings, getNewQuote]);

  // Update settings state
  const updateSetting = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    setSettings((prevSettings) => {
      const newSettings = { ...prevSettings, [key]: value };
      localStorage.setItem("quotewall-settings", JSON.stringify(newSettings));
      return newSettings;
    });
  };

  return (
    <>
      {/* Settings Button */}
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="relative">
        <Sliders className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Settings</span>
      </Button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-screen w-full max-w-sm bg-background border-l border-border shadow-lg z-50 flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Settings</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Text Size */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Type className="h-5 w-5 mr-2" />
                      <h3 className="text-sm font-medium">Text Size</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">A</span>
                      <Slider
                        value={[settings.fontSize]}
                        min={70}
                        max={150}
                        step={5}
                        onValueChange={(value) => updateSetting("fontSize", value[0])}
                        className="flex-1"
                      />
                      <span className="text-lg font-semibold">A</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Quote Display Time */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      <h3 className="text-sm font-medium">Quote Display</h3>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-change" className="text-sm">
                        Auto-change quotes
                      </Label>
                      <Switch
                        id="auto-change"
                        checked={settings.autoChangeQuotes}
                        onCheckedChange={(checked) => updateSetting("autoChangeQuotes", checked)}
                      />
                    </div>

                    {settings.autoChangeQuotes && (
                      <div className="pt-2">
                        <Label className="text-sm mb-2 block">Change every {settings.quoteDisplayTime} seconds</Label>
                        <Slider
                          value={[settings.quoteDisplayTime]}
                          min={10}
                          max={120}
                          step={5}
                          onValueChange={(value) => updateSetting("quoteDisplayTime", value[0])}
                          className="flex-1"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>10s</span>
                          <span>120s</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Animation Settings */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Animation</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="floating-animation" className="text-sm">
                        Floating animation
                      </Label>
                      <Switch
                        id="floating-animation"
                        checked={settings.floatingAnimation}
                        onCheckedChange={(checked) => {
                          updateSetting("floatingAnimation", checked);
                          setFloatingEnabled(checked); // <-- Update floating animation state
                        }}
                      />

                    </div>
                  </div>

                  <Separator />

                  {/* Save Button */}
                  <Button
                    variant="default"
                    className="w-full mb-2"
                    //onClick={handleSavePreferences}
                  >
                    Save Preferences
                  </Button>

                  {/* Reset Button */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSettings(defaultSettings)}
                  >
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
