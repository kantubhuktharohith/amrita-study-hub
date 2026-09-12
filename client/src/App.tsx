import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileUploadFAB from "@/components/MobileUploadFAB";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import BrowseExamPapersPage from "./pages/BrowseExamPapersPage";
import UploadPage from "./pages/UploadPage";
import UploadExamPaperPage from "./pages/UploadExamPaperPage";
import NoteDetailPage from "./pages/NoteDetailPage";
import ExamPaperDetailPage from "./pages/ExamPaperDetailPage";
import MyUploadsPage from "./pages/MyUploadsPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import CareerGuidancePage from "./pages/CareerGuidancePage";
import CommunityPage from "./pages/CommunityPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TechNewsPage from "./pages/TechNewsPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes in-memory cache to prevent spamming database
      gcTime: 10 * 60 * 1000, // Keep unused data in memory for 10 minutes
      refetchOnWindowFocus: false, // Prevent re-fetching when students switch tabs
      retry: 1, // Single retry on transient network errors
    },
  },
});

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex min-h-screen flex-col pb-14 md:pb-0">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/browse" element={<BrowsePage />} />
                  <Route path="/exam-papers" element={<BrowseExamPapersPage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/upload-exam-paper" element={<UploadExamPaperPage />} />
                  <Route path="/note/:id" element={<NoteDetailPage />} />
                  <Route path="/exam-paper/:id" element={<ExamPaperDetailPage />} />
                  <Route path="/my-uploads" element={<MyUploadsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/:userId" element={<ProfilePage />} />
                  <Route path="/career-guidance" element={<CareerGuidancePage />} />
                  <Route path="/career" element={<CareerGuidancePage />} />
                  <Route path="/tech-news" element={<TechNewsPage />} />
                  <Route path="/news" element={<TechNewsPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/community/:id" element={<QuestionDetailPage />} />
                  <Route path="/discuss" element={<CommunityPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/admin" element={<AdminPanelPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <MobileUploadFAB />
              <MobileBottomNav />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
