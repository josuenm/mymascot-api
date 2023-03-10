import { google } from "googleapis";
import stream from "stream";

const GOOGLE_API_FOLDER_ID = "1e94Ch1uk3ZkWybR0n8CuYCiUjarDQoAN";

export async function uploadFile(file: Express.Multer.File) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
      },
      scopes: "https://www.googleapis.com/auth/drive",
    });

    const driveService = google.drive({
      version: "v3",
      auth,
    });

    const requestBody = {
      name: file.originalname,
      parents: [GOOGLE_API_FOLDER_ID],
    };

    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const media = {
      mimeType: file.mimetype,
      body: bufferStream,
    };

    const { data } = await driveService.files.create({
      requestBody,
      media,
      fields: "id",
    });

    return data.id;
  } catch (err) {
    return { error: "Internal server error" };
  }
}

export async function deleteFile(id: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
      },
      scopes: "https://www.googleapis.com/auth/drive",
    });

    const driveService = google.drive({
      version: "v3",
      auth,
    });

    await driveService.files.delete({
      fileId: id,
      fields: "id",
    });

    return true;
  } catch (err) {
    return { error: "Internal server error" };
  }
}
