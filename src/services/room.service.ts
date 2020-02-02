import { Injectable, NotFoundException } from '@nestjs/common';

import { RoomDocument } from '../document';
import { RoomRepository } from '../repositories';
import { CreateRoomModel, UpdateRoomModel, ReservationModel, RoomModel } from '../models';

@Injectable()
export class RoomService {
    constructor(
        public readonly roomRepository: RoomRepository,
    ) { }

    public async getRooms(): Promise<RoomModel[]> {
        const gotRooms: RoomModel[] = await this.roomRepository.getRooms();

        return gotRooms;
    }

    public async getRoomById(roomId: string): Promise<RoomModel> {
        const gotRoom: RoomModel = await this.findRoom(roomId);

        return gotRoom;
    }

    public async createRoom(createRoom: CreateRoomModel): Promise<RoomModel> {
        const getRoom: RoomDocument = {};
        getRoom.name = createRoom.name;
        const createdRoom: RoomModel = await this.roomRepository.createRoom(getRoom);

        return createdRoom;
    }

    public async updateRoom(updateRoom: UpdateRoomModel): Promise<RoomModel> {
        const gotRoom: RoomDocument = {};
        gotRoom.id = updateRoom.id;
        gotRoom.name = updateRoom.name;
        const updatedRoom: RoomModel = await this.roomRepository.updateRoom(gotRoom);

        return updatedRoom;
    }

    public async deleteRoom(roomId: string): Promise<boolean> {
        const result = await this.roomRepository.deleteRoom(roomId);
        if (result.n === 0) {
            throw new NotFoundException('Could not find room.');
        }
        if (result.n === 1) {
            const foundReservations: ReservationModel[] = await this.findReservationByRoom(roomId);
            if (foundReservations) {
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < foundReservations.length; i++) {
                    await this.roomRepository.updateReservationByRoom(foundReservations[i].id);
                }
            }
            return true;
        }
    }

    public async findRoom(id: string): Promise<RoomDocument> {
        const foundRoom: RoomDocument = await this.roomRepository.getRoomById(id);

        return foundRoom;
    }

    public async findReservationByRoom(roomId: string): Promise<ReservationModel[]> {
        try {
            const reservation: ReservationModel[] = await this.roomRepository.findReservationByRoom(roomId);

            return reservation;
        } catch (error) {
            throw new NotFoundException('error:', error);
        }
    }
}
