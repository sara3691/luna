const User = require('../models/User');
const CareerInput = require('../models/CareerInput');

exports.getDashboardData = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find({}, '-password').sort({ createdAt: -1 });

        // Fetch all inputs to link them by email
        const inputs = await CareerInput.find().sort({ createdAt: -1 });

        // Merge inputs into user records for easy display
        const dashboardData = users.map(user => {
            const userInputs = inputs.filter(input => input.email.toLowerCase() === user.email.toLowerCase());
            return {
                ...user.toObject(),
                inputs: userInputs || []
            };
        });

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;
    
    // User requested specifically username: admin and password: luna@3
    if (username === 'admin' && password === 'luna@3') {
        return res.status(200).json({
            success: true,
            isAdmin: true,
            user: { name: 'Admin', role: 'admin' }
        });
    }

    return res.status(401).json({ message: 'Invalid admin credentials' });
};
