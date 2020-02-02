import * as mongoose from 'mongoose';

export const RoomSchema = new mongoose.Schema({
    name: { type: Number, required: true},
});

export interface RoomDocument extends mongoose.Document {
    id?: string;
    name?: number;
}
