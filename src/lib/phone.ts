/** true for a valid Indian mobile number: 10 digits starting 6–9, with an optional +91 / 91 / 0 prefix */
export function isIndianMobile(input: string) {
  const digits = input.replace(/\D/g, "").replace(/^(?:91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits);
}
