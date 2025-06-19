export default function capitalizeFirstLetter(word?: string) {
  return (word?.[0]?.toUpperCase() || "") + (word?.slice(1) || "");
}
