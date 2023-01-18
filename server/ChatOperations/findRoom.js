import Room from "../Modules/ChatRoomSchema.js";
import usersModel from "../Modules/User.js";
const findRoom = async (id) => {
  try {
    const user = await usersModel.findOne({ _id: id });
    if (!user) return [];
    const rooms = await Room.find({ users: { $in: user._id } }).populate(
      "users"
    );
    return rooms;
  } catch (error) {
    console.log(error);
  }
};
export default findRoom;
