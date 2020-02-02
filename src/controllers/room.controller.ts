import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';

import { RoomService } from '../services';
import { CreateRoomModel, UpdateRoomModel, RoomModel } from '../models';

@Controller('room')
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
    ) { }

    @Get()
    public async getAllRoom(): Promise<RoomModel[]> {
        const gotRooms: RoomModel[] = await this.roomService.getRooms();

        return gotRooms;
    }

    @Get(':id')
    public async getRoom(@Param('id') roomId: string): Promise<RoomModel> {
        const gotRoom: RoomModel = await this.roomService.getRoomById(roomId);

        return gotRoom;
    }

    @Post()
    public async createRoom(@Body() createRoom: CreateRoomModel): Promise<RoomModel> {
        const createdRoom: RoomModel = await this.roomService.createRoom(createRoom);

        return createdRoom;
    }

    @Put()
    public async updateRoom(
        @Body() updateRoom: UpdateRoomModel): Promise<RoomModel> {
        const updatedRoom: RoomModel = await this.roomService.updateRoom(updateRoom);

        return updatedRoom;
    }

    @Delete(':id')
    public async removeRoom(@Param('id') roomId: string): Promise<boolean> {
        const isRemovedRoom: boolean = await this.roomService.deleteRoom(roomId);

        return isRemovedRoom;
    }
}
