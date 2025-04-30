import {
  initializeApp,
  getApps,
  cert,
  ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// TODO add service account to env
// const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT as string;
// const stringConfig = `{
//   "type": "service_account",
//   "project_id": "fit-sync-d9e58",
//   "private_key_id": "82861ce5951b632049891684906bbed8e5950d38",
//   "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQ1ThNwDUSZo5e\\ntOWmJAhT5rlSCzZq5UVsHkArI0d0eHyad4pasS7jHNs7GuhE/kfSZ0XWeBuXbqbN\\ns/ha/tr9WTN1Q90N8ek+4T4wJCweJV1cisO0DGJXc8HUbLqKS/7xQvMwBwVzgoSR\\nIUiQVIyGy0pEp/73V9+ym0aWkofB0aRevocKmd5hltepgSosaN6onqI9gvXLDLWO\\nu/Ge4Zzr5xTeULOEOlocuYx5APJlrQjl5yOx9N9rt/sQx1cRxN/ESexz3iuF+Mpq\\nctyKzygGC9d9xWxa+cEsUvY6/6TXAYA9wY+r/5T1eT4EXkhqCjszEfDIvLCnsxs1\\nJBzJD3QjAgMBAAECggEACA9qvGmCQuMNdK9Tu81hOufJWFbRc1/FBa7HOEME04SA\\n/q9FekmjbyWieo4Hz/3mhMLyqZv6KKafLopXOB/lEOk7+Lc1VX/0SjaEYXRL9Z/o\\nkhVTB2SA+TIhFZNawdK8FNDKNRzYQ4SSnE1mERgKUnuPMsYvK5nLKwgeOdqO/daJ\\nNCUCA5NS8qjb5i75E6dvhSuckqNi1l6IXo+mHrPXVjXBEyPSxW4x2i3X3G8itB4d\\nTnmSKnSlrfAcGmxSpnl5ZNnt3xIMMx0MiG3j1Lx9nnourvT+QRiaOpKzQ3zZyp2d\\nOT+gzRj3F/eJhPwqgRNVrAE+ws0K5vmRMBhMtCwawQKBgQD500BOGP671VedLrPw\\nEoU34tiAHfwlCafWrGjY34xTpSE/zrKTO571O0n9LG2dVaL79lUT3ZrTucT715/A\\nkA5kS4Jrl0wbV0yuhFhBHskPB+QyMBVXmpOpHoQhdjNQ0rsRRpWAXS8ju/nEGeQn\\ncsg3RF0JwOHdfdV4aAAJjePVYwKBgQDV/pfcr6/URE8pkvPCkHNYlJMZ2X8TX6R0\\nTg5pBMOlrBIP301fdgBRdj00sR+w1KZe2lRpzHoDVkcyLVIwKFXlDA02K/mEzj+m\\n9TD/c3sBQ2ZTkNHpuuXIYyGvQMN+uptcgmVJYIyDjLn5e8ovAk48eNxle42In6wh\\nPdW2LN6CQQKBgFe7hz6l6nc+MbmCWDB74IrCwDMl1JGRNX7fJybaQqZxPB7zUKUB\\n8A3A13fwbUIue8EuPaxvS1sFRxcGHxT5wgQYvGFaTaDgZI547aFY1VTQ+aNiXWxZ\\nXXervs0dfGHqz0T+26urjc1nywvB5+yuk39NI7s0IF2vPhM9up2gVZ1vAoGBALXP\\nGDbnDPvLDXbE41TqZRVdJZ1QrCZJm+80YgnXgmG/T5ksnw/7sUmEq3uZANO7152+\\n4PkCQKeVJef7mVhQ7KktFAxyUAwFLw8qQfbGpjrsiIN3BuENaSxXDMdYvr9sy5JN\\nNsCgxsD9TwQnqB9IVjAKfzW5QwZQom2bm3arqGABAoGAbfadfkktrMgw1ZTtEANB\\ncASGHWDx+obwdelC3Wallea4qX6VSVl2HOxwL+nb+Y5KPIOImBVzL3MROGPNRr+E\\n16p9XTGDV2BuWU6EwLQXmOCci7VoK7zo4+uPea/XU4o9P2Xl3PX8PC6fO0T/JR2Z\\n5XWBqjUYMtvBjLkT+WwXcss=\\n-----END PRIVATE KEY-----\\n",
//   "client_email": "firebase-adminsdk-trl30@fit-sync-d9e58.iam.gserviceaccount.com",
//   "client_id": "113238172307435423146",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-trl30%40fit-sync-d9e58.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
// }`;

// TODO load from env
// const stringConfig = `{
//   "type": "service_account",
//   "project_id": "iksnerd-starter",
//   "private_key_id": "1f604412aa60e8d25fee1c40bf5d635bb631e9b0",
//   "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCws28ae4piXDGb\\nrD4c3d+cdGVNdi+KKYx5ksujore2KJ7JoUgGVfxw8nr011i+WwrqkJxCL05lUdsb\\nWbzByjzqwekQo2R+cwMRxUOVh86I7aN7fScAgxGpwqgc60ughXFmiBLwUijrtxRw\\ndtVjBFo1TyQn4fBPXZ7oU1ASx7pcaFqMP+T+FS01WKEcGgTCvXFX7yWCk8MORCbs\\nMJAtFuON+7+5i0uQso7eFCW0lVNSR4OOvfYnMl6oLN3LjZlbc8YsIWOAjHxZ1TBs\\n+R5S3olY09pjfLjblMoAyKBgIjGgQWR3M07X6vMBsxu6JCeF0njRyJN/PV6yTm1J\\nrcFy+tm9AgMBAAECggEAAPzLuOfqVtDhlRdiFHq38nGjFEr+CoVfa9mCalRxNuMk\\nugc89g4adk4gmkguzoeHONbcjLEjfMT3lsBKYgHdk8lIImfrWpqNcJa74TTMVm8P\\njBPfuSzCV0LHejvlZQ0B3HsTsgSfhmu0QUmkuSQv1d7umot0cpkZF37JsoUruTL4\\ntZe/s6ETowA9AuUymSWeaPIx6ziD02Vm0AvdaVMIvzL2ADk7yFU9LU5smMUS5N61\\nmq284ym5ph33qPDGauHX72ZIvBBOSVRISX739MCJE0w2bIgMoFzyXmHobkudpL+i\\n7i9kxWrFoY7/CBtsIpIgQEx5wBFxNnBp+ZLSsxt2+QKBgQDofkdjojgajvllSqar\\nY2uwUbcFc+aFRqRAAPBLUElqgBD8dEQRqtdByLhrVSFOxdgNyEZ6V3KqUUv9jcZ3\\nxhysStnFpuWOLX7ktwBqslmdf38F/gZizW/IXPsY+aPE1/F8aIWXWDTwvcFekOlP\\nCtAE7ej2sVXliufC0PcC8HKBeQKBgQDCkQ7Xawvko1BfMqMPCj332TyWl7jqqe8X\\nAorqCb/3wWidDCXYhNvRgfp2nH6QCJsqA7zPlU5AmCbBM4NuAuWlJ+XXRcpVWj8l\\n8kEUR+4QIzi3N99r9aEWYQgy211w5XkyGUlE/8SnV5n0TtT5r8ZKWop6WWPelp/e\\nB572egetZQKBgEG8Qq8XFMndlwJewxU+fRpTYG44QPt558L5APgqcTedki/vJ7ff\\nGBHPkOU4IrzFD7uF3veEdjVV2yiLx4viBgVo/H34HHvAvVoprAJ+/vubKu0kz+Vr\\ntKlwMMb0/qsPa4YDf5I1LHLNFDmKu4zPv9VE91OY/HJ0fecFcnHwTk/xAoGANj77\\nRFQ0HKrr3Z7gl3DjlhabLeFfTQ3T+zZaRKYzP4BNCnw4kQV5xA/ZJPi80KuVl0Ez\\ngyy9hITnSTZzjliAbmuRSVPL9cATmyDPxDfJx/YJ+gs533+8SeEDyCohAzj3cWBb\\nbUFiMsXZxqOz/Wlkf5Z+xV3m2khkiiLVzyJ2wYECgYA+ghovKRrefifuzFDf9dUV\\nxtHBhBDgt6F4OC2cIFIsMoUq+NzyrQnx98ZeqMwj0XbR1zrbmfa1KAGQRga0TemC\\nPqlEtqUnY7C7YCDGKfNmcHd2HL0T9NOQFvQSx2s5RMyEGOHzCCc/LuoD7RvVmM1x\\nCGTLhSea8+CSRsa4QE6Fiw==\\n-----END PRIVATE KEY-----\\n",
//   "client_email": "firebase-adminsdk-fbsvc@iksnerd-starter.iam.gserviceaccount.com",
//   "client_id": "107901377300164723980",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40iksnerd-starter.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
// }`;

const stringConfig = process.env.FIREBASE_SERVICE_ACCOUNT as string;
const serviceAccount = JSON.stringify(JSON.parse(stringConfig));

let app = getApps().find((app) => app.name === "admin");

if (!app) {
  app = initializeApp(
    {
      credential: cert(JSON.parse(serviceAccount) as ServiceAccount),
    },
    "admin",
  );
}

export const firestoreAdmin = getFirestore(app);
