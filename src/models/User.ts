// Third
import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      uniqueCaseInsensitive: true,
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
