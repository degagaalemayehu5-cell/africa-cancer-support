import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{3,4}$/, 'Please enter a valid phone number']
  },
  homeAddress: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'Unknown'
    },
    postalCode: {
      type: String,
      trim: true
    }
  },
  occupation: {
    type: String,
    required: [true, 'Occupation is required'],
    trim: true,
    enum: {
      values: ['Doctor', 'Nurse', 'Teacher', 'Student', 'Business Owner', 'Healthcare Worker', 'Social Worker', 'Other'],
      message: '{VALUE} is not a valid occupation'
    }
  },
  idPhotoUrl: {
    type: String,
    default: '' // Not required initially for two-step registration
  },
  idPhotoPublicId: {
    type: String,
    default: '' // Not required initially for two-step registration
  },
  role: {
    type: String,
    enum: {
      values: ['volunteer', 'donor', 'educator', 'ambassador'],
      message: '{VALUE} is not a valid role'
    },
    default: 'volunteer'
  },
  skills: [{
    type: String,
    trim: true
  }],
  availability: {
    type: String,
    enum: {
      values: ['weekdays', 'weekends', 'evenings', 'flexible', 'full-time', 'part-time'],
      message: '{VALUE} is not a valid availability option'
    },
    default: 'flexible'
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending_upload', 'pending', 'active', 'suspended', 'inactive'],
    default: 'pending_upload' // Changed from 'pending' to 'pending_upload' for two-step process
  },
  totalDonations: {
    type: Number,
    default: 0
  },
  totalHoursVolunteered: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This will automatically manage createdAt and updatedAt
});

// Create index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ verified: 1 });
userSchema.index({ status: 1 });

// Virtual for full address
userSchema.virtual('fullAddress').get(function() {
  const parts = [];
  if (this.homeAddress.street) parts.push(this.homeAddress.street);
  if (this.homeAddress.city) parts.push(this.homeAddress.city);
  if (this.homeAddress.country) parts.push(this.homeAddress.country);
  if (this.homeAddress.postalCode) parts.push(this.homeAddress.postalCode);
  return parts.join(', ');
});

// Method to check if user is verified
userSchema.methods.isVerified = function() {
  return this.verified === true && this.status === 'active';
};

// Method to check if user has uploaded ID
userSchema.methods.hasUploadedId = function() {
  return this.idPhotoUrl && this.idPhotoUrl !== '';
};

// Method to get user display name
userSchema.methods.getDisplayName = function() {
  return this.fullName;
};

// Pre-save middleware to update updatedAt
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-save middleware to validate skills array
userSchema.pre('save', function(next) {
  if (this.skills && this.skills.length > 0) {
    // Remove empty strings and trim each skill
    this.skills = this.skills.filter(skill => skill && skill.trim()).map(skill => skill.trim());
  }
  next();
});

// Static method to find active volunteers
userSchema.statics.findActiveVolunteers = function() {
  return this.find({ 
    role: 'volunteer', 
    verified: true, 
    status: 'active' 
  }).select('-idPhotoUrl -idPhotoPublicId');
};

// Static method to find users pending ID upload
userSchema.statics.findPendingUpload = function() {
  return this.find({ 
    status: 'pending_upload',
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Older than 24 hours
  });
};

// Static method to get statistics
userSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        verifiedCount: { 
          $sum: { $cond: [{ $eq: ['$verified', true] }, 1, 0] }
        }
      }
    }
  ]);
  return stats;
};

// Static method to get registration stats
userSchema.statics.getRegistrationStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  return stats;
};

const User = mongoose.model('User', userSchema);

export default User;