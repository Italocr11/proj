import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from '../entities/reservas.entity';
import { ReservaService } from '../services/reservas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva])],
  providers: [ReservaService],
  exports: [ReservaService],
})
export class ReservasModule {}