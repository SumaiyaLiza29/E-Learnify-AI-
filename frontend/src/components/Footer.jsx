import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Youtube, 
  Linkedin, 
  Twitter, 
  Instagram,
  Send,
  Shield,
  Award,
  Headphones,
  Sparkles,
  ChevronRight,
  Globe,
  DollarSign,
  CheckCircle,
  Users
} from "lucide-react";

const Footer = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } }
  };

  const socialLinks = [
    { icon: Facebook, label: "Facebook", color: "hover:bg-blue-600", href: "#" },
    { icon: Twitter, label: "Twitter", color: "hover:bg-sky-500", href: "#" },
    { icon: Instagram, label: "Instagram", color: "hover:bg-pink-600", href: "#" },
    { icon: Youtube, label: "YouTube", color: "hover:bg-red-600", href: "#" },
    { icon: Linkedin, label: "LinkedIn", color: "hover:bg-blue-700", href: "#" },
  ];

  const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    { path: "/pricing", label: "Pricing" },
    { path: "/about", label: "About Us" },
    { path: "/blog", label: "Blog" },
    { path: "/careers", label: "Careers" },
  ];

  const supportLinks = [
    { path: "/help", label: "Help Center" },
    { path: "/contact", label: "Contact Support" },
    { path: "/privacy", label: "Privacy Policy" },
    { path: "/terms", label: "Terms of Service" },
    { path: "/cookies", label: "Cookie Policy" },
    { path: "/accessibility", label: "Accessibility" },
  ];

  const categories = [
    { path: "/courses/web-dev", label: "Web Development" },
    { path: "/courses/data-science", label: "Data Science" },
    { path: "/courses/ai-ml", label: "AI & Machine Learning" },
    { path: "/courses/design", label: "UI/UX Design" },
    { path: "/courses/business", label: "Business" },
    { path: "/courses/marketing", label: "Digital Marketing" },
  ];

  const features = [
    { icon: Shield, label: "Secure Learning", desc: "Encrypted platform", color: "from-blue-500/20 to-blue-600/20" },
    { icon: Award, label: "Verified Certs", desc: "Industry recognized", color: "from-emerald-500/20 to-emerald-600/20" },
    { icon: Headphones, label: "24/7 Support", desc: "Always available", color: "from-purple-500/20 to-purple-600/20" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 to-black text-slate-200 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
      </div>

      {/* Main Footer */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <motion.div 
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="py-16 lg:py-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Brand & Newsletter */}
            <motion.div variants={fadeUp} className="space-y-8">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-75" />
                  <div className="relative flex items-center justify-center w-12 h-12 bg-slate-900 rounded-xl border border-slate-800">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    E-Learnify
                  </div>
                  <div className="text-sm text-slate-400">AI-Powered Learning Platform</div>
                </div>
              </div>

              <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
                Transform your career with intelligent, personalized learning experiences. 
                Join 50,000+ learners mastering new skills with AI-driven courses.
              </p>

              {/* Newsletter */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  Stay Updated
                </h3>
                <p className="text-slate-400">
                  Get weekly insights, course updates, and learning tips.
                </p>
                
                <motion.form 
                  initial={false}
                  whileHover={{ scale: 1.01 }}
                  className="flex gap-2"
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-shadow"
                  >
                    <span>Subscribe</span>
                    <Send className="w-4 h-4" />
                  </motion.button>
                </motion.form>
                
                <p className="text-xs text-slate-500">
                  By subscribing, you agree to our Privacy Policy
                </p>
              </div>
            </motion.div>

            {/* Right Column - Links Grid */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <motion.li
                      key={link.path}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Link
                        to={link.path}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                  Support
                </h4>
                <ul className="space-y-3">
                  {supportLinks.map((link) => (
                    <motion.li
                      key={link.path}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Link
                        to={link.path}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                  Categories
                </h4>
                <ul className="space-y-3">
                  {categories.map((link) => (
                    <motion.li
                      key={link.path}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Link
                        to={link.path}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>


        {/* Back to Top Button */}
        <motion.button
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow z-50"
        >
          <ChevronRight className="w-5 h-5 -rotate-90" />
        </motion.button>
      </div>
    </footer>
  );
};

export default Footer;