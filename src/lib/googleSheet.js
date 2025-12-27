
// const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL;

export async function getLessons() {
  const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL;
  try {
    const response = await fetch(GAS_URL, { 
      method: 'GET',
      
      headers: {
        'Accept': 'application/json',
      },
      // Cache trong 3600 giây (1 giờ)
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    
    console.error("Lỗi kết nối GAS:", error);
    return []; 
  }
}
