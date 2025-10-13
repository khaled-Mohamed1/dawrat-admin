import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { getTopCourses } from '../../../api/courseService';

const CourseTable = () => {
    const [courses, setCourses] = useState([]);
    const [filter, setFilter] = useState('latest');
    const [isLoading, setIsLoading] = useState(true);
    // **NEW**: State to control how many courses are shown
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            const topCoursesData = await getTopCourses(filter);
            setCourses(topCoursesData);
            setIsLoading(false);
        };

        fetchCourses();
    }, [filter]);

    // **NEW**: Slice the array to show only the desired number of courses
    const coursesToDisplay = showAll ? courses : courses.slice(0, 5);

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Icon
                    key={i}
                    name="Star"
                    size={14}
                    className={i < fullStars ? "text-yellow-400 fill-current" : "text-gray-300"}
                />
            );
        }
        return stars;
    };

    const formatRevenue = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const filterOptions = ['latest', 'sales', 'enrollments', 'rating'];

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-lg font-medium text-foreground mb-3 sm:mb-0">Top Performing Courses</h3>
                <div className="flex items-center space-x-1 bg-muted p-1 rounded-md">
                    {filterOptions.map((option) => (
                        <Button
                            key={option}
                            // This is the only line that needs to change:
                            variant={filter === option ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setFilter(option)}
                            className="capitalize transition-colors duration-200"
                        >
                            {option}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    {/* Table Head remains the same */}
                    <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">#</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Course</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Instructor</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Sales</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Enrollments</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Rating</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Revenue</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => ( // Skeleton loader for 5 items
                            <tr key={index} className="border-b border-border">
                                <td colSpan="7" className="py-4 px-2">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                </td>
                            </tr>
                        ))
                    ) : coursesToDisplay.length > 0 ? (
                        // **UPDATED**: Map over the sliced array
                        coursesToDisplay.map((course, index) => (
                            <tr key={course.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                                <td className="py-4 px-2">
                                    <div className="font-medium text-foreground text-sm">{++index}</div>
                                </td>
                                <td className="py-4 px-2">
                                    <div className="font-medium text-foreground text-sm">{course.name}</div>
                                </td>
                                <td className="py-4 px-2">
                                    <div className="text-sm text-muted-foreground">{course.instructor}</div>
                                </td>
                                <td className="py-4 px-2 text-center">
                                    <div className="text-sm font-medium text-foreground">{course.sales}</div>
                                </td>
                                <td className="py-4 px-2 text-center">
                                    <div className="text-sm text-foreground">{course.enrollments.toLocaleString()}</div>
                                </td>
                                <td className="py-4 px-2 text-center">
                                    <div className="flex items-center justify-center space-x-1">
                                        {renderStars(course.rating)}
                                        <span className="text-sm font-medium text-foreground ml-1">{course.rating.toFixed(1)}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-2 text-right">
                                    <div className="text-sm font-medium text-green-600">{formatRevenue(course.revenue)}</div>
                                </td>
                                <td className="py-4 px-2 text-center">
                                    <Button variant="ghost" size="sm">
                                        <Icon name="Eye" size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-10 text-muted-foreground">
                                No courses found for this filter.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* **UPDATED**: Dynamic "Show More" / "Show Less" button */}
            {courses.length > 5 && (
                <div className="mt-6 text-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'Show Less' : 'Show More'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CourseTable;