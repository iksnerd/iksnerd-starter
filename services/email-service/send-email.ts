export const sendEmailWithApiRoute = async (firstName: string): Promise<{
  success: boolean;
  message: string;
} | null> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName
      })
    });
    
    const data = await response.json()
    
    return {
      success: true,
      message: data
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to send email' + error
    }
  }
}
