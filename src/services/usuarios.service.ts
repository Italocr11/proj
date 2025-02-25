import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuarios.entity';
import { EmailValidatorService } from './email-validator.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario, 'Usuarios')
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async criarUsuario(
    nome: string,
    email: string,
    senha: string,
    telefone: string,
  ): Promise<Usuario> {
    const isValid = await EmailValidatorService.isValidGoogleEmail(email);

    if (!isValid) {
      throw new BadRequestException('É necessário ser um e-mail do Google!');
    }

    const usuario = this.usuarioRepository.create({
      nome,
      email,
      senha,
      telefone,
    });
    return this.usuarioRepository.save(usuario);
  }

  //Deletar registro

  async deletarUsuarioID(id: number): Promise<void> {
    const resultado = await this.usuarioRepository.delete(id);

    if (resultado.affected === 0) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado!`);
    }
  }

  //Login

async validarUsuario(email: string, senha: string): Promise<Usuario | null> {
  const usuario = await this.usuarioRepository.findOne({ where: { email } });

  if (usuario && senha === usuario.senha) {
    return usuario;
  }
  return null;
}

async login(usuario: Usuario) {
  return { message: 'Login feito com sucesso!', usuario };
}

  
}
