import { useParams } from "react-router-dom";
import { assertNever, Diagnosis, Entry, Gender, HealthCheckRating, Patient } from "../../types";
import { Favorite, Female, LocalHospital, Male, MedicalServices, Transgender, Work } from "@mui/icons-material";
import { useEffect, useState } from "react";
import patients from "../../services/patients";
import diagnoses from "../../services/diagnoses";

const PatientInformationPage = () => {
  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnosisList, setDiagnosisList] = useState<Diagnosis[] | null>(null);

  const getHealthRatingColor = (rating: HealthCheckRating) => {
    switch (rating) {
      case HealthCheckRating.Healthy:
        return "green";
      case HealthCheckRating.LowRisk:
        return "yellow";
      case HealthCheckRating.HighRisk:
        return "orange";
      case HealthCheckRating.CriticalRisk:
        return "red";
      default:
        assertNever(rating);
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      const fetchedPatient = await patients.getById(id);
      setPatient(fetchedPatient);
    };

    const fetchDiagnoses = async () => {
      const fetchedDiagnoses = await diagnoses.getAll();
      setDiagnosisList(fetchedDiagnoses);
    };

    fetchPatient();
    fetchDiagnoses();
  }, [id]);

  if (!patient) return <p>Loading...</p>;

  const renderGenderIcon = () => {
    switch(patient.gender) {
      case Gender.Male:
        return <Male fontSize="small" />;
      case Gender.Female:
        return <Female fontSize="small" />;
      case Gender.Other:
        return <Transgender fontSize="small" />;
      default:
        assertNever(patient.gender);
    }
  };

  const renderEntry = (entry: Entry) => {
    switch(entry.type) {
      case 'HealthCheck':
        return <>
          <span style={{ lineHeight: "1.25"}}>{entry.date} <MedicalServices fontSize="small" />
            <br/><i>{entry.description}</i>
            <br/><Favorite sx={{ color: getHealthRatingColor(entry.healthCheckRating) }} />
            <br/>diagnose by {entry.specialist}
          </span>
        </>;
      case 'OccupationalHealthcare':
        return <>
          <span style={{ lineHeight: "1.25"}}>{entry.date} <Work fontSize="small" /> {entry.employerName}
            <br/><i>{entry.description}</i>
            <br/>diagnose by {entry.specialist}
          </span>
        </>;
      case 'Hospital':
        return <>
          <span style={{ lineHeight: "1.25"}}>{entry.date} {entry.description} <LocalHospital fontSize="small"/>
            <br/>diagnose by {entry.specialist}
            <br/>discharged {entry.discharge.date}: {entry.discharge.criteria}
          </span>
        </>;
      default:
        assertNever(entry);
    }
  };

  return (
    <div style={{ margin: "16px 0" }}>
      <div>
        <div>
          <h2 style={{ display: "inline" }}>{patient.name}</h2> {renderGenderIcon()}
        </div>
        <p>ssn: {patient.ssn}
          <br/>occupation: {patient.occupation}
        </p>
      </div>
      <div>
        <h3>entries</h3>
        {patient.entries.map(entry => 
          <div key={entry.id} style={{
            border: "1px solid",
            borderRadius: "8px",
            padding: "4px",
            marginBottom: "8px"
          }}>
            {renderEntry(entry)}
            {entry.diagnosisCodes
              ? <ul>
                {entry.diagnosisCodes?.map(d => {
                  const diagnosis = diagnosisList?.find(dn => dn.code === d);
                  return <li key={d}>{d} {diagnosis?.name}</li>;
                })}
              </ul>
              : <></>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientInformationPage;
