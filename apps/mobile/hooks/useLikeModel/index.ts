export const handleLikeModel = (
  isAuthenticated: boolean,
  showModal: () => void,
) => {
  if (!isAuthenticated) {
    showModal();
    return;
  }
};

export const useLikeModel = () => {
  return {
    handleLikeModel,
  };
};
