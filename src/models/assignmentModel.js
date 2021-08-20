import mongoose from "mongoose";

export const assignmentStatus = [
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
        required: true,
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
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
