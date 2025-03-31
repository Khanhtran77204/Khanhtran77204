import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c64fd3e (bai tap graphql)
>>>>>>> 32d82ab (bai tap graphql)
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { VenuesModule } from './venues/venues.module';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/coworking-booking'),
    UsersModule,
    VenuesModule,
    BookingsModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
<<<<<<< HEAD
export class AppModule {}
=======
<<<<<<< HEAD
export class AppModule {}
=======
export class AppModule {}
=======

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
>>>>>>> 1f20efa (Bai tap GraphQL)
>>>>>>> c64fd3e (bai tap graphql)
>>>>>>> 32d82ab (bai tap graphql)
