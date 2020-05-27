// Third
import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      uniqueCaseInsensitive: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator);

export default model("User", UserSchema);
