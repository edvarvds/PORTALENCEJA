import express from 'express';
import User from '../models/User';

const router = express.Router();

// Update location confirmation step
router.post('/steps/location', async (req, res) => {
  try {
    const { confirmed } = req.body;
    const userId = req.user?.id; // Assuming you have user authentication middleware

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 'stepsCompleted.locationConfirmed': confirmed },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating location step:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update study materials access step
router.post('/steps/materials', async (req, res) => {
  try {
    const { accessed } = req.body;
    const userId = req.user?.id; // Assuming you have user authentication middleware

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 'stepsCompleted.studyMaterialsAccessed': accessed },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating materials step:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 