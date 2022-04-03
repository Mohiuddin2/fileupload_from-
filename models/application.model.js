const mongoose = require("mongoose");


const ApplicationSchema = new mongoose.Schema({
  first_name: {
    type: String,
    // required: true,
  },
  last_name: {
    type: String,
    // required: true,
  },

  mobile_phone: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: [true, "Please add an email"],
    // unique: true,
    match: [
      /\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  mother_name: {
    type: String,
    // required: true,
  },
  gender: {
    type: String,
    require: true,
  },
  father_name: {
    type: String,
    // required: true,
  },
  birth_date: {
    type: Date,
    // required: true,
  },
  country_of_birth: {
    type: String,
    // required: true,
  },
  nationality: {
    type: String,
    // required: true,
  },
  country_of_residence: {
    type: String,
    // required: true,
  },
  city_of_residence: {
    type: String,
    // required: true,
  },
  whatsapp_number: {
    type: Number,
    // required: true,
  },
  address: {
    type: String,
    // required: true,
  },
  passport_date_of_issue: {
    type: Date,
    // required: true,
  },
  passport_number: {
    type: String,
    // required: true,
  },
  passport_date_of_expire: {
    type: Date,
    // required: true,
  },

  createAt: {
    type: Date,
    default: Date.now,
  },
  profile_picture:[
    {
      imageUrl: {
        type: String,
        required: true
      }
    }
  ],
  passport:[
    {
      imageUrl: {
        type: String,
        required: true
      }
    }
  ],

  diploma:[
    {
      imageUrl: {
        type: String,
        required: true
      }
    }
  ],

  transcript:[
    {
      imageUrl: {
        type: String,
        required: true
      }
    }
  ],
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
  },
  status: {
    type: String,
    enum: ['Approved', 'Rejected']
  }
});

module.exports = mongoose.model("Application", ApplicationSchema);
