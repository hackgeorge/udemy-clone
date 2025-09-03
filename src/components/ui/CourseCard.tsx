import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, Award } from 'lucide-react';
import Button from './Button';
import type { CourseResponse } from '../../types';

interface CourseCardProps {
  course: CourseResponse;
  onEnroll?: (courseId: string) => void;
  showEnrollButton?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onEnroll, 
  showEnrollButton = true 
}) => {
  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onEnroll) {
      onEnroll(course.id);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  return (
    <Link to={`/courses/${course.id}`} className="group block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Course Thumbnail */}
        <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative overflow-hidden">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {course.title.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          
          {course.isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="bg-orange-500 text-white px-2 py-1 text-xs font-semibold rounded">
                Featured
              </span>
            </div>
          )}
          
          {course.hasCertificate && (
            <div className="absolute top-3 right-3">
              <Award className="w-5 h-5 text-yellow-500 bg-white rounded-full p-1" />
            </div>
          )}
        </div>

        {/* Course Content */}
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {course.title}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {course.shortDescription}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span>{course.instructorName}</span>
            <span className="capitalize">{course.level.toLowerCase()}</span>
          </div>

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium text-gray-900">
                  {course.averageRating.toFixed(1)}
                </span>
                <span>({course.totalReviews})</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{course.enrolledStudentsCount.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(course.duration)}</span>
            </div>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ${course.discountedPrice || course.price}
              </span>
              {course.discountedPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${course.price}
                </span>
              )}
            </div>
            
            {showEnrollButton && !course.isEnrolled && (
              <Button
                size="sm"
                onClick={handleEnroll}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Enroll
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;