// Third
import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const ErrorSchema = new Schema(
  {
    request: [
      {
        id: {
          type: String,
          unique: true,
          required: true,
          uniqueCaseInsensitive: true,
        },
        iat: { type: String, required: true },
      },
    ],
    session: {
      type: Object || null,
      default: null,
    },
    type: { type: String },
    severity: { type: String, default: "Error" || "Warning" || "Alarm" },
    message: { type: String, required: true },
    status: [
      {
        code: { type: String || Number, required: true },
        message: { type: String, required: true },
      },
    ],
    method: { type: String, required: true },
    complete: { type: String, required: true },
    host: { type: String, required: true },
    originalUrl: { type: String, required: true },
    secure: { type: String, required: true },
    context: [
      {
        name: { type: String, required: true },
        path: { type: String, required: true },
      },
    ],
    headers: [
      {
        contentType: { type: String, default: null },
        userAgent: { type: String, default: null },
      },
    ],
    errorIat: { type: String, required: true },
    nestedErrors: { type: Object || null },
    stack: { type: String, default: null },
  },
  { timestamps: true }
);

ErrorSchema.plugin(uniqueValidator);

export default model("Error", ErrorSchema);
