import { Controller, Post, Body, Get, Query, Delete } from '@nestjs/common';
import { ReservaService } from '../services/reservas.service';
import { Reserva } from '../entities/reservas.entity';

@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  async criarReserva(
    @Body('userEmail') userEmail: string,
    @Body('esporte') esporte: string,
    @Body('valor') valor: number,
    @Body('data') data: string,
    @Body('horario') horario: string,
    @Body('bola') bola: boolean,
    @Body('rede') rede: boolean,
    @Body('coletes') coletes: boolean,
  ): Promise<Reserva> {
    return this.reservaService.criarReserva(
      userEmail,
      esporte,
      valor,
      data,
      horario,
      bola,
      rede,
      coletes,
    );
  }

//Quadro de horários
@Get('quadro')
async buscarReservasPorData(@Query('data') data: string): Promise<Reserva[]> {
  return this.reservaService.buscarReservasPorData(data);
}

@Delete('cancelar')
  async deletarReserva(
    @Query('userEmail') userEmail: string, // Parâmetros vindo da query string
    @Query('data') data: string,
    @Query('horario') horario: string,
  ): Promise<string> {
    try {
      await this.reservaService.deletarReserva(userEmail, data, horario);
      return 'Reserva deletada com sucesso';
    } catch (error) {
      return `Erro ao deletar a reserva: ${error.message}`;
    }
  }

  @Get('interface')
  async buscarReservasPorEmailEData(
    @Query('userEmail') userEmail: string, // O parâmetro "userEmail" vem da query string
  ): Promise<Reserva[]> {
    if (!userEmail) {
      throw new Error('O parâmetro userEmail é obrigatório');
    }

    return this.reservaService.buscarReservasPorEmailEData(userEmail);
  }

  

}
