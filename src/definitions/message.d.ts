type GetDataType<T extends Message["type"]> = Exclude<
  Extract<
    Message,
    {
      type: T;
      data?: unknown;
    }
  >["data"],
  undefined
>;

interface GetCapture {
  type: "getCapture";
  data: {
    url?: string;
    captureBoxLeft: number;
    captureBoxTop: number;
    captureBoxWidth: number;
    captureBoxHeight: number;
  };
}

interface GetTotp {
  type: "getTotp";
  data: {
    text: string;
    fromPopup?: boolean;
  };
}
