import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, Building, Share2, Upload, CheckCircle, Sparkles, Heart } from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  email: string;
  college: string;
  file: File | null;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    college: '',
    file: null
  });
  
  const [shareCount, setShareCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Check if user has already submitted
  useEffect(() => {
    const submitted = localStorage.getItem('techForGirlsSubmitted');
    if (submitted === 'true') {
      setIsSubmitted(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
    if (errors.file) {
      setErrors(prev => ({ ...prev, file: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.college.trim()) newErrors.college = 'College/Department is required';
    if (!formData.file) newErrors.file = 'Please upload a file';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppShare = () => {
    if (shareCount < 5) {
      const message = encodeURIComponent("Hey Buddy, Join Tech For Girls Community\n\nJoin our WhatsApp group: https://chat.whatsapp.com/JhI9mzju3Dq7647A1U3zuY?mode=ac_c");
      const whatsappUrl = `https://wa.me/?text=${message}`;
      window.open(whatsappUrl, '_blank');
      setShareCount(prev => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (shareCount < 5) {
      alert('Please complete sharing on WhatsApp (5/5) before submitting!');
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Create form data for Google Apps Script
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('college', formData.college);
      formDataToSend.append('file', formData.file?.name || 'No file uploaded');

      // Replace this URL with your actual Google Apps Script Web App URL
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbysxW-0ObtYWopelAKVf-eroUW_-p_83gCAuyYVdhKw3tLhMeyi-OClSv_ankhvfjKZ/exec';
      
      // Submit to Google Sheets
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Submission failed');
      }
      
      setIsSubmitted(true);
      localStorage.setItem('techForGirlsSubmitted', 'true');
    } catch (error) {
      console.error('Submission error:', error);
      alert(`There was an error submitting the form: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                🎉 Success!
              </h1>
              <p className="text-xl text-white/90">
                Your submission has been recorded. Thanks for being part of Tech for Girls!
              </p>
            </div>
            <div className="flex justify-center space-x-2">
              <Heart className="w-6 h-6 text-red-400 animate-pulse" />
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              <Heart className="w-6 h-6 text-red-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl mb-4 animate-bounce">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Tech for Girls
          </h1>
          <p className="text-xl text-white/80">
            Join our amazing community of tech enthusiasts!
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
                Basic Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-white/60" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                      placeholder="Enter your name"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-white/60" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                      placeholder="Enter your phone number"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Email ID</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-white/60" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">College/Department</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-5 h-5 text-white/60" />
                  <select
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    disabled={isLoading}
                  >
                    <option value="" className="bg-gray-800">Select your college/department</option>
                    <option value="Computer Science" className="bg-gray-800">Computer Science</option>
                    <option value="Information Technology" className="bg-gray-800">Information Technology</option>
                    <option value="Electronics" className="bg-gray-800">Electronics</option>
                    <option value="Mechanical" className="bg-gray-800">Mechanical</option>
                    <option value="Civil" className="bg-gray-800">Civil</option>
                    <option value="Other" className="bg-gray-800">Other</option>
                  </select>
                </div>
                {errors.college && <p className="text-red-400 text-sm mt-1">{errors.college}</p>}
              </div>
            </div>

            {/* WhatsApp Sharing Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Share2 className="w-6 h-6 mr-2 text-green-400" />
                Share with Friends
              </h2>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <div>
                    <p className="text-white/80 text-sm mb-2">
                      Help us grow by sharing with your friends!
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">Click count:</span>
                      <span className="text-2xl font-bold text-green-400">{shareCount}/5</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    disabled={shareCount >= 5 || isLoading}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                      shareCount >= 5 
                        ? 'bg-green-500 text-white cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105'
                    }`}
                  >
                    <Share2 className="w-5 h-5" />
                    <span>{shareCount >= 5 ? 'Sharing Complete!' : 'Share on WhatsApp'}</span>
                  </button>
                </div>
                
                {shareCount >= 5 && (
                  <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                    <p className="text-green-400 text-sm font-medium">
                      ✅ Sharing complete. Please continue.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Upload className="w-6 h-6 mr-2 text-blue-400" />
                Upload Screenshot/Resume
              </h2>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    id="fileUpload"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="fileUpload"
                    className="block w-full p-8 border-2 border-dashed border-white/30 rounded-xl text-center cursor-pointer hover:border-white/50 transition-all duration-300 hover:bg-white/5"
                  >
                    <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
                    <p className="text-white/80 text-lg mb-2">
                      {formData.file ? formData.file.name : 'Click to upload your file'}
                    </p>
                    <p className="text-white/60 text-sm">
                      Supported formats: Images, PDF, DOC, DOCX
                    </p>
                  </label>
                </div>
                {errors.file && <p className="text-red-400 text-sm mt-2">{errors.file}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading || shareCount < 5}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                  isLoading || shareCount < 5
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : shareCount < 5 ? (
                  `Complete sharing first (${shareCount}/5)`
                ) : (
                  'Submit Registration'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;