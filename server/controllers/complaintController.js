const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

/**
 * Create a new complaint
 */
const createComplaint = async (req, res) => {
  try {
    const db = getDB();
    const {
      listingId,
      listingName,
      name,
      email,
      phone,
      category,
      description,
      priority
    } = req.body;

    // Validate required fields
    if (!listingId || !listingName || !name || !email || !phone || !category || !description) {
      return res.status(400).json({
        success: false,
        error: 'All required fields must be provided'
      });
    }

    // Create new complaint
    const complaint = {
      listingId: new ObjectId(listingId),
      listingName,
      name,
      email,
      phone,
      category,
      description,
      priority: priority || 'medium',
      status: 'open',
      response: '',
      responseDate: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('complaints').insertOne(complaint);

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: {
        complaintId: result.insertedId,
        status: complaint.status,
        createdAt: complaint.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit complaint'
    });
  }
};

/**
 * Get all complaints for a specific listing
 */
const getComplaintsByListing = async (req, res) => {
  try {
    const db = getDB();
    const { listingId } = req.params;
    const { status, priority, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = { listingId: new ObjectId(listingId) };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get complaints with pagination
    const complaints = await db.collection('complaints')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    // Get total count for pagination
    const total = await db.collection('complaints').countDocuments(filter);

    res.json({
      success: true,
      data: {
        complaints,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch complaints'
    });
  }
};

/**
 * Get all complaints (for admin/manager)
 */
const getAllComplaints = async (req, res) => {
  try {
    const db = getDB();
    const { status, priority, category, page = 1, limit = 20 } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get complaints with pagination
    const complaints = await db.collection('complaints')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    // Get total count for pagination
    const total = await db.collection('complaints').countDocuments(filter);

    // Get statistics
    const stats = await db.collection('complaints').aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    const priorityStats = await db.collection('complaints').aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    res.json({
      success: true,
      data: {
        complaints,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        stats: {
          byStatus: stats,
          byPriority: priorityStats,
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching all complaints:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch complaints'
    });
  }
};

/**
 * Update complaint status and response
 */
const updateComplaint = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { status, response } = req.body;

    const updateData = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (response) {
      updateData.response = response;
      updateData.responseDate = new Date();
    }

    const result = await db.collection('complaints').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update complaint'
    });
  }
};

/**
 * Delete a complaint
 */
const deleteComplaint = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    const result = await db.collection('complaints').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete complaint'
    });
  }
};

/**
 * Get complaint statistics for dashboard
 */
const getComplaintStats = async (req, res) => {
  try {
    const db = getDB();
    const { listingId } = req.query;

    // Build match filter
    const matchFilter = listingId ? { listingId: new ObjectId(listingId) } : {};

    // Get comprehensive statistics
    const stats = await db.collection('complaints').aggregate([
      { $match: matchFilter },
      {
        $facet: {
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          byPriority: [
            {
              $group: {
                _id: '$priority',
                count: { $sum: 1 }
              }
            }
          ],
          byCategory: [
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 }
              }
            }
          ],
          recent: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 }
          ],
          total: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]).toArray();

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Error fetching complaint stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch complaint statistics'
    });
  }
};

module.exports = {
  createComplaint,
  getComplaintsByListing,
  getAllComplaints,
  updateComplaint,
  deleteComplaint,
  getComplaintStats
};