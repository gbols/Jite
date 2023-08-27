import userModel from "./users.model";
import {User} from "./users.interface"

export const UserService = {
    getAllUsers: () => {
        return userModel.find();
    },
    SignUp: (data: User) => {
        return new userModel(data).save();
    },
    getUserById: (id) => {
        return userModel.findById(id)
    },
    modifyUser: (id, data) => {
        return userModel.findByIdAndUpdate(id, data, { new: true })
    },
    deleteUser: (id) => {
        return userModel.findByIdAndDelete(id);
    },
    findOne: (filter) => {
        return userModel.findOne(filter)
    }
}