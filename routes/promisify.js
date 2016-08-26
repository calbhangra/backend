import _ from 'lodash';
import {NotFoundError} from '../lib/errors';

export default function(handler) {

  return function(req, res, next) {
    handler(req, res, next)
      .tap(data => { if (_.isNil(data)) throw new NotFoundError(); })
      .then(data => res.json(data))
      .catch(next);
  };

}
