import axios from 'axios';
import incito from 'incito';
import express from 'express';
import {json as jsonParser} from 'body-parser';

/**
 * Regular expression for validating JWTs
 */
export const JWT_REGEX = /^[\w-]+?\.[\w-]+?\.[\w-]+?$/;

/**
 * Creates a new express app that has a json body parser, creates a server
 * and creates an axios instance that is "bound" to that server. Returns all
 * three in an object.
 *
 * @return {Object}
 */
export function incitoAxios() {

  const app = express();

  app.use(jsonParser());

  const server = incito(app);
  const request = axios.create({
    baseURL: `http://localhost:${server.port}`,
  });

  return {app, server, request};

}
export default {
  JWT_REGEX,
  incitoAxios,
};
