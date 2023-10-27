import mongoose from "mongoose";

const chatbotSchema = mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Property",
  },

  location: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Location",
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  nodes: [
    {
      type: Object,
    },
  ],

  edges: [
    {
      type: Object,
    },
  ],

  active: {
    type: Boolean,
  },

  status: {
    type: Boolean,
  },
  image: {
    type: String,
  },
});

export default mongoose.model("Chatbot", chatbotSchema);
