function jsonResponse(message = '', data = null) {
  return JSON.stringify({
    msg: message,
    data
  });
}

function validationResponse(errors) {
  return { errors };
}

module.exports = {
  jsonResponse,
  validationResponse
};
