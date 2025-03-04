import { Favorite, LocalHospital, MedicalServices, Work } from "@mui/icons-material";
import { assertNever, Diagnosis, Entry } from "../../types";

interface Props {
  entries: Entry[],
  diagnoses: Diagnosis[]
}

const EntriesSection = (props: Props) => {
  const getHealthRatingColor = (rating: number): string => {
    switch (rating) {
      case 0:
        return "green";
      case 1:
        return "yellow";
      case 2:
        return "orange";
      case 3:
        return "red";
      default:
        return "inherit";
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

  return <div>
    <h3>entries</h3>
    {props.entries.map(entry => 
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
              const diagnosis = props.diagnoses.find(dn => dn.code === d);
              return <li key={d}>{d} {diagnosis?.name}</li>;
            })}
          </ul>
          : <></>
        }
      </div>
    )}
  </div>;
};

export default EntriesSection;
