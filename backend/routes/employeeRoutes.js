const express = require('express');
const router = express.Router();
const { 
  createEmployee, 
  getAllEmployees, 
  getEmployeeById, 
  updateEmployee, 
  deleteEmployee,
  searchEmployees
} = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all employee routes
router.use(authMiddleware);

router.post('/', createEmployee);
router.get('/', getAllEmployees);
router.get('/search', searchEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
