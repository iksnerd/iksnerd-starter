import {
  firebaseJsonFileToEnvString,
  formatForEnvFile,
} from "./utils/firebase-json-to-env.js";

// Test with the JSON from your scratch file
const testJson = `{
  "type": "service_account",
  "project_id": "leads-agent-3b92e",
  "private_key_id": "7fb9cfac7b2d6b1e62e48e8cd6c3dc502805c954",
  "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDLkfCW96xebfyR\\nZhHG2xgYkLl+IIfAJ1DQeImi7/Jl+r5VdqoFLt4pV/Jw88nk0x8OeVT13cONxSRr\\nejUQvIvHiOJeg0AbJhHsiTk86P8uodYuCZZ/A+s4LF2evYVyX3s22S3xPsdJh+4d\\nveDYlYApn2sS1A5L1AZqnZo2aCHbzMTzFr4e4uiLF/zns7dM0QcNW0dWzugoJdu+\\nDNrD5hof+tyfYB5M5zmtvMtuxgJFqwd3gsH6yhrwDGTj1OxhkAUwVCX+oNcNGWbw\\ng5x1bArbX4zswzbDN8oivKruZf1QM3gVK8TSUJEyO3RyGdhtTDxIficxpwR6BiJr\\nlavtMdw/AgMBAAECggEAE8DWOa/6zTGa/840Yg7B0yW9T3HUpQlWRtm2HADF4q4R\\naLWaYI+1sF6qVdoyIxQhaq7MrGGX0i/pDXd5orrI+CmziDxFgjI61wWnGjP5tGAG\\nf8fKZLTP+aQZyYeBECIXu1tuS9SC/gLvUM+AppjggNQeowsUqrhTjxDlSpY8LYRl\\ngGXKpMkqhxhHUkqS9BOvTV0lx3/fsMiQ6shVPaKv2m3MwjWRn5AESkP1PTa3z1RQ\\n8OYr896qB7yfFH70xzqDdwjSCidZpWYrgaHr/G5uRIymKuqP1orcdNujp8qaDgYT\\niLNU9jc69YrGojNa5irOXHaw6X65o9l8YvNpUvHjcQKBgQDvTvqAjTRIFlyXV5EI\\nBKJK82zgdtcUVT20xT+Y4g+r+zHow6bWEmvlDB02GGIc9buXoEnWYJfCIGyj5jYo\\n3cmmXN2YQVaFtWqR0FpnqbofGwuSQW5ayAc+nLgooralVn0rvcIvPBh5zW4u8uCi\\n+GzliYXvDIp7H5RO6ZkWGMtxewKBgQDZxNOTvzSnDCRQOzoQPtFJK0bdamGm+rIx\\n1x/cfhYwbUlEXph3jPCrMl+K/ByTMEModWIAKG+RC6+wafy//dvkjBCOUUSwo1gq\\nZTWRExeNU04nSkkgv1CFhfXIEYS0nny5ME14+D9lwQ1MRjjDEZ0Oedkqvuc4ES/8\\nLOTggNV7DQKBgQDLX8NkHJyh5t8pfzGyLr3+FIIjANwoW4jlZ/x0YSoQbporxpqy\\ns1Uegv0QTAiVtACJC5+0oMJYKFYrtCmy8Um+KI3qJxzw5Qx8fyVVk9ipNsLOuOyg\\nGf6OJ4Iahq3SNX6K/elZWykx2nQZUi+2UIm7SPSaA35sxJm1trBzJv8+oQKBgQCb\\n4mJV89w769wetpbUxDLKPrlmi91FS1W9ibHcA0Hc/o4g69oWUgSBd/ieo+PMlRKt\\n5oD1ffyHBqeIEAaGZLFAg+biCVizXOoixvo2VEVavBRI2ctJLsn0GrWatreZF45O\\nfj4m5wVy0GO1gtrlADm+AAktqSQYpW0FBhn8fxzSDQKBgGc4EytrACnYl/WowRhM\\nktr1VZvfFXIqxhu0qbKncXcEf8V5a22bvHl4iWn6Mdpaf4P2fTs4P57V+W6RhWFv\\nbCw7GFCkeAFBBg/bKD2c5MNwM6bobMLUpjsISvkpJJhW1P5dZ3QiX0O9YV10ZQJd\\niFguk/+j/x/jaoN2wn5EpQh9\\n-----END PRIVATE KEY-----\\n",
  "client_email": "firebase-adminsdk-fbsvc@leads-agent-3b92e.iam.gserviceaccount.com",
  "client_id": "107728845932152335675",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40leads-agent-3b92e.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
`;

try {
  const envString = firebaseJsonFileToEnvString(testJson);
  const envEntry = formatForEnvFile(envString);
  console.log("Generated .env entry:");
  console.log(envEntry);
} catch (error) {
  console.error("Error:", error.message);
}
