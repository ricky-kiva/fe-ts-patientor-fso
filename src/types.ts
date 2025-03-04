import { z } from "zod";
import { BaseEntrySchema, DiagnosisSchema, EntrySchema, HealthCheckFieldsSchema, HospitalFieldsSchema, NewEntrySchema, OccupationalHealthcareFieldsSchema } from "./utils";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export type Diagnosis = z.infer<typeof DiagnosisSchema>;
export type BaseEntry = z.infer<typeof BaseEntrySchema>;
export type HealthCheckFields = z.infer<typeof HealthCheckFieldsSchema>;
export type OccupationalHealthcareFields = z.infer<typeof OccupationalHealthcareFieldsSchema>;
export type HospitalFields = z.infer<typeof HospitalFieldsSchema>;
export type Entry = z.infer<typeof EntrySchema>;
export type NewEntry = z.infer<typeof NewEntrySchema>;

export type PatientFormValues = Omit<Patient, "id" | "entries">;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[]
}

export const isEntry = (data: unknown): data is Entry => {
  return EntrySchema.safeParse(data).success;
};

export const isString = (data: unknown): data is string => {
  return typeof data === "string" || data instanceof String;
};

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};
