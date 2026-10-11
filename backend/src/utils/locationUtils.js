/**
 * Calculate Haversine distance in kilometers between two geographic points (lat1, lon1) and (lat2, lon2)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    return null;
  }

  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Filter items by max radius distance (in km)
 */
export const filterByRadius = (items, userLat, userLon, maxRadiusKm = 50) => {
  if (!userLat || !userLon) return items;

  return items
    .map((item) => {
      const dist = calculateDistance(userLat, userLon, item.latitude, item.longitude);
      return { ...item, distanceKm: dist };
    })
    .filter((item) => item.distanceKm === null || item.distanceKm <= maxRadiusKm)
    .sort((a, b) => (a.distanceKm || 99999) - (b.distanceKm || 99999));
};
