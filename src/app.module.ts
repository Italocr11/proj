import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaModule } from './modules/reservas.module';
import { UsuariosModule } from './modules/usuarios.module';
import { NotificacaoModule } from './modules/notif.module';

@Module({
  imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'database.sqlite',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // Apenas para desenvolvimento
        }),
        ReservaModule,
        UsuariosModule,
        NotificacaoModule,
      ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}