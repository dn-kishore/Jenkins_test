const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaintsByListing,
  getAllComplaints,
  updateComplaint,
  deleteComplaint,
  getComplaintStats
} = require('../controllers/complaintController');

// Create a new complaint
router.post('/', createComplaint);

// Get all complaints (for admin/manager dashboard)
router.get('/', getAllComplaints);

// Get complaint statistics
router.get('/stats', getComplaintStats);

// Get complaints for a specific listing
router.get('/listing/:listingId', getComplaintsByListing);

// Update complaint (status, response)
router.put('/:id', updateComplaint);

// Delete complaint
router.delete('/:id', deleteComplaint);

module.exports = router;