import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalsModule } from './globals.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [GlobalsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
