import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from '../entities/reservas.entity';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
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

  // Quadro de horários
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

  // Método para deletar uma reserva dada a data, horário e email
  async deletarReserva(
    userEmail: string,
    data: string,
    horario: string,
  ): Promise<void> {
    const resultado = await this.reservaRepository.delete({
      userEmail,
      data,
      horario,
    });

    if (resultado.affected === 0) {
      throw new Error(
        'Nenhuma reserva encontrada para deletar com os parâmetros fornecidos.',
      );
    }
  }

  async buscarReservasPorEmailEData(userEmail: string): Promise<Reserva[]> {
    if (!userEmail) {
      throw new Error('O parâmetro userEmail é obrigatório');
    }

    // Obtendo a data de hoje no formato DD-MM-YYYY
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Meses começam do 0, então somamos 1
    const ano = hoje.getFullYear();
    const hojeFormatted = `${dia}-${mes}-${ano}`; // Mantendo no formato DD-MM-YYYY

    // Buscar todas as reservas e filtrar as futuras manualmente
    const reservas = await this.reservaRepository.find({
      where: { userEmail },
      order: { data: 'ASC' }, // Ordena da mais próxima para a mais distante
    });

    // Filtrar as reservas futuras manualmente
    return reservas.filter((reserva) => {
      const [d, m, y] = reserva.data.split('-').map(Number); // Convertendo para números
      const dataReserva = new Date(y, m - 1, d); // Criando objeto Date
      return dataReserva >= hoje; // Mantendo apenas as reservas futuras
    });
  }

  // Histórico: buscar TODAS as reservas, ordenando da mais recente para a mais antiga
  async buscarReservasPorEmail(userEmail: string): Promise<Reserva[]> {
    if (!userEmail) {
      throw new Error('O parâmetro userEmail é obrigatório');
    }

    return this.reservaRepository.find({
      where: { userEmail },
      order: { data: 'DESC' }, // Ordena da mais recente para a mais antiga
    });
  }
}