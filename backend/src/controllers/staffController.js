import ManagerModel from "../models/ManagerModel.js";

export async function createStaff(req, res) {
  try {
    const {
      manager_name,
      manager_address,
      manager_phone,
      manager_CCCD,
      manager_email,
    } = req.body;

    if (!manager_name) {
      return res.status(400).json({ error: "manager_name is required" });
    }

    const managerId = await ManagerModel.create({
      manager_name,
      manager_address,
      manager_phone,
      manager_CCCD,
      manager_email,
    });

    res.status(201).json({ message: "Tạo cán bộ thành công", manager_id: managerId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
}

export async function getAllStaff(req, res) {
  try {
    const staff = await ManagerModel.findAll();
    res.json({ total: staff.length, data: staff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
}

export async function updateStaff(req, res) {
  try {
    const { manager_id } = req.params;
    const {
      manager_name,
      manager_address,
      manager_phone,
      manager_CCCD,
      manager_email,
    } = req.body;

    const existing = await ManagerModel.findById(manager_id);
    if (!existing) {
      return res.status(404).json({ error: "Staff not found" });
    }

    const payload = {
      manager_name: manager_name || existing.manager_name,
      manager_address: manager_address || existing.manager_address,
      manager_phone: manager_phone || existing.manager_phone,
      manager_CCCD: manager_CCCD || existing.manager_CCCD,
      manager_email: manager_email || existing.manager_email,
    };

    await ManagerModel.update(manager_id, payload);
    res.json({ message: "Cập nhật cán bộ thành công", manager_id: Number(manager_id), ...payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
}

export async function deleteStaff(req, res) {
  try {
    const { manager_id } = req.params;
    const existing = await ManagerModel.findById(manager_id);
    if (!existing) {
      return res.status(404).json({ error: "Staff not found" });
    }

    await ManagerModel.remove(manager_id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
}
