import debug from "debug";
import { Types } from "mongoose";

import { CreateFileDto } from "../dto/create.file.dto";
import { PatchFileDto } from "../dto/patch.file.dto";
import { PutFileDto } from "../dto/put.file.dto";

import mongooseService from "../../common/services/mongoose.service";

const log: debug.IDebugger = debug("app:files-dao");

class FilesDao {
  Schema = mongooseService.getMongoose().Schema;

  fileSchema = new this.Schema({
    // file information //////
    title: String,
    description: String,
    source: { type: String, required: true, },
    //////////////////////////

    // file status ///////////
    visible: { type: Boolean, required: true, default: true },
    printable: { type: Boolean, required: true, default: false },
    nft: { type: Boolean, required: true, default: false },
    freebie: { type: Boolean, required: true, default: false },
    lastStatusUpdate: Number,
    //////////////////////////

    // stats /////////////////
    sales: [
      {
        type: Types.ObjectId,
        ref: "Sale", //
      },
    ],
    prints: [
      {
        type: Types.ObjectId,
        ref: "Print", //
      },
    ],
    downloads: [
      {
        type: Types.ObjectId,
        ref: "Download", //
      },
    ],
    likes: [
      {
        type: Types.ObjectId,
        ref: "Download", //
      },
    ],
    //////////////////////////

    // counts
    salesCount: Number,
    printsCount: Number,
    downloadsCount: Number,
    likesCount: Number,
    //////////////////////////

    // dates ////////////
    uploadDate: Number,
    //////////////////////////
  });

  File = mongooseService.getMongoose().model("File", this.fileSchema);

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  constructor() {
    log("Created new instance of FilesDao");
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // methods /////////////////

  async addFile(fileFields: CreateFileDto) {
    const file = new this.File({
      ...fileFields,
    });
    await file.save();

    return file;
  }

  async getFileById(fileId: Types.ObjectId) {
    return this.File.findById(fileId).exec();
  }

  async getFiles(limit = 25, page = 0) {
    return this.File.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateFileById(
    fileId: Types.ObjectId,
    fileFields: PatchFileDto | PutFileDto
  ) {
    const existingFile = await this.File.findOneAndUpdate(
      { _id: fileId },
      { $set: fileFields },
      { new: true }
    ).exec();

    return existingFile;
  }

  async removeFileById(FileId: Types.ObjectId) {
    return this.File.deleteOne({ _id: FileId }).exec();
  }
}

export default new FilesDao();
