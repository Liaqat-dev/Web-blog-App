import multer, { StorageEngine, diskStorage ,FileFilterCallback} from "multer";
import { Request } from "express";


const storage: StorageEngine = diskStorage({});

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    if (!file.mimetype.includes("image")) {
        return callback(new Error("Invalid Image Format"));
    }
    callback(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
