const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Profile
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  dob: {
    type: Date,
    required: true
  },
  phone: {
    type: String,
    required: true,
    max: 20
  },
  bio: {
    type: String
  },
  location: {
    street: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    postcode: {
      type: Number
    },
    current: {
      type: Boolean,
      default: false
    }
  },
  career: {
    education: [
      {
        field: {
          type: String
        },
        school: {
          type: String
        },
        from: {
          type: Date
        },
        to: {
          type: Date
        },
        current: {
          type: Boolean,
          default: false
        },
        transcript: {
          type: String
        }
      }
    ],
    experience: [
      {
        title: {
          type: String
        },
        company: {
          type: String
        },
        from: {
          type: Date
        },
        to: {
          type: Date
        },
        current: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  skills: {
    type: [String]
  },
  social: {
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    linkedin: {
      type: String
    },
    github: {
      type: String
    },
    gitlabs: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
