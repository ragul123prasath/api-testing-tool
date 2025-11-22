export function replaceVariables(text, vars) {
  if (!text) return text;

  let result = text;

  Object.entries(vars).forEach(([key, value]) => {
    const pattern = new RegExp(`{{${key}}}`, "g");
    result = result.replace(pattern, value);
  });

  return result;
}
