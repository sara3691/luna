const mongoose = require('mongoose');

const careerInputSchema = new mongoose.Schema({
    // Relationship linked via email as requested
    email: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: false
    },
    marks: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    preferences: {
        type: [String],
        required: false
    },
    aiSuggestion: {
        type: Object,
        required: false
    },
    source: {
        type: String,
        default: 'Web App'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CareerInput', careerInputSchema);
