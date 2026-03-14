import { z } from 'zod';

const emptyToUndefined = (value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

const numericString = (fieldLabel) => z
  .preprocess(emptyToUndefined, z.union([
    z.number(),
    z.string().trim().regex(/^-?\d+(?:[.,]\d+)?$/, `${fieldLabel} debe ser numérico.`).transform((value) => Number.parseFloat(value.replace(',', '.')))
  ]))
  .optional();

const integerString = (fieldLabel) => z
  .preprocess(emptyToUndefined, z.union([
    z.number().int(),
    z.string().trim().regex(/^\d+$/, `${fieldLabel} debe ser un entero.`).transform((value) => Number.parseInt(value, 10))
  ]))
  .optional();

export const adminLoginSchema = z.object({
  password: z.string().trim().min(1, 'El password es obligatorio.')
});

export const sectorSchema = z.object({
  name: z.string().trim().min(1, 'El nombre del sector es obligatorio.'),
  location: z.string().trim().min(1, 'La ubicación es obligatoria.'),
  description: z.string().optional().default('')
});

export const routeSchema = z.object({
  id: z.string().trim().min(1, 'El ID de la vía es obligatorio.'),
  name: z.string().trim().min(1, 'El nombre de la vía es obligatorio.'),
  grade: z.string().optional().default('Sin grado'),
  stars: z.preprocess(emptyToUndefined, z.union([z.string(), z.number()]).optional()),
  type: z.string().optional().default('Sport'),
  description: z.string().optional().default(''),
  lengthMeters: integerString('Largo'),
  quickdraws: integerString('Expresses'),
  image: z.string().optional().default(''),
  equippedBy: z.string().optional().default(''),
  equippedDate: z.string().optional().default(''),
  firstAscentBy: z.string().optional().default(''),
  firstAscentDate: z.string().optional().default(''),
  latitude: numericString('Latitud'),
  longitude: numericString('Longitud')
});

export const subsectorSchema = z.object({
  id: z.string().trim().min(1, 'El ID del subsector es obligatorio.'),
  name: z.string().trim().min(1, 'El nombre del subsector es obligatorio.'),
  sector: z.string().optional().default('Potrero Alto'),
  description: z.string().optional().default(''),
  image: z.string().optional().default(''),
  routes: z.array(routeSchema).optional().default([])
});

export const databasePayloadSchema = z.object({
  sector: sectorSchema,
  subsectors: z.array(subsectorSchema)
});
