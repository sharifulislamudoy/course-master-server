const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Course Model
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    instructor: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    syllabus: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: String,
        trim: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    batches: [{
        name: String,
        startDate: Date,
        endDate: Date,
        maxStudents: Number,
        currentStudents: {
            type: Number,
            default: 0
        }
    }],
    thumbnail: {
        type: String,
        trim: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Course = mongoose.model('Course', courseSchema);

// JWT Middleware
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'fullName email');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single course
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('createdBy', 'fullName email');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get unique categories and instructors
router.get('/filters/all', async (req, res) => {
    try {
        const categories = await Course.distinct('category');
        const instructors = await Course.distinct('instructor');

        res.json({
            categories: categories.filter(Boolean),
            instructors: instructors.filter(Boolean)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Server-side pagination, search, and filtering
router.get('/list', async (req, res) => {
    try {
        const {
            search,
            category,
            sort = 'newest',
            page = 1,
            limit = 9
        } = req.query;

        // Build query
        let query = {};

        // Search by title or instructor
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { instructor: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Build sort options
        let sortOptions = {};
        switch (sort) {
            case 'price_low':
                sortOptions.price = 1;
                break;
            case 'price_high':
                sortOptions.price = -1;
                break;
            case 'popular':
                // Sort by total students in batches
                // This is a simplified approach - you might want to calculate popularity differently
                sortOptions = {
                    'batches.currentStudents': -1,
                    createdAt: -1
                };
                break;
            default: // 'newest'
                sortOptions.createdAt = -1;
        }

        // Calculate pagination
        const currentPage = parseInt(page);
        const itemsPerPage = parseInt(limit);
        const skip = (currentPage - 1) * itemsPerPage;

        // Get total count
        const totalCount = await Course.countDocuments(query);

        // Get courses with pagination
        const courses = await Course.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(itemsPerPage)
            .populate('createdBy', 'fullName email')
            .lean(); // Use lean() for better performance

        // Calculate total students for each course
        const coursesWithStats = courses.map(course => {
            const totalStudents = course.batches.reduce(
                (sum, batch) => sum + (batch.currentStudents || 0), 0
            );
            return {
                ...course,
                totalStudents
            };
        });

        res.json({
            courses: coursesWithStats,
            currentPage,
            totalPages: Math.ceil(totalCount / itemsPerPage),
            totalCount,
            itemsPerPage
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create new course (Protected)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const {
            title,
            description,
            instructor,
            price,
            category,
            syllabus,
            duration,
            level,
            batches,
            thumbnail
        } = req.body;

        // Validate required fields
        if (!title || !instructor || !price || !category || !syllabus) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const course = new Course({
            title,
            description,
            instructor,
            price,
            category,
            syllabus,
            duration,
            level,
            batches: batches || [],
            thumbnail,
            createdBy: req.user.userId
        });

        await course.save();

        // Populate creator info
        await course.populate('createdBy', 'fullName email');

        res.status(201).json({
            message: 'Course created successfully',
            course
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update course (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const {
            title,
            description,
            instructor,
            price,
            category,
            syllabus,
            duration,
            level,
            batches,
            thumbnail,
            isPublished
        } = req.body;

        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Update fields
        if (title !== undefined) course.title = title;
        if (description !== undefined) course.description = description;
        if (instructor !== undefined) course.instructor = instructor;
        if (price !== undefined) course.price = price;
        if (category !== undefined) course.category = category;
        if (syllabus !== undefined) course.syllabus = syllabus;
        if (duration !== undefined) course.duration = duration;
        if (level !== undefined) course.level = level;
        if (batches !== undefined) course.batches = batches;
        if (thumbnail !== undefined) course.thumbnail = thumbnail;
        if (isPublished !== undefined) course.isPublished = isPublished;

        course.updatedAt = Date.now();

        await course.save();

        res.json({
            message: 'Course updated successfully',
            course
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete course (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await course.deleteOne();

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;