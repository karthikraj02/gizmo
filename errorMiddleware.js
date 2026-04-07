const mongoose = require('mongoose');

const pcBuildSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, default: 'My Custom Build' },
    components: {
      cpu: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      gpu: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      motherboard: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      ram: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
      storage: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
      psu: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      cooling: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      case: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    },
    totalPrice: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false },
    shareCode: { type: String, unique: true, sparse: true },
    compatibilityScore: { type: Number, default: 0 },
    compatibilityIssues: [String],
    purpose: { type: String, enum: ['Gaming', 'Workstation', 'Budget', 'Streaming', 'Office', 'Custom'] },
    notes: String,
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PCBuild', pcBuildSchema);
