const OperatinSystemService = require("../services/os");
const UserService = require("../services/user");

module.exports = {
  getOperatingSystems: async function(req, res) {
    var canGetOS = await UserService.canGetOS(req.user);
    if (!canGetOS) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (req.query.page && req.query.page_size) {
      var operatingSystems = await OperatinSystemService.getOperatingSystemsPaginated(
        req.query.page,
        req.query.page_size
      );
    } else {
      var operatingSystems = await OperatinSystemService.getOperatingSystems();
    }
    if (operatingSystems) {
      return res.status(200).json(operatingSystems);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
};
