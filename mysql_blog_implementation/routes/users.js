const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateUserUpdate, validateMongoId } = require('../middleware/validation');

// Middleware to validate MySQL integer ID
const validateIntId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`
      });
    }
    next();
  };
};

// POST /api/users - Create a new user
router.post('/', validateUser, userController.createUser);

// GET /api/users - Get all users
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', validateIntId('id'), userController.getUserById);

// PUT /api/users/:id - Update user
router.put('/:id', validateIntId('id'), validateUserUpdate, userController.updateUser);

// DELETE /api/users/:id - Delete user (soft delete)
router.delete('/:id', validateIntId('id'), userController.deleteUser);

// GET /api/users/:id/stats - Get user statistics
router.get('/:id/stats', validateIntId('id'), userController.getUserStats);

module.exports = router;
