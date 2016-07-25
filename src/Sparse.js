export default class Sparse {
  constructor(A) {
    // TODO: throw error while A is not matrix
    var m = A.length, n, foo, i, j, counts = [];
    for (i = m - 1; i !== -1; --i) {
      foo = A[i];
      for (j in foo) {
        j = parseInt(j);
        while (j >= counts.length) counts[counts.length] = 0;
        if (foo[j] !== 0) counts[j]++;
      }
    }
    var n = counts.length;
    var Ai = Array(n + 1);
    Ai[0] = 0;
    for (i = 0; i < n; ++i) Ai[i + 1] = Ai[i] + counts[i];
    var Aj = Array(Ai[n]), Av = Array(Ai[n]);
    for (i = m - 1; i !== -1; --i) {
      foo = A[i];
      for (j in foo) {
        if (foo[j] !== 0) {
          counts[j]--;
          Aj[Ai[j] + counts[j]] = i;
          Av[Ai[j] + counts[j]] = foo[j];
        }
      }
    }

    this.col = Ai;
    this.row = Aj;
    this.val = Av;
  }
}