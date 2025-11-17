import RoomModel from "../models/RoomModel.js";
import BuildingModel from "../models/BuildingModel.js";
import RoomTypeModel from "../models/RoomTypeModel.js";

const ALLOWED_STATUSES = ["available", "maintenance", "full"];

class RoomService {
  static async validateBuilding(buildingId) {
    const building = await BuildingModel.findById(buildingId);
    if (!building) {
      throw new Error("Building not found");
    }
    return building;
  }

  static async validateRoomType(roomTypeId, buildingId) {
    const roomType = await RoomTypeModel.findById(roomTypeId);
    if (!roomType) {
      throw new Error("Room type not found");
    }
    if (buildingId && roomType.building_id !== buildingId) {
      throw new Error("Room type does not belong to building");
    }
    return roomType;
  }

  static async createRoom(payload) {
    const { room_name, building_id, room_type_id, room_status, note } = payload;
    await this.validateBuilding(building_id);
    await this.validateRoomType(room_type_id, building_id);

    if (room_status && !ALLOWED_STATUSES.includes(room_status)) {
      throw new Error("Invalid room_status");
    }

    const roomId = await RoomModel.create({
      room_name,
      building_id,
      room_type_id,
      room_status: room_status || "available",
      note,
    });
    return { room_id: roomId };
  }

  static async getRoomsByBuilding(buildingId) {
    await this.validateBuilding(buildingId);
    const rooms = await RoomModel.findByBuilding(buildingId);
    return rooms;
  }

  static async updateRoom(roomId, payload) {
    const existing = await RoomModel.findById(roomId);
    if (!existing) {
      throw new Error("Room not found");
    }

    const buildingId = payload.building_id ?? existing.building_id;
    const roomTypeId = payload.room_type_id ?? existing.room_type_id;

    await this.validateBuilding(buildingId);
    await this.validateRoomType(roomTypeId, buildingId);

    const roomStatus = payload.room_status || existing.room_status;
    if (roomStatus && !ALLOWED_STATUSES.includes(roomStatus)) {
      throw new Error("Invalid room_status");
    }

    const updatePayload = {
      room_name: payload.room_name || existing.room_name,
      building_id: buildingId,
      room_type_id: roomTypeId,
      room_status: roomStatus,
      note: payload.note ?? existing.note,
    };

    await RoomModel.update(roomId, updatePayload);
    return { room_id: Number(roomId), ...updatePayload };
  }

  static async deleteRoom(roomId) {
    const existing = await RoomModel.findById(roomId);
    if (!existing) {
      throw new Error("Room not found");
    }
    await RoomModel.remove(roomId);
    return true;
  }

  static async updateStatus(roomId, roomStatus) {
    const existing = await RoomModel.findById(roomId);
    if (!existing) {
      throw new Error("Room not found");
    }
    if (!ALLOWED_STATUSES.includes(roomStatus)) {
      throw new Error("Invalid room_status");
    }
    await RoomModel.updateStatus(roomId, roomStatus);
    return { room_id: Number(roomId), room_status: roomStatus };
  }
}

export default RoomService;
