// Third
import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: null,
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

PostSchema.plugin(uniqueValidator);

export default model("Post", PostSchema);
