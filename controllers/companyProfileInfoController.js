const BaseController = require("./baseController");

class CompanyProfileInfoController extends BaseController {
  constructor(model, locationModel) {
    super(model);
    this.locationModel = locationModel;
  }
  async getOneCompany(req, res) {
    try {
      const { companyId } = req.params;
      const output = await this.model.findAll({
        where: {
          id: companyId,
        },
      });
      res.status(200).json(output);
    } catch (error) {
      console.log(error);
      res.status(400).json({ success: false, error: error });
    }
  }

  async getLocation(req, res) {
    try {
      const output = await this.locationModel.findAll();
      res.status(200).json(output);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
}
module.exports = CompanyProfileInfoController;
