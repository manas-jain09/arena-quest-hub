
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AutoLogin from "./pages/AutoLogin";
import { ArticleView } from "./components/ArticleView";
import { ReactNode } from "react";

// Create a client
const queryClient = new QueryClient();

// Create a wrapper component to properly use the QueryClientProvider
const QueryProviderWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <QueryProviderWrapper>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auto-login" element={<AutoLogin />} />
          <Route path="/articles/:questionId" element={<ArticleView />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </QueryProviderWrapper>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
