import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">UdemyClone</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Empowering millions of learners worldwide with high-quality online education.
              Learn from the best instructors and advance your career.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/courses" className="block text-gray-400 hover:text-white transition-colors">
                All Courses
              </Link>
              <Link to="/categories" className="block text-gray-400 hover:text-white transition-colors">
                Categories
              </Link>
              <Link to="/instructors" className="block text-gray-400 hover:text-white transition-colors">
                Become an Instructor
              </Link>
              <Link to="/business" className="block text-gray-400 hover:text-white transition-colors">
                Business Solutions
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <div className="space-y-3">
              <Link to="/help" className="block text-gray-400 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link to="/privacy" className="block text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Learning */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Learning</h3>
            <div className="space-y-3">
              <Link to="/mobile" className="block text-gray-400 hover:text-white transition-colors">
                Mobile App
              </Link>
              <Link to="/certificates" className="block text-gray-400 hover:text-white transition-colors">
                Certificates
              </Link>
              <Link to="/blog" className="block text-gray-400 hover:text-white transition-colors">
                Blog
              </Link>
              <Link to="/resources" className="block text-gray-400 hover:text-white transition-colors">
                Free Resources
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 UdemyClone. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <Link to="/accessibility" className="text-gray-400 hover:text-white text-sm transition-colors">
              Accessibility
            </Link>
            <Link to="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
              Sitemap
            </Link>
            <select className="bg-transparent border border-gray-600 rounded px-3 py-1 text-sm text-gray-400">
              <option value="en">English</option>
              <option value="az">Azərbaycan</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;