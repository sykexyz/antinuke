import React from 'react';
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ThemeProvider } from "@/components/ThemeProvider";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CursorTrail } from "@/components/CursorTrail";
import { FloatingActionButton } from "@/components/FloatingActionButton";

import Home from "@/pages/home";
import About from "@/pages/about";
import Developer from "@/pages/developer";
import Commands from "@/pages/commands";
import Status from "@/pages/status";
import TOS from "@/pages/tos";
import Privacy from "@/pages/privacy";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/developer" component={Developer} />
      <Route path="/commands" component={Commands} />
      <Route path="/status" component={Status} />
      <Route path="/tos" component={TOS} />
      <Route path="/privacy" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BackgroundEffects />
          <CursorTrail />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Navbar />
            <main className="relative z-10 flex-grow flex flex-col">
              <Router />
            </main>
            <Footer />
            <FloatingActionButton />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
