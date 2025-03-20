"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Facebook, Github, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsPanel from "@/components/settings-panel";
import ThemeToggle from "@/components/theme-toggle";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  // Signup handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Account created! Please log in.");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      alert("Invalid credentials. Please try again.");
    } else {
      router.push("/quotes"); // Redirect to quotes page after login
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 border-b border-border/40 backdrop-blur-md bg-background/80 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">The QuoteWall</h1>
          </div>
          <div className="flex items-center gap-2">
            <SettingsPanel getNewQuote={function (): void {
              throw new Error("Function not implemented.");
            } } setFloatingEnabled={function (value: boolean): void {
              throw new Error("Function not implemented.");
            } } />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="w-full max-w-md mt-16">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
                <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="w-full" onClick={() => signIn("google")}>
                <Mail className="h-4 w-4 mr-2" /> Google
              </Button>
              <Button variant="outline" className="w-full" onClick={() => signIn("github")}>
                <Github className="h-4 w-4 mr-2" /> GitHub
              </Button>
              <Button variant="outline" className="w-full" onClick={() => signIn("facebook")}>
                <Facebook className="h-4 w-4 mr-2" /> Facebook
              </Button>
            </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signup Form */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                  <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
                <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="w-full" onClick={() => signIn("google")}>
                <Mail className="h-4 w-4 mr-2" /> Google
              </Button>
              <Button variant="outline" className="w-full" onClick={() => signIn("github")}>
                <Github className="h-4 w-4 mr-2" /> GitHub
              </Button>
              <Button variant="outline" className="w-full" onClick={() => signIn("facebook")}>
                <Facebook className="h-4 w-4 mr-2" /> Facebook
              </Button>
            </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
