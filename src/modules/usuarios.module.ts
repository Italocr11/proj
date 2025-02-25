import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuarios.entity';
import { UsuariosService } from '../services/usuarios.service';
import { UsuariosController } from '../controllers/usuarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario], 'Usuarios')],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [TypeOrmModule],
})
export class UsuariosModule {}
