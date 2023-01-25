import mongoose from "mongoose";


const voiceMessageSchema = new mongoose.Schema({
    data: { type: Buffer }
  });

  const VoiceMessageModal = mongoose.model('VoiceMessage', voiceMessageSchema);

  export default VoiceMessageModal;