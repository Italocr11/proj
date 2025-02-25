import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Reserva } from '../entities/reservas.entity';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva, 'Reservas')
    private reservaRepository: Repository<Reserva>,
  ) {}

  async criarReserva(
    userEmail: string,
    esporte: string,
    valor: number,
    data: string,
    horario: string,
    bola: boolean,
    rede: boolean,
    coletes: boolean,
  ): Promise<Reserva> {
    const reserva = this.reservaRepository.create({
      userEmail,
      esporte,
      valor,
      data,
      horario,
      bola,
      rede,
      coletes,
    });
    return this.reservaRepository.save(reserva);
  }


}
