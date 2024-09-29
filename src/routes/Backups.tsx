import LocalBackups from "@components/Backup";
import GoogleBackups from "@components/GoogleBackups";

export default function BackupRoutes() {
  return (
    <>
      <GoogleBackups isPage showDetail />
      <LocalBackups />
    </>
  );
}
