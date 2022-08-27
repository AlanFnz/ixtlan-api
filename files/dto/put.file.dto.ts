import { Types } from "mongoose";

export interface PutFileDto {
  // file information //////
  title: string;
  description: string;
  source: string;
  //////////////////////////

  // file status ///////////
  visible: boolean;
  printable: boolean;
  nft: boolean;
  freebie: boolean;
  lastStatusUpdate: number;
  //////////////////////////

  // stats /////////////////
  sales: Types.ObjectId;
  prints: Types.ObjectId;
  downloads: Types.ObjectId;
  likes: Types.ObjectId;
  //////////////////////////

  // counts
  salesCount: number;
  printsCount: number;
  DownloadsCount: number;
  likesCount: number;
  //////////////////////////

  // dates ////////////
  uploadDate: number;
  //////////////////////////
}
