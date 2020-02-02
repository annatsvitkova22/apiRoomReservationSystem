import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomSchema, ReservationSchema } from './document';
import { ReservationController, RoomController} from './controllers';
import { ReservationService, RoomService} from './services';
import { ReservationRepository, RoomRepository} from './repositories';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://Anna:O29rrc1bf4iv0L57@cluster0-ucmvx.mongodb.net/test?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    MongooseModule.forFeature([{ name: 'Reservation', schema: ReservationSchema }]),
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
  ],
  controllers: [AppController, ReservationController, RoomController],
  providers: [AppService, ReservationService, RoomService, ReservationRepository, RoomRepository],
})
export class AppModule { }
