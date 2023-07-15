import { ILocalStorage, LocalStorage } from "@src/chrome/localStorage";

export class Options implements OptionsInterface {
  themeMode: ThemeMode;
  themeColor: DefaultColorHexes;
  tooltipEnabled: boolean;
  bypassEnabled: boolean;
  xraysEnabled: boolean;

  private static STORAGE_KEY = "OPTIONS";

  static storage: ILocalStorage = new LocalStorage();
  static async getOptions(): Promise<OptionsInterface> {
    return (await this.storage.load(this.STORAGE_KEY)) as OptionsInterface;
  }
  static async setOptions(options: OptionsInterface | null): Promise<void> {
    await this.storage.save(this.STORAGE_KEY, options);
  }
}
