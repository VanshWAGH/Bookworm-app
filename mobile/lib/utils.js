// /mobile/lib/utils.js
export const formatMemberSince = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
  });
};
