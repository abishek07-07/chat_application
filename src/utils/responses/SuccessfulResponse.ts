export type IResult<T> = {
  success: boolean;
  message: string;
  data: T;
};

export function Results<T>(message: string, data: T): IResult<T> {
  return {
    success: true,
    message,
    data,
  };
}
