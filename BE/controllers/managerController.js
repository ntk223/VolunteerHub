import Manager from "../models/Manager.js";

class ManagerController {
  async getByUserId(req, res) {
    try {
      const { userId } = req.params;

      const manager = await Manager.findOne({ where: { userId } });

      if (!manager) {
        return res.status(404).json({ message: "Manager not found" });
      }

      res.json(manager);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error retrieving manager" });
    }
  }
}

export const managerController = new ManagerController();
