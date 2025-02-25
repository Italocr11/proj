import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacao } from '../entities/notif.entity';

@Injectable()
export class NotificacaoService {
  constructor(
    @InjectRepository(Notificacao, 'Notificacoes')
    private readonly notificacaoRepository: Repository<Notificacao>,
  ) {}

  async create(notificacaoData: {
    data: string;
    horario: string;
    verif: boolean;
    userEmail: string;
  }): Promise<Notificacao> {
    const notificacao = this.notificacaoRepository.create(notificacaoData);
    return this.notificacaoRepository.save(notificacao);
  }

  async findLastFiveByEmail(userEmail: string): Promise<Notificacao[]> {
    return this.notificacaoRepository.find({
      where: { userEmail },
      order: { id: 'DESC' },
      take: 5,
    });
  }
}
