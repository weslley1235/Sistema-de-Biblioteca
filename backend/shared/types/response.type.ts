type ErrorResponse<Metadata = unknown> = {
  message: string;
  metadata?: Metadata;
};

type SuccessReponse<SuccessValue> = {
  value: SuccessValue;
};

export type Response<Success, Error = unknown> = {
  isFail: boolean;
  error?: ErrorResponse<Error>;
  success?: SuccessReponse<Success>;
};
