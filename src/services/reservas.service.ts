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

//Quadro de horários
async buscarReservasPorData(data: string): Promise<Reserva[]> {
  if (!data) {
    throw new Error('O parâmetro data é obrigatório');
  }

  // Quebrar a data recebida e remover zeros à esquerda para padronizar
  const [dia, mes, ano] = data.split('-').map((str) => String(Number(str))); // Remove zeros à esquerda

  const dataNormalizada = `${dia}-${mes}-${ano}`;

  // Buscar todas as reservas e filtrar no código garantindo a normalização
  const reservas = await this.reservaRepository.find();

  return reservas.filter((reserva) => {
    const [d, m, y] = reserva.data
      .split('-')
      .map((str) => String(Number(str))); // Normaliza a data do banco
    const dataBancoNormalizada = `${d}-${m}-${y}`;
    return dataBancoNormalizada === dataNormalizada;
  });
}
}
