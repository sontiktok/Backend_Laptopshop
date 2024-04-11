const Res = (res, statusCode, success, data = null, message = "") => {
  const response = {
    success: success,
    message: message,
  };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};
module.exports = Res;
