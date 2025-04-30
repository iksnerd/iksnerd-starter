export interface HygraphQueryClientService {
  <T>(query: string): Promise<T | null>;
}
const hygraphClient: HygraphQueryClientService = async <T>(query: string): Promise<T | null> => {
  try {
    const response = await fetch(process.env.HYGRAPH_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    
    const json = await response.json()
    if (!json) {
      return null
    }
    
    console.log('CMS response:', json);
    
    return json
  } catch (error) {
    console.error(error);
    return null
  }
}

export { hygraphClient };
