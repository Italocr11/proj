import { IsEmail } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notificacao {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail()
  @Column()
  userEmail: string;

  @Column()
  data: string;

  @Column()
  horario: string;

  @Column()
  verif: boolean;
}
