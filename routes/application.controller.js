const ErrorResponse = require("../utility/errorResponse");

const sendEmail = require("../utility/sendgmail");

const Application = require("../models/application.model");

const { cloudinary } = require("../cloudinary/cloudinary.config");
const Approve = require("../models/approved.model");
// Get application by ID
const getAllApplication = async (req, res, next) => {
  let applicant = await Application.find();

  if (applicant === null || !applicant) {
    return next(
      new ErrorResponse(`Applicant not found with the name of :`, 404)
    );
  }
  res.render("list_of_applicant", { applicant });
};

const getApplicationById = async (req, res, next) => {
  const { id } = req.params;

  let approvedStatus = await Approve.findOne({ studentID: id });

  let applicant = await Application.findOne({ _id: id });

  if (!approvedStatus) {
    approvedStatus = "notDecided";
  }

  if (applicant === null || !applicant) {
    return next(
      new ErrorResponse(`Applicant not found with the name of : ${id}`, 404)
    );
  }

  console.log("From router approvedStatus.status1", approvedStatus);
  res.render("application_from_student", { applicant, approvedStatus });
};

// Create Application
const createApplicaton = async (req, res, next) => {
  // console.log("req files.......:", req.files);
  const {
    first_name,
    last_name,
    gender,
    mobile_phone,
    email,
    mother_name,
    father_name,
    birth_date,
    country_of_birth,
    nationality,
    country_of_residence,
    city_of_residence,
    whatsapp_number,
    address,
    status,
    passport_date_of_issue,
    passport_number,
    passport_date_of_expire,
  } = req.body;

  // console.log(req.files.profile_picture[0].path);
  // const a = profile_picture[0].path
  // const application = await Files.create({
  //   profile_picture: [{ imageUrl: req.files.profile_picture[0].path }],
  //   passport: [{ imageUrl: req.files.profile_picture[0].path }],
  //   diploma: [{ imageUrl: req.files.profile_picture[0].path }],
  //   transcript: [{ imageUrl: req.files.profile_picture[0].path }],
  // });

  const findEmail = await Application.findOne({ email });

  if (findEmail) {
    return next(new ErrorResponse("Your email is registered", 400));
  }
  const applicant = await Application.create({
    first_name,
    last_name,
    gender,
    mobile_phone,
    email,
    mother_name,
    father_name,
    birth_date,
    country_of_birth,
    nationality,
    country_of_residence,
    city_of_residence,
    whatsapp_number,
    address,
    passport_date_of_issue,
    passport_number,
    passport_date_of_expire,
    status,
    profile_picture: [{ imageUrl: req.files.profile_picture[0].path }],
    passport: [{ imageUrl: req.files.profile_picture[0].path }],
    diploma: [{ imageUrl: req.files.profile_picture[0].path }],
    transcript: [{ imageUrl: req.files.profile_picture[0].path }],
  });

  // console.log("Applicatant:.......", applicant);

  const url = await applicant.id;

  const message = `Dear applicant, Thank you for applying in this program. We will let you shortly about your application`;
  sendEmail;
  try {
    await sendEmail({
      email: applicant.email,
      subject: "Regarding Applicaiton",
      message,
    });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse("Email could not be sent", 500));
  }
  return res.redirect(`/application/${url}`);
  // res.send(applicant);
};

const approve = async (req, res, next) => {
  console.log("req.params", req.params);
  const { id } = req.params;
  const { status1, status2 } = req.body;

  const applicant = await Application.findOne({ id });
  const name = applicant.first_name;

  const approve = await Approve.create({
    studentID: id,
    name: name,
    status1,
    status2,
  });
  let message;
  if (approve.status1 === "Approved") {
    message = `Dear applicant, Congratulation. Your application is approved!`;
  } else {
    message = `Dear applicant, Sorry We can not proceed with your application.`;
  }
  sendEmail;
  try {
    await sendEmail({
      email: applicant.email,
      subject: "Regarding Applicaiton",
      message,
    });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse("Email could not be sent", 500));
  }
  res.send(approve);
};

module.exports = {
  getApplicationById,
  createApplicaton,
  getAllApplication,
  approve,
};
