export default function(handler) {
  return function(req, res, next) {
    handler(req, res, next)
      .then(data => res.json(data))
      .catch(next);
  };
}
