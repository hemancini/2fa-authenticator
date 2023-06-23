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

export function sendMessageToBackground<M extends Message>({
  message,
  handleSuccess,
}: {
  message: M;
  handleSuccess?: (data: GetDataType<M["type"]>) => void;
}) {
  const port = chrome.runtime.connect();
  port.onMessage.addListener((responseMessage: M) => {
    handleSuccess?.(responseMessage.data as GetDataType<M["type"]>);
  });
  port.onDisconnect.addListener(() => {
    console.log("Port disconnected");
  });
  try {
    port.postMessage(message);
  } catch (error) {
    console.log(error);
  }
}

export function sendMessageToClient(
  port: chrome.runtime.Port,
  message: { type: Message["type"]; data: Message["data"] }
) {
  try {
    port.postMessage(message);
  } catch (error) {
    console.warn(error);
  }
}
