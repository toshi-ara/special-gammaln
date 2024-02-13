import { gammaln } from "@toshiara/special-gammaln";

let x = [
    10**-80, 10**-6, 0.001, 0.5, 0.8,
    1.5, 2.5, 7.5, 10, 100, 1000,
    -0.5, -1, -2, -3
];

for (let i = 0; i < x.length; i++) {
    console.log("x =", x[i], ": gammaln(x) =", gammaln(x[i]));
}

