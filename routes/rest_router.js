'use strict';

// TODO REMOVE THIS FILE IF UNUSED??

var express = require('express');

/**
 * Creates the 5 basic REST routes for a given controller. If custom routes are
 * needed on top of the basic routes, they can be attached to returnd router object.
 *
 * @param {Object} controller the controller that contains logic for a route
 * @return {express.Router} an instance of the express router with REST routes attached
 */
function restRouter(controller) {
  const router = express.Router(); // eslint-disable-line new-cap

  router.route('/')
    .get(controller.get)
    .post(controller.create);

  router.route('/:id')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.del);

  if (controller.middleware) {
    router.param('id', controller.middleware);
  }

  return router;
}
