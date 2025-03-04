import { z } from 'zod';

export const DiagnosisSchema = z.object({
  code: z.string(),
  name: z.string(),
  latin: z.string().optional()
});

export const BaseEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  diagnosisCodes: z.array(DiagnosisSchema.shape.code).optional()
});

export const HealthCheckFieldsSchema = z.object({
  healthCheckRating: z.number().min(0).max(3),
  type: z.literal('HealthCheck')
});

export const OccupationalHealthcareFieldsSchema = z.object({
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string().date(),
      endDate: z.string().date()
    })
    .optional(),
  type: z.literal('OccupationalHealthcare')
});

export const HospitalFieldsSchema = z.object({
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string()
  }),
  type: z.literal('Hospital')
});

const HealthCheckEntrySchema = BaseEntrySchema.merge(HealthCheckFieldsSchema);
const OccupationalHealthcareEntrySchema = BaseEntrySchema.merge(OccupationalHealthcareFieldsSchema);
const HospitalEntrySchema = BaseEntrySchema.merge(HospitalFieldsSchema);

export const EntrySchema = z.discriminatedUnion('type', [
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
  HealthCheckEntrySchema
]);

export const NewEntrySchema = z.discriminatedUnion('type', [
  HospitalEntrySchema.omit({ id: true }),
  OccupationalHealthcareEntrySchema.omit({ id: true }),
  HealthCheckEntrySchema.omit({ id: true })
]);
