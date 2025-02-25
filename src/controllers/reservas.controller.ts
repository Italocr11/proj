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

}
