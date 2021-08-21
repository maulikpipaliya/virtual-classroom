import mongoose from "mongoose";

export const submissionStatusScope = ["SUBMITTED", "PENDING", "OVERDUE"];

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
    status: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
    },
});

submissionSchema.index({ assignmentID: 1, studentID: 1 }, { unique: true });

//capitalize status before saving
submissionSchema.pre("save", async function (next) {
    if (submissionStatusScope.includes(this.status)) {
        this.status = this.status.toUpperCase();

        next();
    } else {
        next(new Error("Invalid status"));
    }
});

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
