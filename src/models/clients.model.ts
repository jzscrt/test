import { model, Schema } from 'mongoose';
import { ClientStatus } from '@enums';
import toJSON from '@meanie/mongoose-to-json';

//nameSchema
const nameSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
});

//addressSchema
const addressSchema: Schema = new Schema({
  number: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
});

//dummyAccountSchema
const dummyAccountSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const clientSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    name: {
      type: nameSchema,
      required: true,
    },
    aliasNames: {
      type: [nameSchema],
    },
    email: {
      type: String,
      required: true,
    },
    altEmails: {
      type: [String],
    },
    address: {
      type: addressSchema,
    },
    altAddress: {
      type: [addressSchema],
    },
    phone: {
      type: String,
      required: true,
    },
    dummyAccount: {
      type: [dummyAccountSchema],
    },
    profession: {
      type: String,
    },
    workload: {
      type: String,
    },
    sfId: {
      type: String,
    },
    staus: {
      type: String,
      enum: ClientStatus,
      default: ClientStatus.NOT_SET,
    },
    dateBirth: {
      type: Date,
      required: true,
    },
    dateEnrollment: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);
clientSchema.plugin(toJSON);

const userModel = model('Client', clientSchema);

export default userModel;
