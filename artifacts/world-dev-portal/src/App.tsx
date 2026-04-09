import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import MainLayout from "@/components/layout/main-layout";
import DocsLayout from "@/components/layout/docs-layout";
import Home from "@/pages/home";
import DocsIndex from "@/pages/docs/index";
import DocArticle from "@/pages/docs/article";
import SDKs from "@/pages/sdks/index";
import Changelog from "@/pages/changelog/index";
import Contact from "@/pages/contact/index";
import Status from "@/pages/status/index";
import Capabilities from "@/pages/capabilities/index";
import Sources from "@/pages/sources/index";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sdks" component={SDKs} />
      <Route path="/changelog" component={Changelog} />
      <Route path="/contact" component={Contact} />
      <Route path="/status" component={Status} />
      <Route path="/capabilities" component={Capabilities} />
      <Route path="/sources" component={Sources} />
      <Route path="/docs" component={DocsIndex} />
      <Route path="/docs/:slug" component={DocArticle} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="world-dev-portal-theme">
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Switch>
              <Route path="/docs*">
                <DocsLayout>
                  <Router />
                </DocsLayout>
              </Route>
              <Route>
                <MainLayout>
                  <Router />
                </MainLayout>
              </Route>
            </Switch>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
