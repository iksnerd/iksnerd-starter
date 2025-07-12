interface FirebaseServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

/**
 * Converts a Firebase service account JSON object to a string format suitable for environment variables
 * @param serviceAccount - The Firebase service account object
 * @returns A JSON string that can be used in environment variables
 */
export function firebaseJsonToEnvString(
  serviceAccount: FirebaseServiceAccount,
): string {
  return JSON.stringify(serviceAccount);
}

/**
 * Converts a Firebase service account JSON file content to a string format suitable for environment variables
 * @param jsonContent - The content of the Firebase service account JSON file as a string
 * @returns A JSON string that can be used in environment variables
 */
export function firebaseJsonFileToEnvString(jsonContent: string): string {
  try {
    const serviceAccount = JSON.parse(jsonContent) as FirebaseServiceAccount;
    return firebaseJsonToEnvString(serviceAccount);
  } catch (error) {
    throw new Error(
      `Invalid JSON content: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Reads a Firebase service account JSON file and converts it to a string format suitable for environment variables
 * @param filePath - Path to the Firebase service account JSON file
 * @returns A promise that resolves to a JSON string that can be used in environment variables
 */
export async function firebaseJsonFilePathToEnvString(
  filePath: string,
): Promise<string> {
  try {
    const fs = await import("fs/promises");
    const jsonContent = await fs.readFile(filePath, "utf-8");
    return firebaseJsonFileToEnvString(jsonContent);
  } catch (error) {
    throw new Error(
      `Failed to read or parse file: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Formats the Firebase service account string for use in a .env file
 * @param serviceAccountString - The Firebase service account JSON string
 * @param variableName - The environment variable name (default: 'FIREBASE_SERVICE_ACCOUNT')
 * @returns A formatted string ready to be added to a .env file
 */
export function formatForEnvFile(
  serviceAccountString: string,
  variableName: string = "FIREBASE_SERVICE_ACCOUNT",
): string {
  return `${variableName}=${serviceAccountString}`;
}

/**
 * Complete utility to convert a Firebase service account JSON file to a .env file entry
 * @param filePath - Path to the Firebase service account JSON file
 * @param variableName - The environment variable name (default: 'FIREBASE_SERVICE_ACCOUNT')
 * @returns A promise that resolves to a formatted string ready to be added to a .env file
 */
export async function convertFirebaseJsonToEnvEntry(
  filePath: string,
  variableName: string = "FIREBASE_SERVICE_ACCOUNT",
): Promise<string> {
  const envString = await firebaseJsonFilePathToEnvString(filePath);
  return formatForEnvFile(envString, variableName);
}
