import { Options } from "@src/models/options";
import { createContext, ReactNode, useMemo, useState } from "react";

const OptionsContext = createContext({
  toggleTooltipEnabled: () => void 0,
  toggleBypassEnabled: () => void 0,
  toggleAutofillEnabled: () => void 0,
  tooltipEnabled: true,
  bypassEnabled: false,
  xraysEnabled: false,
  autofillEnabled: false,
});

export function OptionsProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<Options>(undefined);

  const handlerOptions = useMemo(
    () => ({
      toggleTooltipEnabled: () => {
        setOptions((prevOptions: React.SetStateAction<any>) => ({
          ...prevOptions,
          tooltipEnabled: !prevOptions?.tooltipEnabled,
        }));
      },
      toggleBypassEnabled: () => {
        setOptions((prevOptions: React.SetStateAction<any>) => ({
          ...prevOptions,
          bypassEnabled: !prevOptions?.bypassEnabled,
        }));
      },
      toggleAutofillEnabled: () => {
        setOptions((prevOptions: React.SetStateAction<any>) => ({
          ...prevOptions,
          autofillEnabled: !prevOptions?.autofillEnabled,
        }));
      },
    }),
    []
  );

  return (
    <OptionsContext.Provider
      value={{
        ...handlerOptions,
        xraysEnabled: options?.xraysEnabled,
        bypassEnabled: options?.bypassEnabled,
        tooltipEnabled: options?.tooltipEnabled,
        autofillEnabled: options?.autofillEnabled,
      }}
    >
      {children}
    </OptionsContext.Provider>
  );
}

export default OptionsContext;
