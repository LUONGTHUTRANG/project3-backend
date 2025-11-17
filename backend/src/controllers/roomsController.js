import RoomService from "../services/RoomService.js";

export async function createRoom(req, res) {
  try {
    const { room_name, building_id, room_type_id, room_status, note } = req.body;
    if (!room_name || !building_id || !room_type_id) {
      return res
        .status(400)
        .json({ error: "room_name, building_id, and room_type_id are required" });
    }
    const result = await RoomService.createRoom({
      room_name,
      building_id,
      room_type_id,
      room_status,
      note,
    });
    res.status(201).json({ message: "Tạo phòng thành công", ...result });
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes("Invalid")) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

export async function getRoomsByBuilding(req, res) {
  try {
    const { building_id } = req.params;
    if (!building_id) {
      return res.status(400).json({ error: "building_id is required" });
    }
    const rooms = await RoomService.getRoomsByBuilding(building_id);
    res.json({ total: rooms.length, data: rooms });
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

export async function updateRoom(req, res) {
  try {
    const { room_id } = req.params;
    const { room_name, building_id, room_type_id, room_status, note } = req.body;
    const result = await RoomService.updateRoom(room_id, {
      room_name,
      building_id,
      room_type_id,
      room_status,
      note,
    });
    res.json({ message: "Cập nhật phòng thành công", ...result });
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes("Invalid")) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

export async function deleteRoom(req, res) {
  try {
    const { room_id } = req.params;
    await RoomService.deleteRoom(room_id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

export async function updateRoomStatus(req, res) {
  try {
    const { room_id } = req.params;
    const { room_status } = req.body;
    if (!room_status) {
      return res.status(400).json({ error: "room_status is required" });
    }
    const result = await RoomService.updateStatus(room_id, room_status);
    res.json({ message: "Cập nhật trạng thái phòng thành công", ...result });
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes("Invalid")) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}
