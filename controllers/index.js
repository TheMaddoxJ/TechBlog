const router = require('express').Router();

// ROUTES
const apiRoutes = require('./api');
const dashboardRoutes = require('./dashboardRoutes');
const homeRoutes = require('./homeRoutes');

// IMPORTS
router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('./dashboard', dashboardRoutes);

module.exports = router;
