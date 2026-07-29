import mongoose from "mongoose";
import validator from "validator";


const userSchema = new mongoose.Schema({   ///we are creating a new schema object.
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email");
            }
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    niche: {
        type: String,
        default: "General",
    },
},
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
export default User;