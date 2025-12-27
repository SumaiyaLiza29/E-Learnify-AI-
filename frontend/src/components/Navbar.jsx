import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Award, 
  Home, 
  BookOpen, 
  PlusCircle, 
  Shield,
  ChevronDown,
  Bell,
  Search,
  Sparkles,
  Bot,
  Users,
  BarChart3,
  Video,
  MessageSquare
} from "lucide-react";

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileOpen && !e.target.closest('.profile-dropdown')) {
        setProfileOpen(false);
      }
      if (notificationsOpen && !e.target.closest('.notifications-dropdown')) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [profileOpen, notificationsOpen]);

  if (!auth) return null;
  const { user, logout, loading } = auth;
  if (loading) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
    setProfileOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Function to get user's display name
  const getUserDisplayName = () => {
    if (!user) return "Guest";
    
    // Try different possible name fields
    if (user.name) return user.name;
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0];
    if (user.firstName) {
      return user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;
    }
    return "User";
  };

  // Function to get user's first initial
  const getUserInitial = () => {
    if (!user) return "G";
    
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  // Function to get user email
  const getUserEmail = () => {
    if (!user) return "";
    return user.email || user.username || "";
  };

  // Function to get user role with proper capitalization
  const getUserRole = () => {
    if (!user) return "Guest";
    
    const role = user.role || "learner";
    
    // Capitalize first letter and handle special cases
    const roleMap = {
      'admin': 'Admin',
      'ai_assistant': 'AI Assistant',
      'instructor': 'Instructor',
      'student': 'Student',
      'learner': 'Learner'
    };
    
    return roleMap[role.toLowerCase()] || 
           role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Get role color
  const getRoleColor = () => {
    if (!user) return "bg-slate-500/20 text-slate-300";
    
    const role = user.role || "learner";
    
    const colorMap = {
      'admin': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'ai_assistant': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      'instructor': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'student': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      'learner': 'bg-sky-500/20 text-sky-300 border-sky-500/30'
    };
    
    return colorMap[role.toLowerCase()] || 'bg-slate-500/20 text-slate-300';
  };

  // Navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      { path: "/dashboard", label: "Dashboard", icon: Home, visible: !!user },
      { path: "/courses", label: "Courses", icon: BookOpen, visible: true },
      { path: "/ai-assistant", label: "AI Assistant", icon: Bot, visible: !!user },
    ];

    const roleBasedItems = [];

    if (user?.role === "admin" || user?.role === "Admin") {
      roleBasedItems.push(
        { path: "/admin/dashboard", label: "Admin Dashboard", icon: Shield },
        { path: "/admin/users", label: "User Management", icon: Users },
        { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
        { path: "/admin/courses", label: "Course Management", icon: BookOpen }
      );
    }

    if (user?.role === "ai_assistant" || user?.role === "AI Assistant") {
      roleBasedItems.push(
        { path: "/ai/dashboard", label: "AI Dashboard", icon: Bot },
        { path: "/ai/analytics", label: "AI Analytics", icon: BarChart3 },
        { path: "/ai/chat", label: "Chat Assistant", icon: MessageSquare }
      );
    }

    if (user?.role === "instructor" || user?.role === "Instructor") {
      roleBasedItems.push(
        { path: "/create-course", label: "Create Course", icon: PlusCircle },
        { path: "/instructor/analytics", label: "Performance", icon: BarChart3 }
      );
    }

    return [...baseItems, ...roleBasedItems];
  };

  const navItems = getNavItems();

  const notificationItems = [
    { id: 1, title: "Welcome to E-Learnify!", message: "Complete your profile to get personalized recommendations", time: "2h ago", read: false },
    { id: 2, title: "New Course Available", message: "Advanced React Patterns has been added to your learning path", time: "1d ago", read: true },
    { id: 3, title: "Progress Milestone", message: "You've completed 10 courses this month!", time: "2d ago", read: true },
  ];

  // Logo Component
  const ELearnifyLogo = () => (
    <div className="flex items-center gap-2">
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-center w-10 h-10 bg-slate-900 rounded-lg border border-slate-700">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
      </motion.div>
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          E-Learnify
        </span>
        <span className="text-[10px] text-slate-400 -mt-1">AI Powered Learning</span>
      </div>
    </div>
  );

  return (
    <>
      {/* BACKDROP FOR MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/50 shadow-xl"
            : "bg-gradient-to-b from-slate-950 to-slate-950/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LOGO AND DESKTOP NAV */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <ELearnifyLogo />
              </Link>

              {/* DESKTOP NAVIGATION */}
              <div className="hidden md:flex items-center gap-1 ml-10">
                {navItems.map((item) => 
                  item.visible !== false && (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
                            : "text-slate-300 hover:text-white hover:bg-white/5"
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </NavLink>
                  )
                )}
              </div>
            </div>

            {/* RIGHT SIDE - DESKTOP */}
            <div className="hidden md:flex items-center gap-4">
              {/* SEARCH */}
              <motion.form
                initial={false}
                animate={{ width: searchOpen ? "280px" : "40px" }}
                onSubmit={handleSearch}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-slate-900/50 border border-slate-700 rounded-full transition-all duration-300 ${
                    searchOpen ? "w-full px-4 py-2 pr-10" : "w-0 opacity-0"
                  }`}
                />
                <button
                  type={searchOpen ? "submit" : "button"}
                  onClick={() => !searchOpen && setSearchOpen(true)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2.5 text-slate-400 hover:text-white"
                >
                  <Search className="w-4 h-4" />
                </button>
              </motion.form>

              {user ? (
                <>
                  {/* NOTIFICATIONS */}
                  <div className="relative notifications-dropdown">
                    <button
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Bell className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    <AnimatePresence>
                      {notificationsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
                        >
                          <div className="p-4 border-b border-slate-800">
                            <h3 className="font-semibold text-white">Notifications</h3>
                            <p className="text-sm text-slate-400">
                              {notificationItems.filter(n => !n.read).length} unread
                            </p>
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            {notificationItems.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/50 cursor-pointer ${
                                  !notification.read ? "bg-indigo-500/10" : ""
                                }`}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-medium text-white text-sm">
                                    {notification.title}
                                  </h4>
                                  <span className="text-xs text-slate-500">
                                    {notification.time}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-400">
                                  {notification.message}
                                </p>
                              </div>
                            ))}
                          </div>
                          <Link
                            to="/notifications"
                            className="block p-3 text-center text-sm text-indigo-400 hover:bg-slate-800"
                            onClick={() => setNotificationsOpen(false)}
                          >
                            View all notifications
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* PROFILE DROPDOWN */}
                  <div className="relative profile-dropdown">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-3 px-3 py-2 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 hover:border-indigo-500/50 transition-all group"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {getUserInitial()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                      </div>
                      <div className="hidden lg:block text-left">
                        <div className="text-sm font-medium text-white">
                          {getUserDisplayName()}
                        </div>
                        <div className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor()} inline-block mt-0.5`}>
                          {getUserRole()}
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                    </motion.button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden z-50"
                        >
                          {/* User Info */}
                          <div className="p-4 border-b border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                {getUserInitial()}
                              </div>
                              <div>
                                <div className="font-semibold text-white">
                                  {getUserDisplayName()}
                                </div>
                                <div className="text-sm text-slate-400">
                                  {getUserEmail()}
                                </div>
                              </div>
                            </div>
                            <div className={`text-xs px-3 py-1 rounded-full border ${getRoleColor()} inline-block`}>
                              {getUserRole()}
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <Link
                              to="/profile"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                              onClick={() => setProfileOpen(false)}
                            >
                              <User className="w-4 h-4" />
                              My Profile
                            </Link>
                            <Link
                              to="/certificates"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                              onClick={() => setProfileOpen(false)}
                            >
                              <Award className="w-4 h-4" />
                              Certificates
                            </Link>
                            <Link
                              to="/settings"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                              onClick={() => setProfileOpen(false)}
                            >
                              <Settings className="w-4 h-4" />
                              Settings
                            </Link>
                          </div>

                          <div className="border-t border-slate-800 p-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                // LOGIN/SIGNUP BUTTONS
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Sign in
                  </Link>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
                    >
                      Get Started Free
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="flex items-center gap-3 md:hidden">
              {user && (
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-slate-400"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
              )}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 h-screen w-80 bg-slate-950 border-l border-slate-800 shadow-2xl z-50 md:hidden"
            >
              <div className="p-6">
                {/* MOBILE HEADER */}
                <div className="flex items-center justify-between mb-8">
                  <ELearnifyLogo />
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* USER INFO */}
                {user && (
                  <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {getUserInitial()}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {getUserDisplayName()}
                        </div>
                        <div className="text-sm text-slate-400">
                          {getUserEmail()}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${getRoleColor()} inline-block mt-1`}>
                          {getUserRole()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MOBILE NAV ITEMS */}
                <div className="space-y-1 mb-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? "text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/20"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* MOBILE ACTIONS */}
                {user ? (
                  <div className="space-y-3">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5"
                    >
                      <User className="w-5 h-5" />
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5"
                    >
                      <Settings className="w-5 h-5" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-center rounded-lg bg-slate-800 text-white text-sm font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold"
                    >
                      Start Learning Free
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;