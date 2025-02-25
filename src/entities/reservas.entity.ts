import { IsEmail } from 'class-validator';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail()
  @Column()
  userEmail: string;

  @Column()
  esporte: string;

  @Column()
  valor: number;

  @Column()
  data: string;

  @Column()
  horario: string;

  @Column()
  bola: boolean;

  @Column()
  rede: boolean;

  @Column()
  coletes: boolean;
}
