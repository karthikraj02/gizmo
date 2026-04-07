const PCBuild = require('../models/PCBuild');
const Product = require('../models/Product');
const crypto = require('crypto');

// Compatibility check logic
const checkCompatibility = async (components) => {
  const issues = [];
  let score = 100;
  const populate = async (id) => id ? await Product.findById(id) : null;

  const cpu = await populate(components.cpu);
  const motherboard = await populate(components.motherboard);
  const ram = components.ram ? await Product.find({ _id: { $in: components.ram } }) : [];

  if (cpu && motherboard) {
    const cpuSocket = cpu.compatibility?.socket;
    const mbSocket = motherboard.compatibility?.socket;
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push(`CPU socket (${cpuSocket}) incompatible with motherboard (${mbSocket})`);
      score -= 40;
    }
  }
  if (ram.length > 0 && motherboard) {
    const mbMemType = motherboard.compatibility?.memoryType;
    ram.forEach(r => {
      const ramType = r.compatibility?.memoryType;
      if (mbMemType && ramType && !mbMemType.includes(ramType)) {
        issues.push(`RAM type (${ramType}) incompatible with motherboard (${mbMemType})`);
        score -= 20;
      }
    });
  }
  if (!components.psu && (components.gpu || components.cpu)) {
    issues.push('No PSU selected - required for a complete build');
    score -= 10;
  }

  return { score: Math.max(0, score), issues };
};

// @desc  Create / Save build
// @route POST /api/builds
const createBuild = async (req, res) => {
  const { components, name, isPublic, purpose, notes } = req.body;

  // Calculate total price
  const productIds = Object.values(components).flat().filter(Boolean);
  const products = await Product.find({ _id: { $in: productIds } });
  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);

  const { score, issues } = await checkCompatibility(components);
  const shareCode = isPublic ? crypto.randomBytes(6).toString('hex') : undefined;

  const build = await PCBuild.create({
    user: req.user?._id,
    name,
    components,
    totalPrice,
    isPublic,
    purpose,
    notes,
    shareCode,
    compatibilityScore: score,
    compatibilityIssues: issues,
  });

  res.status(201).json(build);
};

// @desc  Get user builds
// @route GET /api/builds/my
const getMyBuilds = async (req, res) => {
  const builds = await PCBuild.find({ user: req.user._id })
    .populate('components.cpu components.gpu components.motherboard components.psu components.cooling components.case', 'name price images brand')
    .populate('components.ram components.storage', 'name price images brand')
    .sort({ createdAt: -1 });
  res.json(builds);
};

// @desc  Get build by share code
// @route GET /api/builds/share/:code
const getBuildByCode = async (req, res) => {
  const build = await PCBuild.findOne({ shareCode: req.params.code, isPublic: true })
    .populate('components.cpu components.gpu components.motherboard components.psu components.cooling components.case', 'name price images brand')
    .populate('components.ram components.storage', 'name price images brand')
    .populate('user', 'name avatar');
  if (!build) return res.status(404).json({ message: 'Build not found' });
  res.json(build);
};

// @desc  Delete build
// @route DELETE /api/builds/:id
const deleteBuild = async (req, res) => {
  const build = await PCBuild.findById(req.params.id);
  if (!build) return res.status(404).json({ message: 'Build not found' });
  if (build.user?.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
  await build.deleteOne();
  res.json({ message: 'Build deleted' });
};

// @desc  Check compatibility
// @route POST /api/builds/compatibility
const checkBuildCompatibility = async (req, res) => {
  const result = await checkCompatibility(req.body.components);
  res.json(result);
};

module.exports = { createBuild, getMyBuilds, getBuildByCode, deleteBuild, checkBuildCompatibility };
