import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from '../entities/reservas.entity';
import { ReservaService } from '../services/reservas.service';
import { ReservaController } from '../controllers/reservas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva], 'Reservas')],
  providers: [ReservaService],
  controllers: [ReservaController],
  exports: [TypeOrmModule],
})
export class ReservaModule {}
