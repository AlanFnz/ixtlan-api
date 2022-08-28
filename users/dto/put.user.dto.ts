import { Types } from "mongoose";

export interface PutUserDto {
  // user information //////
  email: string;
  password: string;
  username: string;
  profilePicture: string;
  coverPicture: string;
  permissionFlags: number;
  //////////////////////////

  // user status ///////////
  enabled: boolean;
  lastStatusUpdate: number;
  //////////////////////////

  // personal information //
  firstName: string;
  lastName: string;
  birthDate: number;
  location: string;
  country: string;
  //////////////////////////

  // links /////////////////
  instagramLink: string;
  soundcloudLink: string;
  twitterLink: string;
  customLink: string;
  //////////////////////////

  // content saved /////////
  savedEvents: Types.ObjectId;
  savedArticles: Types.ObjectId;
  // counts
  eventsSavedCount: number;
  articlesSavedCount: number;
  //////////////////////////

  // content liked /////////
  likedEvents: Types.ObjectId;
  likedArticles: Types.ObjectId;
  likedComments: Types.ObjectId;
  // counts
  eventsLikedCount: number;
  articlesLikedCount: number;
  commentsLikedCount: number;
  //////////////////////////

  // social ////////////////
  following: Types.ObjectId;
  followers: Types.ObjectId;
  //////////////////////////

  // auth dates ////////////
  signupDate: number;
  lastLogin: number;
  //////////////////////////

  // others ////////////////
  globalNotifications: Types.ObjectId;
  reports: Types.ObjectId;
  //////////////////////////
}
