import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false, default: "" },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^(\+91)?[6-9]\d{9}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      default: undefined,
      validate: {
        validator: function (v) {
          if (!v || v === "") return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.name || this.name === "") {
    this.name = `User${this.phone.slice(-4)}`;
  }
  next();
});

export default userSchema;
