const express = require("express");
const cors = require("cors");
//onst axios = require("axios");

require("dotenv").config();
const PORT = process.env.PORT;
const app = express();

// import middlewares
const jwtCheck = require("./middlewares/jwtCheck");

const corsOptions = {
  origin: process.env.CORS_OPTIONS,
};
// importing info from db area
const db = require("./db/models/index");
const {
  user,
  user_role,
  user_resume_type,
  user_personal_detail,
  job_listing,
  job_category,
  company_profile_info,
  location,
  user_experience_detail,
  user_educational_detail,
  user_skill_detail,
  user_language_detail,
  user_additional_detail,
  user_aboutme_detail,
  user_privacy_detail,
} = db;
// import controller file area
const UsersController = require("./controllers/usersController.js");
const UserResumeTypeController = require("./controllers/userResumeTypeController.js");
const JobListingsController = require("./controllers/jobListingsController.js");
const CompanyProfileInfoController = require("./controllers/companyProfileInfoController");
const CreateResumeController = require("./controllers/createResumeController");

// put db stuff in controller section
const usersController = new UsersController(
  user,
  user_role,
  user_personal_detail,
  company_profile_info
);
const userResumeTypeController = new UserResumeTypeController(user_resume_type);
const companyProfileInfoController = new CompanyProfileInfoController(
  company_profile_info,
  location,
  job_listing,
  user
);

const joblistingsController = new JobListingsController(
  job_listing,
  job_category,
  company_profile_info,
  location
);

const createResumeController = new CreateResumeController(
  user,
  user_experience_detail,
  user_educational_detail,
  user_skill_detail,
  user_language_detail,
  user_additional_detail,
  user_aboutme_detail,
  user_privacy_detail
);
// import router section
const UsersRouter = require("./routers/usersRouter");
const UserResumeTypeRouter = require("./routers/userResumeTypeRouter");
const JobListingsRouter = require("./routers/jobListingsRouter");
const CompanyProfileInfoRouter = require("./routers/companyProfileInfoRouter");
const CreateResumeRouter = require("./routers/createResumeRouter");

// assign controller to router area
const usersRouter = new UsersRouter(usersController, jwtCheck);
const userResumeTypeRouter = new UserResumeTypeRouter(
  userResumeTypeController,
  jwtCheck
);
const joblistingsRouter = new JobListingsRouter(
  joblistingsController,
  jwtCheck
);
const companyProfileInfoRouter = new CompanyProfileInfoRouter(
  companyProfileInfoController,
  jwtCheck
);

const createResumeRouter = new CreateResumeRouter(createResumeController);
//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// assign routes
app.use("/users", usersRouter.routes());
app.use("/resumes", userResumeTypeRouter.routes());
app.use("/company", companyProfileInfoRouter.routes());
app.use("/listings", joblistingsRouter.routes());
app.use("/createresume", createResumeRouter.routes());

app.listen(PORT, () => {
  console.log(`Express App listening on port ${PORT}`);
});
