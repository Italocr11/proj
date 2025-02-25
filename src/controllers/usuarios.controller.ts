import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  HttpCode,
  ParseIntPipe,
  UnauthorizedException,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../entities/usuarios.entity';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async criarUsuario(
    @Body('nome') nome: string,
    @Body('email') email: string,
    @Body('senha') senha: string,
    @Body('telefone') telefone: string,
  ): Promise<Usuario> {
    return this.usuariosService.criarUsuario(nome, email, senha, telefone);
  }

  @Delete(':id')
  @HttpCode(204)
  async deletarUsuarioID(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usuariosService.deletarUsuarioID(id);
  }
}
