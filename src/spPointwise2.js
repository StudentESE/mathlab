import sup from './sup'
import rep from './rep'
import Sparse from './Sparse'

export default function spPointwise2(fun) {
	return function (X, Y) {
		var Xi = X.col, Xj = X.row, Xv = X.val;
		var Yi = Y.col, Yj = Y.row, Yv = Y.val;
		var n = Xi.length - 1, m = Math.max(sup(Xj), sup(Yj)) + 1;
		var Zi = rep([n + 1], 0), Zj = [], Zv = [];
		var x = rep([m], 0), y = rep([m], 0);
		var xk, yk, zk;
		var i, j, j0, j1, k, p = 0;
		for (i = 0; i < n; ++i) {
			j0 = Xi[i];
			j1 = Xi[i + 1];
			for (j = j0; j !== j1; ++j) {
				k = Xj[j];
				x[k] = 1;
				Zj[p] = k;
				++p;
			}
			j0 = Yi[i];
			j1 = Yi[i + 1];
			for (j = j0; j !== j1; ++j) {
				k = Yj[j];
				y[k] = Yv[j];
				if (x[k] === 0) { Zj[p] = k;++p; }
			}
			Zi[i + 1] = p;
			j0 = Xi[i];
			j1 = Xi[i + 1];
			for (j = j0; j !== j1; ++j) x[Xj[j]] = Xv[j];
			j0 = Zi[i];
			j1 = Zi[i + 1];
			for (j = j0; j !== j1; ++j) {
				k = Zj[j];
				xk = x[k];
				yk = y[k];
				zk = fun(xk, yk);
				Zv[j] = zk;
			}
			j0 = Xi[i];
			j1 = Xi[i + 1];
			for (j = j0; j !== j1; ++j) x[Xj[j]] = 0;
			j0 = Yi[i];
			j1 = Yi[i + 1];
			for (j = j0; j !== j1; ++j) y[Yj[j]] = 0;
		}
		return new Sparse({
			col: Zi,
			row: Zj,
			val: Zv,
		})
	}
}