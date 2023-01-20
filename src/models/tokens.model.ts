import { Document, model, Schema, SchemaTypes } from 'mongoose';
import { Token } from '@interfaces/tokens.interface';
import { TokenType } from '@enums';

const tokenSchema: Schema = new Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: TokenType,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
const tokenModel = model<Token & Document>('Token', tokenSchema);

export default tokenModel;
