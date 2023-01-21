import { model, Schema } from 'mongoose';
import { UserRole, UserStatus } from '@enums';
import toJSON from '@meanie/mongoose-to-json';

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      private: true,
    },
    role: {
      type: [String],
      enum: UserRole,
      default: [UserRole.USER],
    },
    status: {
      type: String,
      enum: UserStatus,
      default: UserStatus.REVIEW,
    },
  },
  {
    timestamps: true,
  },
);
userSchema.plugin(toJSON);

const userModel = model('User', userSchema);

export default userModel;
