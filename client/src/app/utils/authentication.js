import axios from "axios";

export async function getJWT(user) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
      {
        user: user,
      }
    );

    if (response.status === 200) {
      return response.data.token;
    } else {
      throw new Error("Failed to obtain JWT");
    }
  } catch (error) {
    console.error("Error obtaining JWT:", error);
    throw error;
  }
}
