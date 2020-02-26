import { v4 } from 'uuid';

export function applyCacheBuster(
  u: string,
  queryString: string = null,
): string {
  const b = v4();
  if (queryString === null) {
    return `${u}?cb=${b}`;
  }
  return `${u}${queryString}cb=${b}`;
}
