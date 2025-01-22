// composables/useApi.ts

export default async function useApi(
  endpoint: string,
  {
    method,
    body,
    auth = true,
  }: {
    method: "GET" | "POST" | "DELETE" | "PUT";
    body?: { [key: string]: string };
    auth?: boolean;
  }
) {
  const config = useRuntimeConfig().public;

  try {
    const response = await fetch(`${config.apiTrackingBaseUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(auth && {
          Authorization: `Bearer ${useCookie("api_tracking_jwt").value}`,
        }),
      },
      ...(body && {
        body: JSON.stringify(body),
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la requête API :", error);
    throw error;
  }
}