import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    assignmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
    },
    studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    submission: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
