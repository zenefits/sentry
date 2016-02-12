export function logException(ex, context) {
  Raven.captureException(ex, {
    extra: context
  });
  /*eslint no-console:0*/
  window.console && console.error && console.error(ex);
}

export function logAjaxError(error, context) {
  let errorString = (error.responseJSON ?
    error.responseJSON.detail || error.responseJSON.toString() :
    error.responseText.substr(0, 255));
  let message = `HTTP ${error.status}: ${errorString}`;
  Raven.captureMessage(message, {
    extra: context
  });
  /*eslint no-console:0*/
  window.console && console.error && console.error(message);
}
