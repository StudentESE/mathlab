import dim from './dim'
import add from './add'
import sub from './sub'
import Complex from './Complex'

/**
 * 
 * 
 * @export
 * @param {Array | Number} x
 * @param {Array | Number} y
 * @returns {Array | Number}
 * @example
 * 
 * dot([[1, 1], [2, 1]], [1, 2])
 * // [3, 4]
 * 
 * dot([1, 2], 4)
 * // [4, 8]
 */
export default function (x, y) {
  switch (x.constructor.name) {
    case 'Complex':
      return cdot(x, y);
    case 'Sparse':
      return sdot(x, y);
    default:
      return dot(x, y);
  }
}

function cdot(x, y) {
  if (!(y instanceof Complex)) { y = new Complex(y); }
    if (x.im) {
      if (y.im) {
        return new Complex(sub(dot(x.re, y.re), dot(x.im, y.im)), add(dot(x.re, y.im), dot(x.im, y.re)));
      }
      return new Complex(dot(x.re, y.re), dot(x.im, y.re));
    }
    if (y.im) {
      return new Complex(dot(x.re, y.re), dot(x.re, y.im));
    }
    return new Complex(dot(x.re, y.re));
}

function sdot(x, y) {
    // TODO
  throw new Error('mathlab.dot: dot for sparse matrix not exist')
}

function dot(x, y) {
    var d = dim;
    switch (d(x).length * 1000 + d(y).length) {
        case 2002:
            if (y.length < 10) return dotMMsmall(x, y);
            else return dotMMbig(x, y);
        case 2001:
            return dotMV(x, y);
        case 1002:
            return dotVM(x, y);
        case 1001:
            return dotVV(x, y);
        case 1000:
            return mulVS(x, y);
        case 1:
            return mulSV(x, y);
        case 0:
            return x * y;
        default:
            throw new Error('dot only works on vectors and matrices');
    }
}


function dotMMsmall(x, y) {
    var i, j, k, p, q, r, ret, foo, bar, woo, i0, k0, p0, r0;
    p = x.length;
    q = y.length;
    r = y[0].length;
    ret = Array(p);
    for (i = p - 1; i >= 0; i--) {
        foo = Array(r);
        bar = x[i];
        for (k = r - 1; k >= 0; k--) {
            woo = bar[q - 1] * y[q - 1][k];
            for (j = q - 2; j >= 1; j -= 2) {
                i0 = j - 1;
                woo += bar[j] * y[j][k] + bar[i0] * y[i0][k];
            }
            if (j === 0) {
                woo += bar[0] * y[0][k];
            }
            foo[k] = woo;
        }
        ret[i] = foo;
    }
    return ret;
}

function _getCol(A, j, x) {
    var n = A.length,
        i;
    for (i = n - 1; i > 0; --i) {
        x[i] = A[i][j];
        --i;
        x[i] = A[i][j];
    }
    if (i === 0) x[0] = A[0][j];
}

function dotMMbig(x, y) {
    var gc = _getCol,
        p = y.length,
        v = Array(p);
    var m = x.length,
        n = y[0].length,
        A = new Array(m),
        xj;
    var VV = dotVV;
    var i, j, k, z;
    --p;
    --m;
    for (i = m; i !== -1; --i) A[i] = Array(n);
    --n;
    for (i = n; i !== -1; --i) {
        gc(y, i, v);
        for (j = m; j !== -1; --j) {
            z = 0;
            xj = x[j];
            A[j][i] = VV(xj, v);
        }
    }
    return A;
}

function dotMV(x, y) {
    var p = x.length,
        q = y.length,
        i;
    var ret = Array(p);
    for (i = p - 1; i >= 0; i--) {
        ret[i] = dotVV(x[i], y);
    }
    return ret;
}

function dotVM(x, y) {
    var i, j, k, p, q, r, ret, foo, bar, woo, i0, k0, p0, r0, s1, s2, s3, baz, accum;
    p = x.length;
    q = y[0].length;
    ret = Array(q);
    for (k = q - 1; k >= 0; k--) {
        woo = x[p - 1] * y[p - 1][k];
        for (j = p - 2; j >= 1; j -= 2) {
            i0 = j - 1;
            woo += x[j] * y[j][k] + x[i0] * y[i0][k];
        }
        if (j === 0) {
            woo += x[0] * y[0][k];
        }
        ret[k] = woo;
    }
    return ret;
}

function dotVV(x, y) {
    var i, n = x.length,
        i1, ret = x[n - 1] * y[n - 1];
    for (i = n - 2; i >= 1; i -= 2) {
        i1 = i - 1;
        ret += x[i] * y[i] + x[i1] * y[i1];
    }
    if (i === 0) {
        ret += x[0] * y[0];
    }
    return ret;
}

function mulVV(x, y) {
    var _n = y.length;
    var i, ret = Array(_n);
    for (i = _n - 1; i !== -1; --i) {
        ret[i] = x[i] * y[i]
    }
    return ret;
}

function mulSV(x, y) {
    var _n = y.length;
    var i, ret = Array(_n);
    for (i = _n - 1; i !== -1; --i) {
        ret[i] = x * y[i]
    }
    return ret;
}

function mulVS(x, y) {
    var _n = x.length;
    var i, ret = Array(_n);
    for (i = _n - 1; i !== -1; --i) {
        ret[i] = x[i] * y
    }
    return ret;
}