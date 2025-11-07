import {File} from '../models/Model.js';

class FileRepository {
    async createFile(fileData) {
        return await File.create(fileData);
    }
}

export const fileRepo = new FileRepository();