const mongoose = require('mongoose');

const serviceBookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceType: {
      type: String,
      required: true,
      enum: ['PC Repair', 'PC Upgrade', 'Custom Build', 'Data Recovery', 'Virus Removal', 'OS Installation', 'Hardware Diagnostics'],
    },
    description: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    estimatedCost: { type: Number },
    finalCost: { type: Number },
    technicianNotes: { type: String },
    userNotes: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    serviceMode: { type: String, enum: ['pickup', 'doorstep', 'dropoff'], default: 'dropoff' },
    completedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceBooking', serviceBookingSchema);
