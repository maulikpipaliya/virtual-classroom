import Role from "./roleModel.js";
import User from "./userModel.js";

// get role id from user id
export const getRoleFromUserId = async (userId) => {
    try {
        const user = await User.findOne({ _id: userId });
        if (user && user.role) {
            const role = await Role.findById(user.role);
            return {
                roleId: role._id,
                roleName: role.roleName,
            };
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getRandomStudents = async (count) => {
    const { _id: roleId } = await Role.findOne({ roleName: "STUDENT" });

    const randomStudents = await User.aggregate([
        { $match: { role: roleId } },
        { $sample: { size: count } },
    ]).exec();

    return randomStudents;
};
