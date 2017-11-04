'use strict'
module.exports = function (app) {
  let controller = require('./controller')

  // controller Routes
  app.route('/sessions')
    .get(controller.getSessions)

  app.route('/selectors')
    .get(controller.getSelectors)
  app.route('/getperiodsforsession/:sessionId')
    .get(controller.getPeriodsForSession)
  app.route('/getmytrades/:sessionId')
    .get(controller.getTradesForSession)
  //.post(controller.create_a_task);


  /*app.route('/tasks/:taskId')
    .get(controller.read_a_task)
    .put(controller.update_a_task)
    .delete(controller.delete_a_task);
    */
}