import { Injectable, NotFoundException } from '@nestjs/common';

import { ReservationDocument } from '../document/';
import { CreateReservationModel, UpdateReservationModel, RoomModel, ReservationModel } from '../models';
import { ReservationRepository, RoomRepository } from '../repositories';

@Injectable()
export class ReservationService {
    constructor(
        public readonly reservationRepository: ReservationRepository,
        public readonly roomRepository: RoomRepository,
    ) { }

    public async getReservations() {
        const reservations = await this.reservationRepository.getReservations();

        return reservations;
    }

    public async getBookedDates() {
        const rooms: RoomModel[] = await this.roomRepository.getRooms();
        let bookedDates: string[] = [];
        let freeDates: string[] = [];
        const now: Date = new Date();
        const onlyDate: string = now.toLocaleDateString();
        const nowDateInMilliseconds: number = Date.parse(onlyDate);
        const oneDayInMilliseconds: number = 86400000;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < rooms.length; i++) {
            const reservations: ReservationModel[] = await this.roomRepository.findReservationByRoom(rooms[i].id);
            const bookedDatesByRoom: string[] = [];
            // tslint:disable-next-line: prefer-for-of
            for (let j = 0; j < reservations.length; j++) {
                const checkIn: number = reservations[j].checkIn.valueOf();
                const checkOut: number = reservations[j].departure.valueOf();
                for (let x = checkIn; x <= checkOut; x = x + oneDayInMilliseconds) {
                    if (i === 0) {
                        bookedDates.push(new Date(x).toLocaleDateString());
                    }
                    bookedDatesByRoom.push(new Date(x).toLocaleDateString());
                }
            }
            // tslint:disable-next-line: max-line-length
            bookedDates = bookedDates.filter((bookedDate: string) => bookedDatesByRoom.findIndex((bookedDateByRoom: string) => bookedDateByRoom === bookedDate) >= 0);
        }
        for (let i = nowDateInMilliseconds; i <= nowDateInMilliseconds + oneDayInMilliseconds * 365; i = i + oneDayInMilliseconds) {
            freeDates.push(new Date(i).toLocaleDateString());
        }
        freeDates = freeDates.filter((freeDate: string) => bookedDates.findIndex((bookedDate: string) => bookedDate === freeDate) === -1);
        console.log('bookedDates', bookedDates);
        console.log('freeDates', freeDates);
        return rooms;
    }

    public async createReservation(createReservation: CreateReservationModel): Promise<ReservationModel> {
        const gotReservation: ReservationDocument = {};
        gotReservation.reservation = true;
        gotReservation.checkIn = createReservation.checkIn;
        gotReservation.departure = createReservation.checkOut;
        gotReservation.room = createReservation.room;

        const gotCheckIn: number = new Date(gotReservation.checkIn).valueOf();
        const gotCheckOut: number = new Date(gotReservation.departure).valueOf();
        const now: Date = new Date();
        const today: number = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
        if (gotCheckOut < gotCheckIn && today > gotCheckIn) {
            throw new NotFoundException('Incorrect date');
        }

        const room: RoomModel = await this.getRoomById(gotReservation.room);
        if (!room) {
            gotReservation.reservation = false;
            gotReservation.room = null;
        }
        if (room) {
            const foundReservationByRoom: ReservationModel[] = await this.reservationRepository.findReservationByRoom(room.id);
            let counter: number = 0;
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < foundReservationByRoom.length; i++) {
                const checkIn = foundReservationByRoom[i].checkIn.valueOf();
                const checkOut = foundReservationByRoom[i].departure.valueOf();
                if (((gotCheckIn < checkIn && gotCheckOut < checkIn) || gotCheckIn > checkOut) && (gotCheckOut < checkIn || gotCheckOut > checkOut)) {
                    counter++;
                }
            }
            if (counter === foundReservationByRoom.length) {
                const savedReservation: ReservationModel = await this.reservationRepository.createReservation(gotReservation);

                return savedReservation;
            }
            if (counter !== foundReservationByRoom.length) {
                throw new NotFoundException('These dates are already booked');
            }
        }
    }

    public async updateReservation(reservation: UpdateReservationModel) {

        const updateReservation: ReservationDocument = {} as ReservationDocument;
        updateReservation.id = reservation.id;
        updateReservation.reservation = reservation.reservation;
        updateReservation.checkIn = reservation.checkIn;
        updateReservation.departure = reservation.checkOut;
        updateReservation.room = reservation.room;

        const room = await this.getRoomById(updateReservation.room);
        if (!room) {
            updateReservation.room = null;

        }
        let updatedReservation: ReservationModel = await this.findReservation(updateReservation.id);
        if (updateReservation.reservation) {
            updatedReservation.reservation = updateReservation.reservation;
        }
        if (updateReservation.checkIn) {
            updatedReservation.checkIn = updateReservation.checkIn;
        }
        if (updateReservation.departure) {
            updatedReservation.departure = updateReservation.departure;
        }
        if (updateReservation.room) {
            updatedReservation.room = updateReservation.room;
        }
        if (!room) {
            updatedReservation.room = null;
        }

        updatedReservation = await this.reservationRepository.updateReservation(updatedReservation);

        return updatedReservation;
    }

    public async deleteReservation(reservationId: string): Promise<boolean> {
        const result = await this.reservationRepository.deleteReservation(reservationId);
        if (result.n === 0) {
            throw new NotFoundException('Could not find reservation.');
        }
        if (result.n === 1) {
            return true;
        }
    }

    private async findReservation(id: string): Promise<ReservationDocument> {
        const reservationId: ReservationDocument = {};
        reservationId.id = id;
        let reservation;
        try {
            reservation = await this.reservationRepository.findReservation(reservationId);
        } catch (error) {
            throw new NotFoundException('Could not find reservation.');
        }
        if (!reservation) {
            throw new NotFoundException('Could not find reservation.');
        }

        return reservation;
    }

    public async getRoomById(roomId: string): Promise<RoomModel> {
        const room: RoomModel = await this.findRoom(roomId);

        return room;
    }

    public async findRoom(id: string) {
        const room = await this.reservationRepository.findRoom(id);

        return room;
    }
}
