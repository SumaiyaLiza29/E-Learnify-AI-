import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { 
  Upload, 
  Video, 
  FileText, 
  Tag, 
  Clock, 
  DollarSign,
  BookOpen,
  ChevronRight,
  Sparkles,
  Check,
  X
} from 'lucide-react';

function CreateCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    category: 'Programming',
    tags: '',
    level: 'beginner',
    thumbnail: null,
    requirements: '',
    learningObjectives: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const file = e.target.files[0];
      if (file) {
        setFormData(prev => ({ ...prev, thumbnail: file }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (tag && !formData.tags.split(',').map(t => t.trim()).includes(tag)) {
        const newTags = formData.tags ? `${formData.tags}, ${tag}` : tag;
        setFormData({ ...formData, tags: newTags });
        e.target.value = '';
      }
    }
  };

  const removeTag = (tagToRemove) => {
    const tagsArray = formData.tags.split(',').map(tag => tag.trim());
    const updatedTags = tagsArray.filter(tag => tag !== tagToRemove);
    setFormData({ ...formData, tags: updatedTags.join(', ') });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const courseData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration) || 0
      };

      // Create FormData for file upload
      const formDataToSend = new FormData();
      Object.keys(courseData).forEach(key => {
        if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(courseData[key]));
        } else if (courseData[key] !== null && courseData[key] !== undefined) {
          formDataToSend.append(key, courseData[key]);
        }
      });

      await courseAPI.createCourse(formDataToSend);
      alert('Course created successfully!');
      navigate('/instructor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl">
              <BookOpen className="text-blue-400" size={28} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Create New Course
              </h1>
              <p className="text-gray-400 mt-2">
                Share your knowledge with thousands of students
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="font-bold">1</span>
                </div>
                <div className="ml-2 text-sm font-medium text-gray-300">Basic Info</div>
              </div>
              <div className="w-24 h-1 bg-gray-800 mx-4"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="font-bold text-gray-400">2</span>
                </div>
                <div className="ml-2 text-sm text-gray-500">Content</div>
              </div>
              <div className="w-24 h-1 bg-gray-800 mx-4"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="font-bold text-gray-400">3</span>
                </div>
                <div className="ml-2 text-sm text-gray-500">Pricing</div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-red-900/30 to-red-900/10 border border-red-700/50 rounded-2xl px-6 py-4 mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-900/50 rounded-lg">
                <X className="text-red-400" size={20} />
              </div>
              <div>
                <p className="font-medium text-red-300">{error}</p>
                <p className="text-sm text-red-200/70">Please check your inputs and try again</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Course Thumbnail Upload */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-800 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg">
                    <Upload className="text-blue-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Course Thumbnail</h2>
                </div>
                
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700 rounded-2xl bg-gray-900/30">
                  {previewImage ? (
                    <div className="relative w-full">
                      <img 
                        src={previewImage} 
                        alt="Thumbnail preview" 
                        className="w-full h-48 object-cover rounded-xl mb-4"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setFormData({ ...formData, thumbnail: null });
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto text-gray-500 mb-4" size={48} />
                      <p className="text-gray-400 mb-2">Drag & drop your thumbnail here</p>
                      <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                    </div>
                  )}
                  
                  <label className="cursor-pointer">
                    <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium hover:opacity-90 transition">
                      {previewImage ? 'Change Image' : 'Upload Thumbnail'}
                    </div>
                    <input
                      type="file"
                      name="thumbnail"
                      onChange={handleChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-800 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg">
                    <FileText className="text-blue-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Basic Information</h2>
                </div>

                <div className="space-y-6">
                  {/* Course Title */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-3">
                      <span className="text-red-400">*</span> Course Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                      placeholder="e.g., Complete React.js Course - From Beginner to Expert"
                    />
                  </div>

                  {/* Course Description */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-3">
                      <span className="text-red-400">*</span> Course Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                      placeholder="What will students learn in this course? What problems will it solve?"
                    ></textarea>
                    <p className="text-sm text-gray-500 mt-2">Minimum 200 characters recommended</p>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-800 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg">
                    <Tag className="text-blue-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Course Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-3">
                      <span className="text-red-400">*</span> Price (৳)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <DollarSign size={20} />
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1500"
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-3">
                      Duration (hours)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Clock size={20} />
                      </div>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        min="0"
                        className="w-full pl-12 pr-4 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-3">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Programming">Programming</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Personal Development">Personal Development</option>
                    </select>
                  </div>

                  {/* Level */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-3">
                      Level
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="all">All Levels</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <label className="block text-gray-300 font-medium mb-3">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.split(',').map((tag, index) => 
                      tag.trim() && (
                        <span 
                          key={index} 
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-full text-sm border border-blue-700/30"
                        >
                          {tag.trim()}
                          <button
                            type="button"
                            onClick={() => removeTag(tag.trim())}
                            className="text-gray-400 hover:text-white"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      )
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Type a tag and press Enter (e.g., react, javascript, frontend)"
                    onKeyDown={handleTagKeyDown}
                    className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  />
                </div>

                {/* Requirements */}
                <div className="mt-6">
                  <label className="block text-gray-300 font-medium mb-3">
                    Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                    placeholder="What should students know before taking this course?"
                  ></textarea>
                </div>

                {/* Learning Objectives */}
                <div className="mt-6">
                  <label className="block text-gray-300 font-medium mb-3">
                    Learning Objectives
                  </label>
                  <textarea
                    name="learningObjectives"
                    value={formData.learningObjectives}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                    placeholder="What will students be able to do after completing this course?"
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="sticky bottom-6 z-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Course...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Publish Course
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar - Preview & Tips */}
          <div className="space-y-8">
            {/* Course Preview */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-800 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4">Course Preview</h3>
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                  {previewImage ? (
                    <img src={previewImage} alt="Course thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="text-gray-700" size={48} />
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-bold text-white line-clamp-2">
                    {formData.title || "Your Course Title"}
                  </h4>
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {formData.description || "Course description will appear here"}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {formData.category || "Category"}
                    </span>
                    <span className="text-blue-400 font-bold">
                      {formData.price ? `৳${formData.price}` : "Price"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Creation Tips */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-800 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="text-yellow-400" size={20} />
                Pro Tips
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-900/30 rounded-lg">
                    <Check className="text-green-400" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">Clear Title</h4>
                    <p className="text-xs text-gray-400">Make it descriptive and keyword-rich</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-900/30 rounded-lg">
                    <Check className="text-blue-400" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">High-Quality Thumbnail</h4>
                    <p className="text-xs text-gray-400">Use 1280x720px images for best results</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-900/30 rounded-lg">
                    <Check className="text-purple-400" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">Detailed Description</h4>
                    <p className="text-xs text-gray-400">Include what students will learn</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-pink-900/30 rounded-lg">
                    <Check className="text-pink-400" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">Relevant Tags</h4>
                    <p className="text-xs text-gray-400">Add 5-10 tags for better discoverability</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Progress */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-800 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4">Completion Status</h3>
              
              <div className="space-y-4">
                {[
                  { label: "Title & Description", required: true, completed: !!formData.title && formData.description.length > 100 },
                  { label: "Thumbnail", required: true, completed: !!previewImage },
                  { label: "Price", required: true, completed: !!formData.price },
                  { label: "Category & Level", required: false, completed: !!formData.category && !!formData.level },
                  { label: "Tags", required: false, completed: formData.tags.split(',').filter(t => t.trim()).length >= 3 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.completed 
                          ? 'bg-green-900/50 text-green-400' 
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {item.completed ? <Check size={14} /> : index + 1}
                      </div>
                      <span className={`text-sm ${item.completed ? 'text-white' : 'text-gray-400'}`}>
                        {item.label}
                      </span>
                    </div>
                    {item.required && (
                      <span className="text-xs text-red-400">Required</span>
                    )}
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Overall Progress</span>
                    <span className="text-white font-bold">
                      {Math.round(([
                        !!formData.title && formData.description.length > 100,
                        !!previewImage,
                        !!formData.price,
                        !!formData.category && !!formData.level,
                        formData.tags.split(',').filter(t => t.trim()).length >= 3
                      ].filter(Boolean).length / 5) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${([
                          !!formData.title && formData.description.length > 100,
                          !!previewImage,
                          !!formData.price,
                          !!formData.category && !!formData.level,
                          formData.tags.split(',').filter(t => t.trim()).length >= 3
                        ].filter(Boolean).length / 5) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;