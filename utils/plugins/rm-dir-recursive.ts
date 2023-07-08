import fs from "fs";
import path from "path";

export function rmDirRecursive(dir: string) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const fileDir = path.join(dir, file);
      if (fs.lstatSync(fileDir).isDirectory()) {
        rmDirRecursive(fileDir);
      } else {
        fs.unlinkSync(fileDir);
      }
    });
    fs.rmdirSync(dir);
  }
}

export function rmFile(file: string) {
  fs.unlinkSync(file);
}
