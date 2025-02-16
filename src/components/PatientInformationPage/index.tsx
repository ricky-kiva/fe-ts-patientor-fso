import { useParams } from "react-router-dom";
import { assertNever, Gender, Patient } from "../../types";
import { Female, Male, Transgender } from "@mui/icons-material";
import { useEffect, useState } from "react";
import patients from "../../services/patients";

const PatientInformationPage = () => {
  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      const fetchedPatient = await patients.getById(id);
      setPatient(fetchedPatient);
    };

    fetchPatient();
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
        <h2 style={{ display: "inline" }}>{patient.name}</h2> {renderGenderIcon()}
      </div>
      <p>ssn: {patient.ssn}
        <br/>occupation: {patient.occupation}
      </p>
    </div>
  );
};

export default PatientInformationPage;
