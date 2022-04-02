const mongoose = require("mongoose");

// const ImageSchema = new mongoose.Schema({
//   url:{
//     type: String,
//     required: true,
//   },
//   filename: {
//     type: String,
//     required: true,
//   },
// });

const FileSchema = new mongoose.Schema({
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
});
// const FileSchema = new mongoose.Schema({
//   profile_picture: [ImageSchema],
//   passport: [ImageSchema],
//   diploma: [ImageSchema],
//   transcript: [ImageSchema],
// });

module.exports = mongoose.model("Files", FileSchema);
