import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import BrowseExamPapersPage from "./pages/BrowseExamPapersPage";
import UploadPage from "./pages/UploadPage";
import UploadExamPaperPage from "./pages/UploadExamPaperPage";
import NoteDetailPage from "./pages/NoteDetailPage";
import ExamPaperDetailPage from "./pages/ExamPaperDetailPage";
import MyUploadsPage from "./pages/MyUploadsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
