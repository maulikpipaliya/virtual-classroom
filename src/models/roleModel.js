import mongoose from "mongoose";

export const allRoles = ["TUTOR", "STUDENT", "ADMIN"];

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
    },
    roleDescription: {
        type: String,
    },
});

//capitalize roleName before saving in the database
roleSchema.pre("save", async function (next) {
    this.roleName = this.roleName.toUpperCase();
    next();
});

//verify if roleName is valid
roleSchema.pre("save", async function (next) {
    if (allRoles.includes(this.roleName)) {
        next();
    } else {
        next(new Error("Invalid role name"));
    }
});

const Role = mongoose.model("Role", roleSchema);
export default Role;
