import { useParams } from "react-router-dom";
import { assertNever, Diagnosis, Entry, Gender, Patient } from "../../types";
import { Female, InfoOutlined, Male, Transgender } from "@mui/icons-material";
import { useEffect, useState } from "react";
import patients from "../../services/patients";
import diagnoses from "../../services/diagnoses";
import EntriesSection from "./EntriesSection";
import EntryForm from "./EntryForm";

const PatientInformationPage = () => {
  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnosisList, setDiagnosisList] = useState<Diagnosis[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

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

  const addEntry = (entry: Entry) => {
    setPatient({
      ...patient,
      entries: patient.entries.concat(entry)
    });
  };

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
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ display: "inline" }}>{patient.name}</h2> {renderGenderIcon()}
        </div>
        <div style={{ marginBottom: "8px" }}>
          <span style={{ display: "inline-block", marginBottom: "2px" }}>
            ssn: {patient.ssn}<br/>occupation: {patient.occupation}
          </span>
          {errorMessage !== ''
            ? <div style={{ backgroundColor: "mistyrose", padding: "8px" }}>
              <span style={{ color: "maroon" }}>
                <InfoOutlined fontSize="small" style={{ verticalAlign: "middle" }} /> {errorMessage}
              </span>
            </div>
            : <></>
          }
        </div>
        <EntryForm
          patientId={patient.id}
          diagnosisCodes={diagnosisList.map((d) => d.code)}
          addEntry={addEntry}
          setFormError={setErrorMessage}
        />
        <EntriesSection entries={patient.entries} diagnoses={diagnosisList}/>
      </div>
      
    </div>
  );
};

export default PatientInformationPage;
