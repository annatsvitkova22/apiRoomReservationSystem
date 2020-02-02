import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { ReservationService } from '../services';
import { CreateReservationModel, UpdateReservationModel, ReservationModel } from '../models';

@Controller('reservation')
export class ReservationController {
    constructor(
        private readonly reservationService: ReservationService,
    ) { }

    @Get()
    public async getAllReservations() {
        const reservations = await this.reservationService.getReservations();

        return reservations;
    }

    @Get('calendar')
    public async getCalendar() {
        const calendar = await this.reservationService.getBookedDates();

        return calendar;
    }

    @Post()
    public async createReservation(@Body() createReservation: CreateReservationModel): Promise<ReservationModel> {
        const createdReservation: ReservationModel = await this.reservationService.createReservation(createReservation);

        return createdReservation;
    }

    @Put()
    public async updateReservation(@Body() updateReservation: UpdateReservationModel): Promise<ReservationModel> {
        const updatedReservation: ReservationModel = await this.reservationService.updateReservation(updateReservation);

        return updatedReservation;
    }

    @Delete(':id')
    public async removeReservation(@Param('id') reservationId: string): Promise<boolean> {
        const isRemovedReservation: boolean = await this.reservationService.deleteReservation(reservationId);

        return isRemovedReservation;
    }
}
