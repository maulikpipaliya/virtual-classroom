import mongoose from "mongoose";

export const assignmentStatusScope = [
    "SCHEDULED",
    "ONGOING",
    "SUBMITTED",
    "OVERDUE",
    "PENDING",
];

//schema of assignment in mongoose
const assignmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    assignedTo: {
        type: [mongoose.Types.ObjectId],
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

//capitalize status before saving and check it's valid or not
assignmentSchema.pre("validate", async function (next) {
    console.log("assignmentSchema.pre");

    //if date is of future, set status to SCHEDULED
    if (this.publishDate > new Date()) {
        this.status = "SCHEDULED";
    } else if (this.dueDate < new Date()) {
        this.status = "OVERDUE";
    } else {
        this.status = "ONGOING";
    }

    this.status = this.status.toUpperCase();

    next();
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
