import { describe, expect, it } from 'vitest';
import isMorphoPath from '../isMorphoPath';

describe('is morpho file helper', () => {
  it('should return true if file name contains "lite" in the extension', () => {
    const path = 'component.lite.tsx';

    const result = isMorphoPath(path);

    expect(result).toBe(true);
  });
  it('should return true if file name doesn\'t contain "lite" in the extension', () => {
    const path = 'component.tsx';

    const result = isMorphoPath(path);

    expect(result).toBe(false);
  });

  it('should return false if file name contains "lite" in the filename itself', () => {
    const path = 'lite.anything.tsx';

    const result = isMorphoPath(path);

    expect(result).toBe(false);
  });
});
