import { useParams } from "react-router-dom";
import { assertNever, Diagnosis, Gender, Patient } from "../../types";
import { Female, Male, Transgender } from "@mui/icons-material";
import { useEffect, useState } from "react";
import patients from "../../services/patients";
import diagnoses from "../../services/diagnoses";
import EntriesSection from "./EntriesSection";

const PatientInformationPage = () => {
  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnosisList, setDiagnosisList] = useState<Diagnosis[]>([]);

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

  return (
    <div style={{ margin: "16px 0" }}>
      <div>
        <div>
          <h2 style={{ display: "inline" }}>{patient.name}</h2> {renderGenderIcon()}
        </div>
        <p>ssn: {patient.ssn}
          <br/>occupation: {patient.occupation}
        </p>
        <EntriesSection entries={patient.entries} diagnoses={diagnosisList}/>
      </div>
      
    </div>
  );
};

export default PatientInformationPage;
