// eslint-disable-next-line
export enum Status {
  error = "error",
  idle = "idle",
  loading = "loading",
  ready = "ready",
}

export type StatusState = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  status: Status;
};
