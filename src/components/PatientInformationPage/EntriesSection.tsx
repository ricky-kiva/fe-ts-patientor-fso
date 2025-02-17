import { Favorite, LocalHospital, MedicalServices, Work } from "@mui/icons-material";
import { assertNever, Diagnosis, Entry, HealthCheckRating } from "../../types";

interface Props {
  entries: Entry[],
  diagnoses: Diagnosis[]
}

const EntriesSection = (props: Props) => {
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
