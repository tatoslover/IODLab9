const { body, query, param, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Character ID validation
const validateCharacterId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Character ID must be a positive integer'),

  handleValidationErrors
];

// Favorite ID validation
const validateFavoriteId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Favorite ID must be a positive integer'),

  handleValidationErrors
];

// Character search validation
const validateCharacterSearch = [
  query('q')
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters')
    .trim(),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('status')
    .optional()
    .isIn(['alive', 'dead', 'unknown'])
    .withMessage('Status must be: alive, dead, or unknown'),

  query('species')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Species cannot exceed 50 characters')
    .trim(),

  query('gender')
    .optional()
    .isIn(['female', 'male', 'genderless', 'unknown'])
    .withMessage('Gender must be: female, male, genderless, or unknown'),

  handleValidationErrors
];

// Character filter validation
const validateCharacterFilter = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
    .trim(),

  query('status')
    .optional()
    .isIn(['alive', 'dead', 'unknown'])
    .withMessage('Status must be: alive, dead, or unknown'),

  query('species')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Species cannot exceed 50 characters')
    .trim(),

  query('type')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Type cannot exceed 50 characters')
    .trim(),

  query('gender')
    .optional()
    .isIn(['female', 'male', 'genderless', 'unknown'])
    .withMessage('Gender must be: female, male, genderless, or unknown'),

  handleValidationErrors
];

// Status parameter validation
const validateStatusParam = [
  param('status')
    .isIn(['alive', 'dead', 'unknown'])
    .withMessage('Status must be: alive, dead, or unknown'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  handleValidationErrors
];

// Species parameter validation
const validateSpeciesParam = [
  param('species')
    .notEmpty()
    .withMessage('Species is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Species must be between 1 and 50 characters')
    .trim(),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  handleValidationErrors
];

// Multiple characters validation
const validateMultipleCharacters = [
  body('ids')
    .isArray({ min: 1, max: 20 })
    .withMessage('IDs must be an array with 1-20 character IDs'),

  body('ids.*')
    .isInt({ min: 1 })
    .withMessage('Each ID must be a positive integer'),

  handleValidationErrors
];

// Add favorite validation
const validateAddFavorite = [
  body('characterId')
    .isInt({ min: 1 })
    .withMessage('Character ID must be a positive integer'),

  handleValidationErrors
];

// Update favorite notes validation
const validateUpdateFavoriteNotes = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Favorite ID must be a positive integer'),

  body('notes')
    .isString()
    .withMessage('Notes must be a string')
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
    .trim(),

  handleValidationErrors
];

// Recent favorites validation
const validateRecentFavorites = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  handleValidationErrors
];

// Date range validation
const validateDateRange = [
  query('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),

  query('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((endDate, { req }) => {
      const startDate = new Date(req.query.startDate);
      const end = new Date(endDate);

      if (end <= startDate) {
        throw new Error('End date must be after start date');
      }

      return true;
    }),

  handleValidationErrors
];

// Compare characters validation
const validateCompareCharacters = [
  param('id1')
    .isInt({ min: 1 })
    .withMessage('First character ID must be a positive integer'),

  param('id2')
    .isInt({ min: 1 })
    .withMessage('Second character ID must be a positive integer')
    .custom((id2, { req }) => {
      if (parseInt(id2) === parseInt(req.params.id1)) {
        throw new Error('Cannot compare a character with itself');
      }
      return true;
    }),

  handleValidationErrors
];

// Pagination validation helper
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  handleValidationErrors
];

// Generic integer ID validation
const validateIntId = (paramName) => {
  return [
    param(paramName)
      .isInt({ min: 1 })
      .withMessage(`${paramName} must be a positive integer`),

    handleValidationErrors
  ];
};

module.exports = {
  validateCharacterId,
  validateFavoriteId,
  validateCharacterSearch,
  validateCharacterFilter,
  validateStatusParam,
  validateSpeciesParam,
  validateMultipleCharacters,
  validateAddFavorite,
  validateUpdateFavoriteNotes,
  validateRecentFavorites,
  validateDateRange,
  validateCompareCharacters,
  validatePagination,
  validateIntId,
  handleValidationErrors
};
