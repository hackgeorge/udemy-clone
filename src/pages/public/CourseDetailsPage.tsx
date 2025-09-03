import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, Clock, Users, Star, Award, CheckCircle, Globe, 
  BarChart3, Bookmark, Share, ThumbsUp, MessageCircle 
} from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentCourse, isLoading, loadCourseById, enrollInCourse } = useCourses();
  const { isAuthenticated, user } = useAuth();
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      loadCourseById(id);
    }
  }, [id]);

  if (isLoading || !currentCourse) {
    return <Loading text="Loading course details..." />;
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      return; // Redirect to login handled by UI
    }
    
    try {
      setIsEnrolling(true);
      await enrollInCourse(currentCourse.id);
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const course = currentCourse;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Link 
                  to={`/categories/${course.categoryId}`}
                  className="text-yellow-300 hover:text-yellow-200 font-medium transition-colors"
                >
                  {course.categoryName}
                </Link>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-gray-200 leading-relaxed">
                {course.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(course.averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{course.averageRating.toFixed(1)}</span>
                  <span className="text-gray-300">({course.totalReviews} reviews)</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{course.enrolledStudentsCount.toLocaleString()} students</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{formatDuration(course.duration)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="capitalize">{course.level.toLowerCase()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>{course.language}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructorName}`}
                  alt={course.instructorName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">Created by {course.instructorName}</p>
                  <p className="text-gray-300">Expert Instructor</p>
                </div>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-xl p-6 text-gray-900 sticky top-8">
                {/* Preview Video */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-6 relative overflow-hidden">
                  {course.previewVideoUrl ? (
                    <img
                      src={course.thumbnailUrl || `https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg`}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Play className="w-16 h-16 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                      <Play className="w-6 h-6 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${course.discountedPrice || course.price}
                    </span>
                    {course.discountedPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ${course.price}
                      </span>
                    )}
                  </div>
                  {course.discountedPrice && (
                    <p className="text-sm text-green-600 font-semibold">
                      {Math.round(((course.price - course.discountedPrice) / course.price) * 100)}% off
                    </p>
                  )}
                </div>

                {/* Enrollment Button */}
                <div className="space-y-4 mb-6">
                  {course.isEnrolled ? (
                    <Link to={`/courses/${course.id}/learn`}>
                      <Button size="lg" className="w-full">
                        Continue Learning
                      </Button>
                    </Link>
                  ) : (
                    <>
                      {isAuthenticated ? (
                        <Button 
                          size="lg" 
                          className="w-full"
                          isLoading={isEnrolling}
                          onClick={handleEnroll}
                        >
                          Enroll Now
                        </Button>
                      ) : (
                        <Link to="/login">
                          <Button size="lg" className="w-full">
                            Login to Enroll
                          </Button>
                        </Link>
                      )}
                    </>
                  )}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Wishlist
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Course Features */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{course.totalLectures} lectures</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Full HD video content</span>
                  </div>
                  {course.hasLifetimeAccess && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Lifetime access</span>
                    </div>
                  )}
                  {course.hasCertificate && (
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-green-500" />
                      <span>Certificate of completion</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Access on mobile and TV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Course */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About this course</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            {/* What You'll Learn */}
            {course.whatYouWillLearn && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {course.whatYouWillLearn}
                  </p>
                </div>
              </div>
            )}

            {/* Requirements */}
            {course.requirements && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {course.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Target Audience */}
            {course.targetAudience && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Who this course is for</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {course.targetAudience}
                  </p>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>
              
              <div className="flex items-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {course.averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(course.averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{course.totalReviews} reviews</p>
                </div>

                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map(stars => (
                    <div key={stars} className="flex items-center space-x-2">
                      <span className="text-sm font-medium w-8">{stars}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${Math.random() * 80 + 10}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {Math.floor(Math.random() * 30 + 5)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-6">
                {[1, 2, 3].map(reviewId => (
                  <div key={reviewId} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reviewId}`}
                        alt="Reviewer"
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Student {reviewId}</h4>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">
                          Great course! The instructor explains concepts clearly and the hands-on projects really help solidify the learning.
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span>Helpful (23)</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span>Reply</span>
                          </button>
                          <span>2 weeks ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <div className="text-center">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructorName}`}
                    alt={course.instructorName}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.instructorName}
                  </h3>
                  <p className="text-gray-600 mb-4">Expert Instructor</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-gray-900">4.7</div>
                      <div className="text-gray-600">Instructor Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">12,847</div>
                      <div className="text-gray-600">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">65,741</div>
                      <div className="text-gray-600">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">47</div>
                      <div className="text-gray-600">Courses</div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Details */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Course Curriculum */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(section => (
                <div key={section} className="border border-gray-200 rounded-lg">
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      Section {section}: Introduction to Core Concepts
                    </h3>
                    <p className="text-sm text-gray-600">
                      {Math.floor(Math.random() * 8 + 3)} lectures • {formatDuration(Math.floor(Math.random() * 120 + 30))}
                    </p>
                  </div>
                  <div className="space-y-2 p-4">
                    {[1, 2, 3].map(lecture => (
                      <div key={lecture} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <Play className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            Lecture {lecture}: Understanding the Basics
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {Math.floor(Math.random() * 20 + 5)}:00
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailsPage;