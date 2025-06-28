import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/Home";
import SellerDashboard from "@/pages/SellerDashboard";
import ProductDetail from "@/pages/ProductDetail";
import AboutMe from "@/pages/AboutMe";
import Account from "@/pages/Account";
import Cart from "@/pages/Cart";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/seller/dashboard" component={SellerDashboard} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/about" component={AboutMe} />
      <Route path="/account" component={Account} />
      <Route path="/cart" component={Cart} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;