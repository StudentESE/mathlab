'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (m1, m2) {
  switch (m1.constructor.name) {
    case 'Complex':
      return cleq(m1, m2);
    case 'Sparse':
      return sleq(m1, m2);
    default:
      return leq(m1, m2);
  }
};

var _pointwise = require('./pointwise');

var _pointwise2 = _interopRequireDefault(_pointwise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var leq = (0, _pointwise2.default)(function (x, y) {
  return x <= y;
});

function cleq(x, y) {
  throw new Error('mathlab.leq: no leq for complex number');
}

function sleq(x, y) {
  throw new Error('mathlab.leq: leq for sparse matrix has not been implemented yet');
}

/**
 * Pointwise leq
 * 
 * @export
 * @param {Number|Array} m1
 * @param {Number|Array} m2
 * @returns {Number|Array}
 * @example 
 * 
 * leq(1, 2)
 * // returns 1 <= 2
 * leq([1, 2], [2, 2])
 * // returns [1 <= 2, 2 <= 2]
 * leq([[2,1], [1,2]], [[2, 2], [2, 2]]))
 * // returns [ [2 <= 2, 1 <= 2], [1 <= 2, 2 <= 2] ]
 */