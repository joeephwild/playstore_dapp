import axios from "axios";
import * as FileSystem from "expo-file-system";

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwOTM0ZjI0Zi00NTE0LTRlMjgtYmMwMS1lMmNkYzI3YWMyNWUiLCJlbWFpbCI6Impvc2VwaG9tb3RhZGU0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhZWRmYTM1ZjMzZDU0OGI2YWRjNCIsInNjb3BlZEtleVNlY3JldCI6IjY1ZTcxMWYzOTkzNzE5MzAzMmY2OThjMThlZTMyOTYxODZjOTdlNWRhZWNhOTAzZTU5ZGE3ZjJiNmFkYWFkOGQiLCJpYXQiOjE3MDk1ODcwODV9.uqxdRpF0WM5Hc3Tb40_D8o1UpywWASm5AVox62I_Krg";

export const handleUpload = async (fileUri, fileName) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: fileName,
      type: fileInfo.mimeType,
    });
    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name: "File name",
      })
    );
    formData.append(
      "pinataOptions",
      JSON.stringify({
        cidVersion: 0,
      })
    );

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWT}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );

    const resData = await response.json();
    return resData;
  } catch (error) {
    console.error(error);
    return { error: "Upload failed" };
  }
};

export const uploadJson = async (metadata: any) => {
  // Specify the type of metadata if known
  try {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pinataContent: metadata, // Assuming you want to send metadata as pinataContent
        pinataMetadata: { name: "pinnie.json" },
        pinataOptions: { cidVersion: 1 },
      }),
    };

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      options
    );
    const resData = await response.json();
    return resData;
  } catch (error) {
    console.error("Error uploading image to Pinata:", error.message);
    throw error;
  }
};

//https://harlequin-giant-gazelle-464.mypinata.cloud

/**
 * API Key: aedfa35f33d548b6adc4
 API Secret: 65e711f39937193032f698c18ee3296186c97e5daeca903e59da7f2b6adaad8d
 JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwOTM0ZjI0Zi00NTE0LTRlMjgtYmMwMS1lMmNkYzI3YWMyNWUiLCJlbWFpbCI6Impvc2VwaG9tb3RhZGU0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhZWRmYTM1ZjMzZDU0OGI2YWRjNCIsInNjb3BlZEtleVNlY3JldCI6IjY1ZTcxMWYzOTkzNzE5MzAzMmY2OThjMThlZTMyOTYxODZjOTdlNWRhZWNhOTAzZTU5ZGE3ZjJiNmFkYWFkOGQiLCJpYXQiOjE3MDk1ODcwODV9.uqxdRpF0WM5Hc3Tb40_D8o1UpywWASm5AVox62I_Krg
 */
