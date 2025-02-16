export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

interface HospitalDischarge {
  date: string,
  criteria: string
}

interface OccupationalHealthcareSickLeave {
  startDate: string,
  endDate: string
}

interface BaseEntry {
  id: string,
  description: string,
  date: string,
  specialist: string,
  diagnosisCodes?: Array<Diagnosis['code']>
}

interface HospitalEntry extends BaseEntry {
  discharge: HospitalDischarge,
  type: "Hospital"
}

interface OccupationalHealthcareEntry extends BaseEntry {
  employerName: string,
  sickLeave?: OccupationalHealthcareSickLeave,
  type: "OccupationalHealthcare"
}

interface HealthCheckEntry extends BaseEntry {
  healthCheckRating: HealthCheckRating,
  type: "HealthCheck"
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[]
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};
