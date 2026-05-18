const Employee = require('../models/Employee');

// Create an employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, yearsOfExperience } = req.body;

    // Check required fields
    if (!name || !email || !department || performanceScore === undefined || yearsOfExperience === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check for duplicate email
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const employee = new Employee({
      name,
      email,
      department,
      skills,
      performanceScore,
      yearsOfExperience
    });

    await employee.save();
    res.status(201).json({ message: 'Employee created successfully', employee });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Server error creating employee' });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error fetching employees' });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Server error fetching employee' });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Support partial updates (like dynamically updating performance score)
    const employee = await Employee.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Server error updating employee' });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Server error deleting employee' });
  }
};

// Search employees
exports.searchEmployees = async (req, res) => {
  try {
    const { department, skills, performance_min } = req.query;
    
    let query = {};
    
    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }
    
    if (skills) {
      // Allow searching by multiple skills separated by comma
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
    }

    if (performance_min) {
      query.performanceScore = { $gte: Number(performance_min) };
    }

    const employees = await Employee.find(query);
    res.status(200).json(employees);
  } catch (error) {
    console.error('Search employees error:', error);
    res.status(500).json({ message: 'Server error searching employees' });
  }
};
