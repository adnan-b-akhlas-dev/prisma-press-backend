const parseFields = (fields?: string) => {
  if (!fields) return null;

  const selects = fields
    .split(",")
    .filter(Boolean)
    .map((field) => {
      if (field.includes(".")) {
        // Build nested object from right to left
        // "profile.bio.avatar" → { profile: { select: { bio: { select: { avatar: true } } } } }
        const parts = field.split(".");
        return parts.reduceRight<Record<string, any>>((acc, part, index) => {
          if (index === parts.length - 1) {
            // Innermost field → true
            return { [part]: true };
          }
          // Wrap deeper level in { select: ... }
          return { [part]: { select: acc } };
        }, {});
      }

      return { [field]: true };
    });

  // Merge all field objects, deep-merging any shared relation keys
  const result = selects.reduce<Record<string, any>>((acc, curr) => {
    return deepMerge(acc, curr);
  }, {});

  return result;
};

/** Recursively merges two Prisma select objects */
function deepMerge(
  target: Record<string, any>,
  source: Record<string, any>,
): Record<string, any> {
  const output = { ...target };

  for (const key of Object.keys(source)) {
    const targetVal = target[key];
    const sourceVal = source[key];

    const targetIsSelect =
      typeof targetVal === "object" &&
      targetVal !== null &&
      "select" in targetVal;
    const sourceIsSelect =
      typeof sourceVal === "object" &&
      sourceVal !== null &&
      "select" in sourceVal;

    if (targetIsSelect && sourceIsSelect) {
      // Both are relation selects — merge their inner select objects
      output[key] = { select: deepMerge(targetVal.select, sourceVal.select) };
    } else {
      output[key] = sourceVal;
    }
  }

  return output;
}

export default parseFields;
