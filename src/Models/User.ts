import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
  userId: string;
  goalsStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    goalsStreak: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<UserDocument>('User', UserSchema);
