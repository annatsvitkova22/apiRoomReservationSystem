import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ReservationDocument, RoomDocument } from '../document';
import { ReservationModel, RoomModel } from '../models';

@Injectable()
export class RoomRepository {
    constructor(
        @InjectModel('Reservation') public reservationModel: Model<ReservationDocument>,
        @InjectModel('Room') public roomModel: Model<RoomDocument>,
    ) { }

    public async getRooms(): Promise<RoomModel[]> {
        const gotRooms: RoomModel[] = await this.roomModel.find().exec();

        return gotRooms;
    }

    public async getRoomById(roomId: string): Promise<RoomModel> {
        const foundRoom: RoomModel = await this.roomModel.findById(roomId);

        return foundRoom;
    }

    public async createRoom(createRoom: RoomDocument): Promise<RoomModel> {
        const newRoom = new this.roomModel(
            createRoom,
        );
        const createdRoom: RoomModel = await newRoom.save();

        return createdRoom;
    }

    public async updateRoom(updateRoom: RoomDocument): Promise<RoomModel> {
        const updatedRoom: RoomModel = this.roomModel.findByIdAndUpdate(updateRoom.id, { $set: { name: updateRoom.name } });

        return updatedRoom;
    }

    public async deleteRoom(roomId: string) {
        const result = await this.roomModel.deleteOne({ _id: roomId }).exec();

        return result;
    }

    public async findReservationByRoom(roomId: string): Promise<ReservationModel[]> {
        const foundReservation: ReservationModel[] = await this.reservationModel.find({ room: roomId });

        return foundReservation;
    }

    public async updateReservationByRoom(reservationId: string): Promise<ReservationModel> {
        // tslint:disable-next-line: max-line-length
        const updatedReservation: ReservationModel = this.reservationModel.findOneAndUpdate({ _id: reservationId }, { $set: { room: null, reservation: false } });

        return updatedReservation;
    }
}
