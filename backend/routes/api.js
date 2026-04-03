const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const careerController = require('../controllers/careerController');
const adminDashboardController = require('../controllers/adminDashboardController');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Career routes
router.post('/save-input', careerController.saveInput);
router.get('/inputs', careerController.getInputs);

// Admin routes
router.post('/admin/login', adminDashboardController.adminLogin);
router.get('/admin/dashboard', adminDashboardController.getDashboardData);

module.exports = router;
