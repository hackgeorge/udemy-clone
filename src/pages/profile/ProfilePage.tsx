import React, { useState } from 'react';
import { Camera, Mail, MapPin, Calendar, BookOpen, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCourses } from '../../contexts/CourseContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { enrolledCourses, myCourses } = useCourses();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: '',
    website: '',
  });

  const handleSave = () => {
    // In real app, this would call an API to update user profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      location: '',
      website: '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {user?.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {user?.name?.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      label="Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <Input
                      label="Location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Your location"
                    />
                    <Input
                      label="Website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="Your website or portfolio"
                    />
                    <div className="flex space-x-3">
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                      <div className="flex items-center space-x-2 text-gray-600 mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user?.role === 'INSTRUCTOR' ? 'bg-purple-100 text-purple-800' :
                          user?.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user?.role === 'INSTRUCTOR' ? 'Instructor' : 
                           user?.role === 'ADMIN' ? 'Admin' : 'Student'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{user?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>Location not set</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Member since {new Date(user?.createdAt || '').getFullYear()}</span>
                      </div>
                    </div>

                    {user?.bio && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">About</h3>
                        <p className="text-gray-700">{user.bio}</p>
                      </div>
                    )}

                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      Edit Profile
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
            <div className="bg-blue-100 rounded-full p-3 w-fit mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {user?.role === 'INSTRUCTOR' ? myCourses.length : enrolledCourses.length}
            </h3>
            <p className="text-gray-600">
              {user?.role === 'INSTRUCTOR' ? 'Courses Created' : 'Courses Enrolled'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
            <div className="bg-green-100 rounded-full p-3 w-fit mx-auto mb-4">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {Math.floor(Math.random() * 10 + 2)}
            </h3>
            <p className="text-gray-600">Certificates Earned</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
            <div className="bg-purple-100 rounded-full p-3 w-fit mx-auto mb-4">
              <span className="text-purple-600 font-bold text-xl">★</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">4.8</h3>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </div>

        {/* Learning Activity or Teaching Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {user?.role === 'INSTRUCTOR' ? 'Teaching Activity' : 'Learning Activity'}
          </h2>
          
          <div className="space-y-4">
            {[1, 2, 3].map(item => (
              <div key={item} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user?.role === 'INSTRUCTOR' 
                        ? `Course "${myCourses[0]?.title || 'Sample Course'}" received new student` 
                        : `Completed lesson in "${enrolledCourses[0]?.title || 'Sample Course'}"`
                      }
                    </p>
                    <p className="text-sm text-gray-500">{item} days ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;