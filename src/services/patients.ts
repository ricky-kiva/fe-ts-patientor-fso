import axios from "axios";
import { Entry, NewEntry, Patient, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const getById = async (id: string) => {
  const { data } = await axios
    .get<Patient>(`${apiBaseUrl}/patients/${id}`);

  return data;
};

const addEntry = async (id: string, object: NewEntry) => {
  try {
    return await axios
      .post<Entry>(`${apiBaseUrl}/patients/${id}/entries`, object)
      .then(res => res.data);
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      const errorObject = e.response?.data?.error;

      if (Array.isArray(errorObject) && errorObject.length > 0) {
        const firstError = errorObject[0];

        if (firstError?.code && firstError?.path) {
          if (firstError.path.length > 0) {
            const errorMessage = `Value of ${firstError.path[0]} incorrect`;
            return firstError.received ? `${errorMessage}: ${firstError.received}` : errorMessage;
          }

          return "A field is in an invalid format";
        }
      }

      return "An unexpected HTTP error occured";
    }

    if (e instanceof Error) return e.message;
  }
};

export default {
  getAll, create, getById, addEntry
};
