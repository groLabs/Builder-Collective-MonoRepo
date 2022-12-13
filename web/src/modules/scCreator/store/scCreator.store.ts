import { Status, StatusState } from "../../app/app.types";

export type Participant = {
  address: string;
  name: string;
  token: string;
  amount: string;
  price: string;
  value: string;
};

export type ScCreatorState = {
  name: string;
  users: { address: string; name: string }[];
  tokens: { token: string; price?: number }[];
  cliff?: string;
  end?: string;
  participants: Participant[];
  generator: string
  tokenDecimals: {
    [key: string]: number
  }
} & StatusState;

export const initialScCreatorState: ScCreatorState = {
  name: "",
  error: undefined,
  tokens: [],
  users: [],
  status: Status.idle,
  cliff: undefined,
  end: undefined,
  participants: [],
  generator: '',
  tokenDecimals: {}
};
