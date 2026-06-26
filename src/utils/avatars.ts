export const getDefaultAvatar = (name: string) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23022448'/%3E%3Ctext x='50' y='60' text-anchor='middle' font-size='40' fill='white' font-weight='bold'%3E${initials}%3C/text%3E%3C/svg%3E`;
};
