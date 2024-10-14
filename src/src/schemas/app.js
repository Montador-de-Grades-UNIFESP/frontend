import { z } from 'zod';

export const WeekDays = z.enum(['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']);
export const Hours = z.enum(['08h00-10h00', '10h00-12h00', '13h30-15h30', '15h30-17h30', '19h00-21h00', '21h00-23h00']);
export const Curso = z.enum(['BCT-I', 'BCT-N', 'BMC-I', 'EB-I', 'EB-N', 'BCC/EC-I', 'BCC/EC-N', 'EM-I', 'EM-N', 'BBT-I']);
export const Termo = z.number().int().min(1).max(12);
export const Turma = z.enum(['IA', 'IB', 'IC', 'ID', 'IE', 'NA', 'NB', 'NC', 'ND', 'NE']);

export const UC = z.object({
    NOME: z.string(),
    PROFESSORES: z.string(),
    TURMA: Turma,
    HORARIO: z.array(Hours),
    DIA: z.array(WeekDays),
    CURSO: Curso,
    TERMO: Termo,
    ID: z.number().int(),
});


export default {
    WeekDays,
    Hours,
    Curso,
    Termo,
    Turma,
    UC,
}
