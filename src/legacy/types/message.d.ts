interface GetTotp {
  type: "getTotp";
  data: {
    text: string;
    fromPopup?: boolean;
  };
}
