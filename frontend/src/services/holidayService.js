import axios from 'axios';

const HOLIDAY_API_BASE = "https://date.nager.at/api/v3";

/**
 * Récupère les jours fériés pour une année et un pays donnés
 * @param {string} countryCode - Code ISO du pays (ex: 'FR', 'MA', 'US')
 * @param {number} year - L'année souhaitée
 */
export const getHolidays = async (countryCode = 'FR', year = new Date().getFullYear()) => {
  try {
    const response = await axios.get(`${HOLIDAY_API_BASE}/PublicHolidays/${year}/${countryCode}`);
    return response.data; // Retourne un tableau d'objets { date, localName, name }
  } catch (error) {
    console.error("Erreur lors de la récupération des jours fériés:", error);
    // On retourne un tableau vide pour ne pas faire planter l'UI
    return [];
  }
};