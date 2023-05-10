const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const nameSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const aliasNameSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const stateSchema = mongoose.Schema(
  {
    long: {
      type: String,
      trim: true,
    },
    abbr: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const addressSchema = mongoose.Schema(
  {
    number: {
      type: String,
      trim: true,
    },
    street: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: stateSchema,
      trim: true,
    },
    zip: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const dummySchema = mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
  },
  {
    _id: false,
  }
);

const clientSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    name: {
      type: nameSchema,
      required: true,
      trim: true,
    },
    aliasNames: {
      type: [aliasNameSchema],
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    altEmails: {
      type: [String],
      trim: true,
      lowercase: true,
    },

    address: {
      type: addressSchema,
      required: true,
      trim: true,
    },
    altAddress: {
      type: [addressSchema],
      trim: true,
    },

    phone: {
      type: String,
      required: false,
      trim: true,
    },
    dummyAccount: {
      type: dummySchema,
      required: false,
    },

    profession: {
      type: String,
      required: false,
      trim: true,
    },
    workload: {
      type: String,
      required: false,
      trim: true,
    },
    sfId: {
      type: String,
      required: false,
      trim: true,
    },

    status: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'ClientStatus',
      required: false,
    },

    dateBirth: {
      type: Date,
      required: false,
    },
    dateEnrollment: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

clientSchema.plugin(toJSON);
clientSchema.plugin(paginate);

/**
 * @param {string} email - The client's email
 * @param {objectId} [excludeClientId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
clientSchema.statics.isEmailTaken = async function (email, excludeClientId) {
  const client = await this.findOne({ email, _id: { $ne: excludeClientId } });
  return !!client;
};

/**
 * @typedef Client
 */
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
