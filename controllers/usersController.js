const BaseController = require("./baseController");
// This just cover
//UsersController(user, user_role, user_personal_detail);
class UsersController extends BaseController {
  constructor(user, userRoleModel, userPersonalDetailModel) {
    super(user);
    this.userRoleModel = userRoleModel;
    this.userPersonalDetailModel = userPersonalDetailModel;
    console.log(userRoleModel);
  }
  async getAllPersonalInformation(req, res) {
    try {
      const output = await this.model.findAll({
        where: { id: 2 },
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
}
module.exports = UsersController;
