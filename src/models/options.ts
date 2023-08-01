import { ILocalStorage, LocalStorage } from "@src/chrome/localStorage";

export class Options implements OptionsInterface {
  themeMode: ThemeMode;
  themeColor: DefaultColorHexes;
  tooltipEnabled: boolean;
  bypassEnabled: boolean;
  xraysEnabled: boolean;
  autofillEnabled: boolean;

  private static STORAGE_KEY = "OPTIONS";

  static storage: ILocalStorage = new LocalStorage();
  static async getOptions(): Promise<OptionsInterface> {
    return (await this.storage.load(this.STORAGE_KEY)) as OptionsInterface;
  }
  static async setOptions(options: OptionsInterface | null): Promise<void> {
    await this.storage.save(this.STORAGE_KEY, options);
  }
}

export async function syncTimeWithGoogle() {
  const req = await fetch("https://www.google.com/generate_204");
  const date = req.headers.get("date");
  if (!date) throw new Error("updateFailure");

  const serverTime = new Date(date).getTime();
  const clientTime = new Date().getTime();
  const offset = Math.round((serverTime - clientTime) / 1000);

  if (Math.abs(offset) <= 300) {
    // within 5 minutes
    localStorage.offset = Math.round((serverTime - clientTime) / 1000);
    return "updateSuccess";
  }
  return "clock_too_far_off";
}
