import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  public: {
    type: Boolean,
    default: true,
  },
  tags: [String],
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

export default Image; 