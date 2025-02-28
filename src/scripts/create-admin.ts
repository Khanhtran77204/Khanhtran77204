import { MongooseModule } from '@nestjs/mongoose';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { User, UserSchema } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/coworking-booking'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [MongooseModule],
})
class AdminModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AdminModule);
  
  const userModel = app.get<Model<User>>('UserModelToken');

  const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin',
  };

  try {
    await userModel.create(adminUser);
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }

  await app.close();
}

bootstrap();