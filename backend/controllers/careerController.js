const CareerInput = require('../models/CareerInput');
const User = require('../models/User');

exports.saveInput = async (req, res) => {
    try {
        const { email, name, marks, location, preferences, aiSuggestion, source } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required to save data' });
        }

        // Optional: Verify user exists before saving data
        const user = await User.findOne({ email });
        // Even if user not found, we save it but flag it or handle it. 
        // User requested: "login finish pannidu then web page kulla iruka data mattum than direct aah save pannanum"
        if (!user) {
            return res.status(403).json({ message: 'User not authenticated. Please login first.' });
        }

        const newInput = new CareerInput({
            email,
            name: name || user.name, // Use provided name or name from user record
            marks,
            location,
            preferences,
            aiSuggestion,
            source: source || 'Web App'
        });

        await newInput.save();
        res.status(201).json({ message: 'Career assessment data saved successfully', data: newInput });
    } catch (error) {
        console.error('Error saving input:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getInputs = async (req, res) => {
    try {
        const inputs = await CareerInput.find().sort({ createdAt: -1 });
        res.status(200).json(inputs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
