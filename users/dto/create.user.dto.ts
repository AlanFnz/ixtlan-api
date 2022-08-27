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
  lastStatusUpdate?: number;
  //////////////////////////

  // personal information //
  firstName?: string;
  lastName?: string;
  birthDate: number;
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
  signupDate?: number;
  lastLogin?: number;
  //////////////////////////

  // others ////////////////
  globalNotifications?: Types.ObjectId;
  reports?: Types.ObjectId;
  //////////////////////////
}
