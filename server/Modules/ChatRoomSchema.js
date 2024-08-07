import mongoose from "mongoose";
const Schema = mongoose.Schema;
const chatRoomSchema = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "nftlay",
      },
    ],
    messages: [
      {
        walletAddress: {
          type: String,
        },
        message: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("chatRoomSchema", chatRoomSchema);
export default Room;
