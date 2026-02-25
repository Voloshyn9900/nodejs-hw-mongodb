import mongoose, { Schema } from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    avatar: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true } // створить поля createdAt та updatedAt
);

export const Contact = mongoose.model('Contact', contactSchema);
