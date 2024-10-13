import { ReadContractErrorType } from "viem";

export interface ResponseByContract<T> {
  data: T | null;
  error: ReadContractErrorType | null;
  isLoading: boolean;
  isError: boolean;
}
