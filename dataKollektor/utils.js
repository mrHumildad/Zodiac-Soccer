export function num2mk(number) {
  // Check if the number is greater than or equal to 1 million
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    // Check if the number is greater than or equal to 1 thousand
    return (number / 1000).toFixed(0) + "k";
  } else {
    // If the number is less than 1 thousand, return it as is
    return number.toString();
  };
};

export function getFlagEmoji(countryId)  {
  return `https://images.fotmob.com/image_resources/logo/teamlogo/${countryId}.png`
}

export function getTeamLogo(clubId)  {
  return `https://images.fotmob.com/image_resources/logo/teamlogo/${clubId}.png`
}

export function getPortrait(id)  {
  return `https://images.fotmob.com/image_resources/playerimages/${id}.png`
}

export const rating2goals = (rating) => {
  if (rating < 66) return 0;
  return Math.floor((rating - 66) / 6) + 1;
};
export const getShortName = (name) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : name;
};