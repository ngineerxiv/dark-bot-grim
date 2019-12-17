import uuid = require('uuid/v4');

export function applyCacheBuster(
  u: string,
  queryString: string = null,
): string {
  const b = uuid();
  if (queryString === null) {
    return `${u}?cb=${b}`;
  }
  return `${u}${queryString}cb=${b}`;
}
