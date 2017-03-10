'use strict'; // eslint-disable-line strict

require('../../models');
require('../../lib/db').default.sync({force: true});
