export const getListAppdata = async (
  access_token: string
): Promise<{
  files: Appdata[];
  error?: {
    code: number;
    message: string;
  };
}> => {
  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.searchParams.append("spaces", "appDataFolder");
  url.searchParams.append("orderBy", "modifiedTime desc");
  url.searchParams.append("fields", "nextPageToken, files(id, size, name, modifiedTime, md5Checksum)");
  url.searchParams.append("pageSize", "500");

  const data = await fetch(url, { headers: { authorization: `Bearer ${access_token}` } });
  const json = await data.json();
  return json;
};

export const uploadAppdata = async (
  access_token: string,
  fileNane: string,
  fileContent: string
): Promise<UpdateAppdataResponse> => {
  const file = new Blob([fileContent], { type: "application/json" });
  const metadata = {
    name: fileNane, // Filename at Google Drive
    mimeType: "application/json", // mimeType at Google Drive
    parents: ["appDataFolder"], // Folder ID at Google Drive
  };

  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", file);

  const uploaded = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", {
    method: "POST",
    headers: new Headers({ authorization: "Bearer " + access_token }),
    body: form,
  });

  const json = await uploaded.json();
  return json;
};

export const deleteAppdata = async (access_token: string, fileId: string): Promise<boolean> => {
  const url = new URL(`https://www.googleapis.com/drive/v3/files/${fileId}`);
  const data = await fetch(url, {
    method: "DELETE",
    headers: { authorization: `Bearer ${access_token}` },
  });
  const isOk = data.ok;
  return isOk;
};

export const getAppdataContent = async (access_token: string, fileId: string) => {
  const url = new URL(`https://www.googleapis.com/drive/v3/files/${fileId}?spaces=appDataFolder&alt=media`);
  const data = await fetch(url, { headers: { authorization: `Bearer ${access_token}` } });
  const json = await data.json();
  return json;
};

interface UpdateAppdataResponse {
  id: string;
  error?: {
    code: number;
    message: string;
  };
}

export interface Appdata {
  md5Checksum: string;
  size: string;
  id: string;
  name: string;
  modifiedTime: string;
}
