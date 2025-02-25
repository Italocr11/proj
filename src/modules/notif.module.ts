import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacao } from '../entities/notif.entity';
import { NotificacaoService } from '../services/notif.service';
import { NotificacaoController } from '../controllers/notif.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notificacao], 'Notificacoes')],
  controllers: [NotificacaoController],
  providers: [NotificacaoService],
  exports: [TypeOrmModule],
})
export class NotificacaoModule {}
