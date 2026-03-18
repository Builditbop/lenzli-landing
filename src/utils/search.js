/**
 * Search utility functions for filtering users
 */

/**
 * Filter users by search query
 * @param {Array} users - Array of user objects
 * @param {string} searchQuery - Search query string
 * @returns {Array} Filtered users
 */
export const searchUsers = (users, searchQuery) => {
  if (!searchQuery || searchQuery.trim() === '') {
    return users;
  }

  const query = searchQuery.toLowerCase().trim();

  return users.filter(user => {
    // Search in display name
    if (user.displayName?.toLowerCase().includes(query)) {
      return true;
    }

    // Search in role
    if (user.role?.toLowerCase().includes(query)) {
      return true;
    }

    // Search in location
    if (user.location?.toLowerCase().includes(query)) {
      return true;
    }

    // Search in gear
    if (user.gear?.some(gear => gear.toLowerCase().includes(query))) {
      return true;
    }

    // Search in specialties
    if (user.specialties?.some(specialty => specialty.toLowerCase().includes(query))) {
      return true;
    }

    // Search in photography styles
    if (user.photographyStyles?.some(style => style.toLowerCase().includes(query))) {
      return true;
    }

    // Search in bio
    if (user.bio?.toLowerCase().includes(query)) {
      return true;
    }

    return false;
  });
};

/**
 * Apply filters to users
 * @param {Array} users - Array of user objects
 * @param {Object} filters - Filter object with properties:
 *   - roles: Array of role strings
 *   - gear: Array of gear strings
 *   - specialties: Array of specialty strings
 *   - skillLevel: String
 *   - availability: Boolean
 *   - verifiedOnly: Boolean
 *   - offersTraining: Boolean
 *   - trainingType: String ('all', 'online', 'in-person')
 *   - locationRadius: Number (not implemented - would need geolocation)
 * @returns {Array} Filtered users
 */
export const applyFilters = (users, filters) => {
  if (!filters || Object.keys(filters).length === 0) {
    return users;
  }

  return users.filter(user => {
    // Filter by roles
    if (filters.roles && filters.roles.length > 0) {
      if (!filters.roles.includes(user.role)) {
        return false;
      }
    }

    // Filter by gear (user must have at least one of the selected gear)
    if (filters.gear && filters.gear.length > 0) {
      const userGear = user.gear || [];
      const hasMatchingGear = filters.gear.some(gear => userGear.includes(gear));
      if (!hasMatchingGear) {
        return false;
      }
    }

    // Filter by specialties (user must have at least one of the selected specialties)
    if (filters.specialties && filters.specialties.length > 0) {
      const userSpecialties = user.specialties || [];
      const hasMatchingSpecialty = filters.specialties.some(specialty => userSpecialties.includes(specialty));
      if (!hasMatchingSpecialty) {
        return false;
      }
    }

    // Filter by skill level
    if (filters.skillLevel && filters.skillLevel.length > 0) {
      if (!filters.skillLevel.includes(user.skillLevel)) {
        return false;
      }
    }

    // Filter by availability
    if (filters.availability !== undefined && filters.availability !== null) {
      if (user.availability !== filters.availability) {
        return false;
      }
    }

    // Filter by Verified Status
    if (filters.verifiedOnly) {
      if (user.verificationStatus !== 'verified') {
        return false;
      }
    }

    // Filter by Mentorship/Training
    if (filters.offersTraining) {
      if (!user.offersTraining) {
        return false;
      }
      // Filter by Training Type (if specified and not 'all')
      if (filters.trainingType && filters.trainingType !== 'all') {
        if (user.trainingType !== filters.trainingType && user.trainingType !== 'both') {
          return false;
        }
      }
    }

    return true;
  });
};

/**
 * Check if filters are active
 * @param {Object} filters - Filter object
 * @returns {boolean} True if any filter is active
 */
export const hasActiveFilters = (filters) => {
  if (!filters) return false;

  return !!(
    (filters.roles && filters.roles.length > 0) ||
    (filters.gear && filters.gear.length > 0) ||
    (filters.specialties && filters.specialties.length > 0) ||
    (filters.skillLevel && filters.skillLevel.length > 0) ||
    (filters.availability !== undefined && filters.availability !== null) ||
    filters.verifiedOnly ||
    filters.offersTraining
  );
};

/**
 * Count active filters
 * @param {Object} filters - Filter object
 * @returns {number} Number of active filters
 */
export const countActiveFilters = (filters) => {
  if (!filters) return 0;

  let count = 0;
  if (filters.roles && filters.roles.length > 0) count++;
  if (filters.gear && filters.gear.length > 0) count++;
  if (filters.specialties && filters.specialties.length > 0) count++;
  if (filters.skillLevel && filters.skillLevel.length > 0) count++;
  if (filters.availability !== undefined && filters.availability !== null) count++;
  if (filters.verifiedOnly) count++;
  if (filters.offersTraining) count++;

  return count;
};

/**
 * Clear all filters
 * @returns {Object} Empty filter object
 */
export const clearFilters = () => {
  return {
    roles: [],
    gear: [],
    specialties: [],
    skillLevel: [],
    availability: null,
    verifiedOnly: false,
    offersTraining: false,
    trainingType: 'all'
  };
};

