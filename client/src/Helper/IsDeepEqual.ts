// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function IsDeepEqual(a: any, b: any): boolean {
  if (!a || !b) {
    return a === b;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a !== "object" && typeof b !== "object") {
    return String(a) === String(b);
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    if (String(a) !== String(b)) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!IsDeepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  } else {
    Object.keys(a).forEach((key) => {
      if (!IsDeepEqual(a[key], b[key])) {
        return false;
      }
    });
  }
  return true;
}
