export const successResponse = (res, message, data = {}) => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message, error = null, status = 500) => {
  return res.status(status).json({
    success: false,
    message,
    error,
  });
};
