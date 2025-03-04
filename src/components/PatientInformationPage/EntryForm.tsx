import React, { useState } from "react";
import { assertNever, BaseEntry, Entry, HealthCheckFields, HospitalFields, isEntry, isString, NewEntry, OccupationalHealthcareFields } from "../../types";
import { z } from "zod";
import { EntrySchema } from "../../utils";
import patients from "../../services/patients";
import { MenuItem, Select } from "@mui/material";

const defaultBaseEntryObject: Omit<BaseEntry, 'id'> = {
  description: "",
  date: "",
  specialist: "",
  diagnosisCodes: undefined
};

const defaultHealthCheckObject: HealthCheckFields = {
  type: "HealthCheck",
  healthCheckRating: 0
};

const defaultOccupationalHcData: OccupationalHealthcareFields = {
  type: "OccupationalHealthcare",
  employerName: "",
  sickLeave: undefined
};

const defaultHospitalData: HospitalFields = {
  type: "Hospital",
  discharge: {
    date: "",
    criteria: ""
  }
};

type EntryType = z.infer<typeof EntrySchema>['type'];

interface Props {
  patientId: string,
  diagnosisCodes: string[],
  addEntry: (entry: Entry) => void,
  setFormError: (message: string) => void
}

const EntryForm = (props: Props) => {
  const [entryType, setEntryType] = useState<EntryType>("HealthCheck");
  const [baseEntryData, setBaseEntryData] = useState<Omit<BaseEntry, 'id'>>(defaultBaseEntryObject);
  const [healthCheckData, setHealthCheckData] = useState<HealthCheckFields>(defaultHealthCheckObject);
  const [occupationalHcData, setOccupationalHcData] = useState<OccupationalHealthcareFields>(defaultOccupationalHcData);
  const [hospitalData, setHospitalData] = useState<HospitalFields>(defaultHospitalData);

  const clearFormFields = () => {
    setBaseEntryData(defaultBaseEntryObject);
    setHealthCheckData(defaultHealthCheckObject);
    setHealthCheckData(defaultHealthCheckObject);
    setOccupationalHcData(defaultOccupationalHcData);
    setHospitalData(defaultHospitalData);
  };

  const validateEntryData = (): string | null => {
    if (baseEntryData.description === "") return "Value of Description cannot be empty";
    if (baseEntryData.date === undefined) return "Value of Date cannot be empty";
    if (baseEntryData.specialist === "") return "Value of Specialist cannot be empty";

    switch(entryType) {
      case "HealthCheck":
        return null;
      case "OccupationalHealthcare":
        if (occupationalHcData.employerName === "") return "Value of Employer Name cannot be empty";
        return null;
      case "Hospital":
        if (hospitalData.discharge.criteria === "") return "Value of Discharge Criteria cannot be empty";
        if (hospitalData.discharge.date === "") return "Value of Discharge Date cannot be empty";

        return null;
      default:
        throw new Error(`Invalid entry type: ${entryType}`);
    }
  };

  const createEntryData = (): NewEntry => {
    switch (entryType) {
      case "HealthCheck":
        return {
          ...baseEntryData,
          ...healthCheckData
        };
      case "OccupationalHealthcare":
        return {
          ...baseEntryData,
          ...occupationalHcData
        };
      case "Hospital":
        return {
          ...baseEntryData,
          ...hospitalData
        };
      default:
        throw new Error(`Invalid entry type: ${entryType}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const entryDataValidationError = validateEntryData();

    if (entryDataValidationError) {
      props.setFormError(entryDataValidationError);
      return;
    }

    const entryData = createEntryData();
    
    await patients
      .addEntry(props.patientId, entryData)
      .then(data => {
        if (isEntry(data)) {
          props.addEntry(data);
          clearFormFields();
          props.setFormError('');
        
          return;
        }

        if (isString(data)) props.setFormError(data);
      });
  };

  const renderExtraFieldsByType = () => {
    switch (entryType) {
      case "HealthCheck":
        return (
          <>
            <label htmlFor="healthCheckRating">Health Check Rating</label>
            <input
              id="healthCheckRating"
              type="number"
              name="healthCheckRating"
              min={0}
              max={3}
              step={1}
              value={healthCheckData.healthCheckRating}
              onChange={({ target }) => setHealthCheckData({
                ...healthCheckData,
                healthCheckRating: Number(target.value)
              })}
            />
          </>
        );
      case "OccupationalHealthcare":
        return (
          <>
            <label htmlFor="employerName">Employer Name</label>
            <input
              id="employerName"
              type="text"
              name="employerName"
              value={occupationalHcData.employerName}
              onChange={({ target }) => setOccupationalHcData({
                ...occupationalHcData,
                employerName: target.value
              })}
            />
            <br/>
            <label htmlFor="sickLeaveStartDate">Sick Leave Start</label>
            <input
              id="sickLeaveStartDate"
              type="date"
              name="sickLeaveStartDate"
              value={occupationalHcData.sickLeave?.startDate || ""}
              onChange={({ target }) => {
                const currentSickLeave = occupationalHcData.sickLeave
                  || { startDate: '', endDate: '' };
                
                setOccupationalHcData({
                  ...occupationalHcData,
                  sickLeave: {
                    ...currentSickLeave,
                    startDate: target.value
                  }
                });
              }}
            />
            <br/>
            <label htmlFor="sickLeaveEndDate">Sick Leave End</label>
            <input
              id="sickLeaveEndDate"
              type="date"
              name="sickLeaveEndDate"
              value={occupationalHcData.sickLeave?.endDate}
              onChange={({ target }) => {
                const currentSickLeave = occupationalHcData.sickLeave
                  || { startDate: '', endDate: '' };

                setOccupationalHcData({
                  ...occupationalHcData,
                  sickLeave: {
                    ...currentSickLeave,
                    endDate: target.value
                  }
                });
              }}
            />
          </>
        );
      case "Hospital":
        return (
          <>
            <label htmlFor="dischargeDate">Discharge Date</label>
            <input
              id="dischargeDate"
              type="date"
              name="dischargeDate"
              value={hospitalData.discharge.date}
              onChange={({ target }) => setHospitalData({
                ...hospitalData,
                discharge: {
                  ...hospitalData.discharge,
                  date: target.value
                }
              })}
            />
            <br/>
            <label htmlFor="dischargeCriteria">Discharge Criteria</label>
            <input
              id="dischargeCriteria"
              type="text"
              name="dischargeCriteria"
              value={hospitalData.discharge.criteria}
              onChange={({ target }) => setHospitalData({
                ...hospitalData,
                discharge: {
                  ...hospitalData.discharge,
                  criteria: target.value
                }
              })}
            />
          </>
        );
      default:
        assertNever(entryType);
    }
  };

  return (
    <div style={{ border: "1px dashed", padding: "16px" }}>
      <h2>New Entry</h2>
      <label htmlFor="entryType">Entry Type</label>
      <select
        id="entryType"
        name="type"
        value={entryType}
        onChange={({ target }) => setEntryType(target.value as EntryType)}>
        <option value="HealthCheck">Health Check</option>
        <option value="OccupationalHealthcare">Occupational Healthcare</option>
        <option value="Hospital">Hospital </option>
      </select>
      <br/>
      <form onSubmit={handleSubmit}>
        <label htmlFor="entryDescription">Description</label>
        <input
          id="entryDescription"
          type="text"
          name="entryDescription"
          value={baseEntryData.description}
          onChange={({ target }) => setBaseEntryData({
            ...baseEntryData,
            description: target.value
          })}
        />
        <br/>
        <label htmlFor="entryDate">Date</label>
        <input
          id="entryDate"
          type="date"
          name="entryDate"
          value={baseEntryData.date}
          onChange={({ target }) => setBaseEntryData({
            ...baseEntryData,
            date: target.value
          })}
        />
        <br/>
        <label htmlFor="entrySpecialist">Specialist</label>
        <input
          id="entrySpecialist"
          type="text"
          name="entrySpecialist"
          value={baseEntryData.specialist}
          onChange={({ target }) => setBaseEntryData({
            ...baseEntryData,
            specialist: target.value
          })}
        />
        <br/>
        <label htmlFor="diagnosisCodes">Diagnosis Codes</label>
        <Select
          id="diagnosisCodes"
          multiple
          value={baseEntryData.diagnosisCodes || []}
          onChange={({ target }) => setBaseEntryData({
            ...baseEntryData,
            diagnosisCodes: Array.isArray(target.value) ? target.value : []
          })}
          size="small"
          sx={{
            width: '156.5px',
            height: '38px'
          }}
        >
          {props.diagnosisCodes.map((code) => (
            <MenuItem key={code} value={code}>{code}</MenuItem>
          ))}
        </Select>
        <br/>
        {renderExtraFieldsByType()}
        <div style={{ marginTop: "16px"}}>
          <button
            type="button"
            style={{backgroundColor: "pink", color: "white", padding: "8px" }}>
            CANCEL
          </button>
          <button type="submit" style={{ backgroundColor: "lightgray", padding: "8px" }}>
            ADD
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntryForm;
