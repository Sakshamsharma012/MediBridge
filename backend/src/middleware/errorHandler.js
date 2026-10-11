export const errorHandler = (err, req, res, next) => {
  console.error('🔥 Server Error:', err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.status || 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: null,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
