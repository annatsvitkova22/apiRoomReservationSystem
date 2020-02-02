import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ReservationDocument, RoomDocument } from '../document';
import { ReservationModel } from 'src/models';

@Injectable()
export class ReservationRepository {
    constructor(
        @InjectModel('Reservation') public reservationModel: Model<ReservationDocument>,
        @InjectModel('Room') public roomModel: Model<RoomDocument>,
    ) { }

    public async getReservations() {
        const reservations = await this.reservationModel.find().exec();

        return reservations;
    }

    public async createReservation(createReservation: ReservationDocument): Promise<ReservationModel> {
        const newReservation = new this.reservationModel(
            createReservation,
        );
        const createdReservation: ReservationModel = await newReservation.save();

        return createdReservation;
    }

    public async updateReservation(updateReservation: ReservationDocument): Promise<ReservationModel> {
        const reservation = new this.reservationModel(
            updateReservation,
        );
        const updatedReservation: ReservationModel = await reservation.save();

        return updatedReservation;
    }

    public async deleteReservation(reservationId: string) {
        const result = await this.reservationModel.deleteOne({ _id: reservationId }).exec();

        return result;
    }

    public async findReservation(reservation: ReservationDocument) {
        const foundReservation = await this.reservationModel.findById(reservation.id).exec();

        return foundReservation;
    }

    public async findReservationByRoom(roomId: string): Promise<ReservationModel[]> {
        const foundReservation: ReservationModel[] = await this.reservationModel.find({ room: roomId });

        return foundReservation;
    }

    public async findRoom(id: string) {
        const foundRoom = await this.roomModel.findById(id);

        return foundRoom;
    }
}
