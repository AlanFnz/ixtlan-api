import debug from "debug";
import { Types } from "mongoose";

import { PermissionFlag } from "../../common/middleware/common.permissionflag.enum";

import { CreateUserDto } from "../dto/create.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";
import { PutUserDto } from "../dto/put.user.dto";

import mongooseService from "../../common/services/mongoose.service";

const log: debug.IDebugger = debug("app:users-dao");

class UsersDao {
  Schema = mongooseService.getMongoose().Schema;

  userSchema = new this.Schema({
    // user information //////
    email: { type: String, required: true },
    password: { type: String, select: false, required: true },
    username: { type: String, required: true },
    profilePicture: { type: String },
    coverPicture: { type: String },
    permissionFlags: Number,
    //////////////////////////

    // user status ///////////
    enabled: { type: Boolean, required: true, default: true },
    lastStatusUpdate: Number,
    //////////////////////////

    // personal information //
    firstName: String,
    lastName: String,
    birthDate: Number,
    location: String,
    country: {
      type: String,
      default: "AR",
      required: true,
    },
    //////////////////////////

    // links /////////////////
    instagramLink: String,
    soundcloudLink: String,
    twitterLink: String,
    customLink: String,
    //////////////////////////

    // content saved /////////
    savedFiles: [
      {
        type: Types.ObjectId,
        ref: "File", //
      },
    ],

    // content liked /////////
    likedFiles: [
      {
        type: Types.ObjectId,
        ref: "Article", //
      },
    ],

    // counts
    savedFilesCount: Number,
    likedFilesCount: Number,
    //////////////////////////

    // auth dates ////////////
    signupDate: Number,
    lastLogin: Number,
    //////////////////////////

    // others ////////////////
    globalNotifications: [
      {
        type: Types.ObjectId,
        ref: "GlobalNotification", //
      },
    ],
    reports: [
      {
        type: Types.ObjectId,
        ref: "Report", //
      },
    ],
    //////////////////////////
  });

  User = mongooseService.getMongoose().model("User", this.userSchema);

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  constructor() {
    log("Created new instance of UsersDao");
  }

  // methods /////////////////

  async addUser(userFields: CreateUserDto) {
    const user = new this.User({
      ...userFields,
      permissionFlags: PermissionFlag.BASIC_USER_PERMISSION,
    });
    await user.save();

    return user;
  }

  async getUserByEmail(email: string) {
    return this.User.findOne({ email: email }).exec();
  }

  async getUserByEmailWithPassword(email: string) {
    return this.User.findOne({ email: email })
      .select("_id email permissionFlags +password")
      .exec();
  }

  async getUserById(userId: Types.ObjectId) {
    return this.User.findById(userId).exec();
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateUserById(
    userId: Types.ObjectId,
    userFields: PatchUserDto | PutUserDto
  ) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();

    return existingUser;
  }

  async removeUserById(userId: Types.ObjectId) {
    return this.User.deleteOne({ _id: userId }).exec();
  }
}

export default new UsersDao();
