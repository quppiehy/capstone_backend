const BaseController = require("./baseController");
// This just cover
//UsersController(user, user_role, user_personal_detail);
class UsersController extends BaseController {
  constructor(
    user,
    userRoleModel,
    userPersonalDetailModel,
    companyModel,
    locationModel
  ) {
    super(user);
    this.userRoleModel = userRoleModel;
    this.userPersonalDetailModel = userPersonalDetailModel;
    this.companyModel = companyModel;
    this.locationModel = locationModel;
    console.log(userRoleModel);
  }

  async retrieveLogin(req, res) {
    const user = req.body;
    console.log(user);
    const { given_name, family_name, email, role, picture } = req.body;

    try {
      const [checkedUser, created] = await this.model.findOrCreate({
        where: { email: email },
        defaults: {
          firstName: given_name || null,
          lastName: family_name || null,
          email: email,
          userName: email,
          userRoleId: role,
          avatarUrl: picture || null,
          approvedByAdmin: false,
        },
      });
      if (created) {
        console.log("User Created!");
      } else {
        console.log("User retrieved!");
      }

      // if user is employer, to return company info as well
      if (role === 3) {
        try {
          const company_profile_info = await this.companyModel.findAll({
            where: { userId: checkedUser.id },
          });
          if (company_profile_info.length > 0) {
            const company_info = company_profile_info[0].dataValues;
            console.log("This is companyInfo: ", company_info);
            checkedUser.dataValues.companyInfo = company_info;
            console.log("Company found, info added!");
          }

          console.log("User w co. info: ", checkedUser);
        } catch (err) {
          console.log("Error, company not found.", err.message);
        }
      }

      // other statements for other info will go here if needed to be loaded into currUser at login
      // else {

      // }

      return res.json({ checkedUser });
    } catch (err) {
      console.log(err.message);
      console.log("I'm in login catch-try-catch: error");
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async getAllPersonalInformation(req, res) {
    try {
      const output = await this.model.findAll({
        include: [
          {
            model: this.userPersonalDetailModel,
          },
        ],
      });
      return res.json(output);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async getOnePersonalInformation(req, res) {
    const { userId } = req.params;
    try {
      const output = await this.model.findByPk(userId, {
        include: [
          {
            model: this.userPersonalDetailModel,
          },
        ],
      });
      console.log(output);
      return res.json(output);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async editPersonalInformation(req, res) {
    const { userId } = req.params;
    const {
      avatarUrl,
      currentWorkStatus,
      housingType,
      mobileNumber,
      monthlySalary,
      occupation,
      postalCode,
      streetAddress,
      unitNumber,
    } = req.body.fieldValues;
    let objToSend = {};
    try {
      await this.userPersonalDetailModel.update(
        {
          currentWorkStatus: currentWorkStatus,
          housingType: housingType,
          monthlySalary: monthlySalary,
          occupation: occupation,
          postalCode: postalCode,
          streetAddress: streetAddress,
          unitNumber: unitNumber,
          mobileNumber: mobileNumber,
        },
        {
          where: {
            userId: userId,
          },
        }
      );
      if (avatarUrl !== null && avatarUrl !== "") {
        await this.model.update(
          {
            avatarUrl: avatarUrl,
          },
          {
            where: {
              id: userId,
            },
          }
        );
      }

      const output = await this.model.findByPk(userId, {
        include: [
          {
            model: this.userPersonalDetailModel,
          },
        ],
      });

      return res.json(output);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async checkUnverifiedUserAndCompany(req, res) {
    try {
      const output1 = await this.model.findAll({
        where: {
          approvedByAdmin: false,
          userRoleId: 2,
        },
        include: [
          {
            model: this.userPersonalDetailModel,
          },
        ],
      });
      const output2 = await this.companyModel.findAll({
        where: {
          approvalByAdmin: false,
        },
      });
      res.status(200).json([output1, output2]);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async approveUnverifiedUser(req, res) {
    try {
      const { entityId } = req.body;
      const output = await this.model.update(
        {
          approvedByAdmin: true,
        },
        {
          where: {
            id: entityId,
          },
        }
      );
      res.status(200).json(output);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async deleteUnverifiedUser(req, res) {
    try {
      const { entityId } = req.params;

      const output = await this.model.destroy({
        where: {
          id: entityId,
        },
      });
      res.status(200).json(output);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: err.message });
    }
  }
  async retrieveProfile(req, res) {
    try {
      const { userId } = req.params;
      console.log(userId);
      const { fieldValues } = req.body;

      console.log(fieldValues);
      const [output, created] = await this.userPersonalDetailModel.findOrCreate(
        {
          where: { userId: userId },
          defaults: fieldValues,
        }
      );

      if (created) {
        console.log("user is created!");
      } else {
        console.log("user was retrieved");
      }
      res.status(200).json(output);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async checkVerifiedUsersAndCompany(req, res) {
    try {
      const output1 = await this.model.findAll({
        where: {
          approvedByAdmin: true,
          userRoleId: 2,
        },
        include: [
          {
            model: this.userPersonalDetailModel,
          },
        ],
      });
      const output2 = await this.companyModel.findAll({
        where: {
          approvalByAdmin: true,
        },
      });
      res.status(200).json([output1, output2]);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async unverifyUser(req, res) {
    try {
      const { userId } = req.body;
      const output = await this.model.update(
        {
          approvedByAdmin: false,
        },
        {
          where: {
            id: userId,
          },
        }
      );
      res.status(200).json(output);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: err.message });
    }
  }
}

module.exports = UsersController;
