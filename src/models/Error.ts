// Third
import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const ErrorSchema = new Schema(
  {
    requestId: {
      type: String,
      unique: true,
      required: true,
      uniqueCaseInsensitive: true,
    },
    session: {
      type: Object || null,
      default: null,
    },
    type: { type: String, required: true },
    severity: { type: String, default: "error" || "warning" || "alarm" },
    message: { type: String, required: true },
    context: { type: String, required: true },
    iat: {
      type: String || Date,
      required: true,
      default: new Date().toISOString(),
    },
    petition: [
      {
        host: { type: String, required: true },
        originalUrl: { type: String, required: true },
        method: { type: String, required: true },
        secure: { type: String, required: true },
        status: [
          {
            code: { type: String || Number, required: true },
            message: { type: String, required: true },
          },
        ],
        headers: [
          {
            contentType: { type: String, default: null },
            userAgent: { type: String, default: null },
          },
        ],
      },
    ],
    nestedErrors: { type: Object || null, default: null },
    stack: { type: String, default: null },
  },
  { timestamps: true }
);

ErrorSchema.plugin(uniqueValidator);

export default model("Error", ErrorSchema);
