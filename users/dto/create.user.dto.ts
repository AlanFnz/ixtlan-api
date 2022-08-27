import { Types } from "mongoose";

export interface CreateUserDto {
  // user information //////
  email: string;
  password: string;
  username: string;
  profilePicture: string;
  coverPicture: string;
  permissionFlags?: number;
  //////////////////////////

  // user status ///////////
  enabled: boolean;
  lastStatusUpdate?: Date;
  //////////////////////////

  // personal information //
  firstName?: string;
  lastName?: string;
  birthDate: Date;
  location?: string;
  country: string;
  //////////////////////////

  // links /////////////////
  instagramLink?: string;
  soundcloudLink?: string;
  twitterLink?: string;
  customLink?: string;
  //////////////////////////

  // content saved /////////
  savedFiles?: Types.ObjectId;

  // content liked /////////
  likedFiles?: Types.ObjectId;

  // counts
  savedFilesCount?: number;
  likedFilesCount?: number;
  //////////////////////////

  // auth dates ////////////
  signupDate?: Date;
  lastLogin?: Date;
  //////////////////////////

  // others ////////////////
  globalNotifications?: Types.ObjectId;
  reports?: Types.ObjectId;
  //////////////////////////
}
