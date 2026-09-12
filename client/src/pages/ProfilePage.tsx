import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserProfile,
  saveUserProfile,
  getUserCommunityActivity,
  UserProfile,
} from "@/lib/profileService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Loader2,
  User,
  Mail,
  Building,
  GraduationCap,
  Save,
  Camera,
  LogOut,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Settings,
  Eye,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { DEPARTMENTS } from "@/data/academicConstants";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const queryClient = useQueryClient();

  // Determine if viewing own profile
  const isOwnProfile = !userId || (user && userId === user.id);
  const targetUserId = userId || user?.id || "";

  // Active tab when viewing own profile ("edit" | "preview") - defaults to public profile
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");

  // Form states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [bio, setBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Fetch profile for targetUserId
  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["user-profile", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      return await getUserProfile(targetUserId);
    },
    enabled: !!targetUserId,
  });

  // Fetch community activity (questions & answers) for targetUserId
  const activity = getUserCommunityActivity(targetUserId);

  // Synchronize form when own profile is loaded
  useEffect(() => {
    if (profile && isOwnProfile) {
      setFullName(profile.full_name || "");
      setDepartment(profile.department || "");
      setYear(profile.year ? String(profile.year) : "");
      setBio(profile.bio || "");
      setGithubUrl(profile.github_url || "");
      setLinkedinUrl(profile.linkedin_url || "");
      setTwitterUrl(profile.twitter_url || "");
      setWebsiteUrl(profile.website_url || "");
      setSkillsInput(profile.skills?.join(", ") || "");
    }
  }, [profile, isOwnProfile]);

  // Handle avatar image upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        toast.error("Failed to upload avatar image");
        return;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);
      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      await saveUserProfile(user.id, { avatar_url: avatarUrl });
      await queryClient.invalidateQueries({ queryKey: ["user-profile", user.id] });
      await refetchProfile();
      toast.success("Avatar image updated!");
    } catch (err) {
      toast.error("Could not complete avatar upload");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Save profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const parsedSkills = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      return await saveUserProfile(user.id, {
        full_name: fullName.trim(),
        department: department || null,
        year: year ? Number(year) : null,
        bio: bio.trim() || null,
        github_url: githubUrl.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        twitter_url: twitterUrl.trim() || null,
        website_url: websiteUrl.trim() || null,
        skills: parsedSkills,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", user?.id] });
      refetchProfile();
      toast.success("Profile & social links saved successfully!");
      setActiveTab("preview");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${targetUserId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard!");
    }
  };

  // Loading states
  if (authLoading || isProfileLoading) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Loading profile information...</p>
      </div>
    );
  }

  // If viewing "/profile" without logged-in session, redirect to login
  if (!userId && !user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize URL helper
  const formatUrl = (url: string, prefix: string = "https://") => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${prefix}${url}`;
  };

  // Public Profile Card Component (reused for other members & own preview)
  const renderPublicCard = (data: UserProfile) => {
    const initials =
      data.full_name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "AS";

    return (
      <div className="space-y-6">
        {/* Main Header Card */}
        <Card className="shadow-card overflow-hidden border-border/80">
          {/* Top Banner Accent */}
          <div className="h-24 sm:h-32 bg-hero-gradient relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShareProfile}
                className="h-8 text-xs bg-card/80 backdrop-blur-xs text-foreground hover:bg-card gap-1.5 shadow-xs"
              >
                <Share2 className="h-3.5 w-3.5" /> Share Profile
              </Button>
            </div>
          </div>

          <CardContent className="pt-0 relative px-4 sm:px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
              {/* Avatar with Ring */}
              <div className="relative">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-md">
                  <AvatarImage src={data.avatar_url || undefined} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Department & Year Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {data.department && (
                  <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20 py-1">
                    <Building className="h-3.5 w-3.5 mr-1" /> {data.department}
                  </Badge>
                )}
                {data.year && (
                  <Badge variant="secondary" className="text-xs py-1">
                    <GraduationCap className="h-3.5 w-3.5 mr-1" /> Year {data.year}
                  </Badge>
                )}
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs py-1 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified Student
                </Badge>
              </div>
            </div>

            {/* Name & Bio */}
            <div className="space-y-2 mb-5">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                {data.full_name || "Community Member"}
              </h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed max-w-2xl">
                {data.bio || "No bio added yet. Student at Amrita Sai Institute of Science & Technology."}
              </p>
            </div>

            {/* Social Links Row */}
            <div className="pt-3 border-t flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Connect:</span>
              {data.github_url && (
                <a
                  href={formatUrl(data.github_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-card text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors shadow-2xs"
                >
                  <Github className="h-4 w-4" /> GitHub <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              )}
              {data.linkedin_url && (
                <a
                  href={formatUrl(data.linkedin_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-card text-xs font-medium text-[#0A66C2] hover:border-[#0A66C2]/40 transition-colors shadow-2xs"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              )}
              {data.twitter_url && (
                <a
                  href={formatUrl(data.twitter_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-card text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors shadow-2xs"
                >
                  <Twitter className="h-4 w-4" /> Twitter/X <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              )}
              {data.website_url && (
                <a
                  href={formatUrl(data.website_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-card text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors shadow-2xs"
                >
                  <Globe className="h-4 w-4" /> Portfolio <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              )}

              {!data.github_url && !data.linkedin_url && !data.twitter_url && !data.website_url && (
                <span className="text-xs text-muted-foreground italic">No social profile links provided yet.</span>
              )}
            </div>

            {/* Skills Badges */}
            {data.skills && data.skills.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                <span className="text-xs font-semibold text-muted-foreground block mb-2">Skills & Tech Stack:</span>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs py-0.5 px-2 font-normal bg-muted">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Community Contributions & Activity Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" /> Community Contributions
            </h3>
            <span className="text-xs text-muted-foreground">
              {activity.totalContributions} total discussions & solutions
            </span>
          </div>

          {/* Activity Cards */}
          {activity.totalContributions === 0 ? (
            <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground text-xs">
              No questions or solutions posted in the Community yet.
            </div>
          ) : (
            <div className="space-y-3">
              {/* Questions asked by this user */}
              {activity.questions.map((q) => (
                <Link
                  key={q.id}
                  to={`/community/${q.id}`}
                  className="block rounded-xl border bg-card p-4 hover:border-primary/40 transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
                    <Badge variant="outline" className="text-[10px] py-0 h-4">
                      Question
                    </Badge>
                    <span>•</span>
                    <span className="font-semibold text-foreground">{q.subCommunity}</span>
                    <span>•</span>
                    <span>{q.answers?.length || 0} answers</span>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                    {q.title}
                  </h4>
                </Link>
              ))}

              {/* Answers shared by this user */}
              {activity.answers.map((item, idx) => (
                <Link
                  key={`${item.questionId}-${idx}`}
                  to={`/community/${item.questionId}`}
                  className="block rounded-xl border bg-card p-4 hover:border-primary/40 transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] py-0 h-4">
                      Solution Shared
                    </Badge>
                    <span>•</span>
                    <span>Answer on: &quot;{item.questionTitle}&quot;</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {item.answer.content}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // If viewing another community member's profile
  if (!isOwnProfile) {
    if (!profile) {
      return (
        <div className="container max-w-3xl py-12 text-center space-y-4">
          <User className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-bold font-display">Student Profile Not Found</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            This student has not completed their public profile or the user identifier is invalid.
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate("/community")} className="gap-1.5 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Community
          </Button>
        </div>
      );
    }

    return (
      <div className="container max-w-3xl py-8">
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-xs gap-1.5 text-muted-foreground hover:text-foreground h-8 px-2.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Button>
        </div>
        {renderPublicCard(profile)}
      </div>
    );
  }

  // VIEWING OWN PROFILE (Edit Mode & Preview Mode)
  return (
    <div className="container max-w-3xl py-8">
      {/* Clean Header */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            {activeTab === "preview" ? "Public Profile" : "Settings"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activeTab === "preview"
              ? "This is your public student profile visible to the Amrita Sai community."
              : "Update your details, bio, and social profile links visible to other students."}
          </p>
        </div>

        {activeTab === "preview" ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setActiveTab("edit")}
            className="h-9 w-9 shrink-0 bg-card shadow-2xs hover:bg-primary hover:text-primary-foreground transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("preview")}
            className="gap-1.5 text-xs h-9 shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Profile
          </Button>
        )}
      </div>

      {activeTab === "preview" ? (
        // Preview how others see your profile
        profile ? (
          renderPublicCard(profile)
        ) : (
          renderPublicCard({
            user_id: user?.id || "",
            full_name: fullName || user?.user_metadata?.full_name || "Student",
            department: department || null,
            year: year ? Number(year) : null,
            avatar_url: null,
            bio: bio || null,
            github_url: githubUrl || null,
            linkedin_url: linkedinUrl || null,
            twitter_url: twitterUrl || null,
            website_url: websiteUrl || null,
          })
        )
      ) : (
        // EDIT MODE FORM
        <Card className="shadow-card border-border/80">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              {/* Avatar Upload */}
              <div className="relative group">
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                    {fullName.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Upload profile photo"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="h-5 w-5 animate-spin text-background" />
                  ) : (
                    <Camera className="h-5 w-5 text-background" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>

              <div>
                <CardTitle className="text-xl font-bold">{fullName || "Student"}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  {user?.email}
                </CardDescription>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-primary hover:underline font-medium mt-1 inline-flex items-center gap-1"
                >
                  <Camera className="h-3 w-3" /> Change Photo
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Academic & Basic Info
              </h3>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-1.5 text-xs font-semibold">
                  <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Varma"
                  maxLength={100}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-xs font-semibold">
                    <Building className="h-3.5 w-3.5 text-muted-foreground" /> Department / Branch
                  </Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-xs font-semibold">
                    <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" /> Year of Study
                  </Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((y) => (
                        <SelectItem key={y} value={String(y)}>
                          Year {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bio" className="text-xs font-semibold">
                    Bio / About Me
                  </Label>
                  <span className="text-[11px] text-muted-foreground">{bio.length}/300</span>
                </div>
                <Textarea
                  id="bio"
                  rows={3}
                  maxLength={300}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a brief intro about yourself, your career focus, tech stack, or campus achievements..."
                  className="text-xs"
                />
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label htmlFor="skills" className="flex items-center gap-1.5 text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Skills & Tech Stack (comma separated)
                </Label>
                <Input
                  id="skills"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. Java, Python, React, Spring Boot, DSA, Machine Learning"
                />
              </div>
            </div>

            {/* Social Profile Links */}
            <div className="space-y-4 pt-4 border-t">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Social & Portfolio Links
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  These links will be clickable by other community members viewing your profile.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* GitHub */}
                <div className="space-y-1.5">
                  <Label htmlFor="github" className="flex items-center gap-1.5 text-xs font-semibold">
                    <Github className="h-3.5 w-3.5 text-foreground" /> GitHub Profile
                  </Label>
                  <Input
                    id="github"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="text-xs"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-1.5">
                  <Label htmlFor="linkedin" className="flex items-center gap-1.5 text-xs font-semibold">
                    <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" /> LinkedIn Profile
                  </Label>
                  <Input
                    id="linkedin"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="text-xs"
                  />
                </div>

                {/* Twitter / X */}
                <div className="space-y-1.5">
                  <Label htmlFor="twitter" className="flex items-center gap-1.5 text-xs font-semibold">
                    <Twitter className="h-3.5 w-3.5 text-foreground" /> Twitter / X Profile
                  </Label>
                  <Input
                    id="twitter"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://x.com/username"
                    className="text-xs"
                  />
                </div>

                {/* Personal Website / Portfolio */}
                <div className="space-y-1.5">
                  <Label htmlFor="website" className="flex items-center gap-1.5 text-xs font-semibold">
                    <Globe className="h-3.5 w-3.5 text-primary" /> Portfolio / Website
                  </Label>
                  <Input
                    id="website"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourportfolio.dev"
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t space-y-3">
              <Button
                className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90 font-semibold"
                onClick={() => updateProfileMutation.mutate()}
                disabled={updateProfileMutation.isPending || !fullName.trim()}
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Profile Changes
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive gap-2"
                onClick={async () => {
                  await signOut();
                  toast.success("Signed out successfully");
                }}
              >
                <LogOut className="h-4 w-4" /> Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
