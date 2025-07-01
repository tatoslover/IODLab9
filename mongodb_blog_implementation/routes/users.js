const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateUserUpdate, validateMongoId } = require('../middleware/validation');

// POST /api/users - Create a new user
router.post('/', validateUser, userController.createUser);

// GET /api/users - Get all users
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', validateMongoId('id'), userController.getUserById);

// PUT /api/users/:id - Update user
router.put('/:id', validateMongoId('id'), validateUserUpdate, userController.updateUser);

// DELETE /api/users/:id - Delete user (soft delete)
router.delete('/:id', validateMongoId('id'), userController.deleteUser);

module.exports = router;
