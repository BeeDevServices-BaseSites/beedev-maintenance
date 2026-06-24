// utils/maintenanceTime.js
//
// Shared between the client-side maintenance banner (e.g. noveleshelf-client)
// and the maintenance-site project. Keep these two copies identical —
// if you change one, change the other the same way.
//
// Purpose: turn the UTC timestamps stored in pages.json into text formatted
// in the VISITOR'S OWN local timezone, and fill {{token}} placeholders in
// message/pre_message strings with that formatted text.

/**
 * Builds the token values used to fill in message templates.
 * All formatting uses the browser's own locale/timezone — nothing here
 * needs to know what timezone the admin who wrote the JSON was in.
 *
 * @param {object} entry - a single pages.json entry
 * @returns {{maint_date: string, maint_time: string, return_date: string, return_time: string}}
 */
export function getMaintenanceTokens(entry) {
  const tokens = {
    maint_date: '',
    maint_time: '',
    return_date: '',
    return_time: '',
  };

  if (entry.maint_at) {
    const maintDate = new Date(entry.maint_at);
    tokens.maint_date = maintDate.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    tokens.maint_time = maintDate.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  if (entry.estimated_return_at) {
    const returnDate = new Date(entry.estimated_return_at);
    tokens.return_date = returnDate.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    tokens.return_time = returnDate.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  return tokens;
}

/**
 * Replaces {{token}} placeholders in a template string with values from
 * getMaintenanceTokens(). Unknown tokens are left as-is rather than
 * silently dropped, so a typo in pages.json is easy to spot.
 *
 * @param {string} template - e.g. "Down on {{maint_date}} at {{maint_time}}"
 * @param {object} tokens - output of getMaintenanceTokens()
 * @returns {string}
 */
export function fillMaintenanceTemplate(template, tokens) {
  if (!template) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return key in tokens ? tokens[key] : match;
  });
}

/**
 * The always-auto-formatted "Estimated return" line shown on both the
 * banner and the maintenance page. Returns null if there's no
 * estimated_return_at set, so callers can skip rendering the line entirely.
 *
 * @param {object} entry
 * @returns {string|null} e.g. "Friday, June 26 at 4:00 PM"
 */
export function getEstimatedReturnDisplay(entry) {
  if (!entry.estimated_return_at) return null;
  const tokens = getMaintenanceTokens(entry);
  return `${tokens.return_date} at ${tokens.return_time}`;
}
