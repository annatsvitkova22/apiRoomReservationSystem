import * as mongoose from 'mongoose';
import { RoomSchema } from './room.model';

export const ReservationSchema = new mongoose.Schema({
    room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
    reservation: { type: Boolean, required: true},
    checkIn: { type: Date, required: true},
    departure: { type: Date, required: true},
});

export interface ReservationDocument extends mongoose.Document {
    id?: string;
    room?: string;
    reservation?: boolean;
    checkIn?: Date;
    departure?: Date;
}

mongoose.model('Room', RoomSchema);
