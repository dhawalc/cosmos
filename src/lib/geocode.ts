export async function geocode(place: string) {
  // Mock geocoding
  console.log("Mock geocoding place:", place);
  return { lat: 28.6139, lon: 77.2090, timezone: "Asia/Kolkata" };
}
