/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright, license, and long comment were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/e_lgamma_r.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/

// ## NOTE
// rewritten in Typescript

import { sinpi } from "@toshiara/sinpi";


// CONSTANTS
const PI = 3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679; // eslint-disable-line max-len
const PINF = Number.POSITIVE_INFINITY;


// VARIABLES //
const YMIN = 1.461632144968362245;
const TWO52 = 4503599627370496; // 2**52
const TWO58 = 288230376151711744; // 2**58
const TINY = 8.470329472543003e-22;
const TC = 1.46163214496836224576e+00; // 0x3FF762D86356BE3F
const TF = -1.21486290535849611461e-01; // 0xBFBF19B9BCC38A42
const TT = -3.63867699703950536541e-18; // 0xBC50C7CAA48A971F => TT = -(tail of TF)
const WC = 4.18938533204672725052e-01; // 0x3FDACFE390C97D69


// MAIN //

/**
* Evaluates the natural logarithm of the gamma function.
*
* ## Method
*
* 1.  Argument reduction for \\(0 < x \leq 8\\). Since \\(\Gamma(1+s) = s \Gamma(s)\\), for \\(x \in \[0,8]\\), we may reduce \\(x\\) to a number in \\(\[1.5,2.5]\\) by
*
*     ```tex
*     \operatorname{lgamma}(1+s) = \ln(s) + \operatorname{lgamma}(s)
*     ```
*
*     For example,
*
*     ```tex
*     \begin{align*}
*     \operatorname{lgamma}(7.3) &= \ln(6.3) + \operatorname{lgamma}(6.3) \\
*     &= \ln(6.3 \cdot 5.3) + \operatorname{lgamma}(5.3) \\
*     &= \ln(6.3 \cdot 5.3 \cdot 4.3 \cdot 3.3 \cdot2.3) + \operatorname{lgamma}(2.3)
*     \end{align*}
*     ```
*
* 2.  Compute a polynomial approximation of \\(\mathrm{lgamma}\\) around its minimum (\\(\mathrm{ymin} = 1.461632144968362245\\)) to maintain monotonicity. On the interval \\(\[\mathrm{ymin} - 0.23, \mathrm{ymin} + 0.27]\\) (i.e., \\(\[1.23164,1.73163]\\)), we let \\(z = x - \mathrm{ymin}\\) and use
*
*     ```tex
*     \operatorname{lgamma}(x) = -1.214862905358496078218 + z^2 \cdot \operatorname{poly}(z)
*     ```
*
*     where \\(\operatorname{poly}(z)\\) is a \\(14\\) degree polynomial.
*
* 3.  Compute a rational approximation in the primary interval \\(\[2,3]\\). Let \\( s = x - 2.0 \\). We can thus use the approximation
*
*     ```tex
*     \operatorname{lgamma}(x) = \frac{s}{2} + s\frac{\operatorname{P}(s)}{\operatorname{Q}(s)}
*     ```
*
*     with accuracy
*
*     ```tex
*     \biggl|\frac{\mathrm{P}}{\mathrm{Q}} - \biggr(\operatorname{lgamma}(x)-\frac{s}{2}\biggl)\biggl| < 2^{-61.71}
*     ```
*
*     The algorithms are based on the observation
*
*     ```tex
*     \operatorname{lgamma}(2+s) = s(1 - \gamma) + \frac{\zeta(2) - 1}{2} s^2 - \frac{\zeta(3) - 1}{3} s^3 + \ldots
*     ```
*
*     where \\(\zeta\\) is the zeta function and \\(\gamma = 0.5772156649...\\) is the Euler-Mascheroni constant, which is very close to \\(0.5\\).
*
* 4.  For \\(x \geq 8\\),
*
*     ```tex
*     \operatorname{lgamma}(x) \approx \biggl(x-\frac{1}{2}\biggr) \ln(x) - x + \frac{\ln(2\pi)}{2} + \frac{1}{12x} - \frac{1}{360x^3} + \ldots
*     ```
*
*     which can be expressed
*
*     ```tex
*     \operatorname{lgamma}(x) \approx \biggl(x-\frac{1}{2}\biggr)(\ln(x)-1)-\frac{\ln(2\pi)-1}{2} + \ldots
*     ```
*
*     Let \\(z = \frac{1}{x}\\). We can then use the approximation
*
*     ```tex
*     f(z) = \operatorname{lgamma}(x) - \biggl(x-\frac{1}{2}\biggr)(\ln(x)-1)
*     ```
*
*     by
*
*     ```tex
*     w = w_0 + w_1 z + w_2 z^3 + w_3 z^5 + \ldots + w_6 z^{11}
*     ```
*
*     where
*
*     ```tex
*     |w - f(z)| < 2^{-58.74}
*     ```
*
* 5.  For negative \\(x\\), since
*
*     ```tex
*     -x \Gamma(-x) \Gamma(x) = \frac{\pi}{\sin(\pi x)}
*     ```
*
*     where \\(\Gamma\\) is the gamma function, we have
*
*     ```tex
*     \Gamma(x) = \frac{\pi}{\sin(\pi x)(-x)\Gamma(-x)}
*     ```
*
*     Since \\(\Gamma(-x)\\) is positive,
*
*     ```tex
*     \operatorname{sign}(\Gamma(x)) = \operatorname{sign}(\sin(\pi x))
*     ```
*
*     for \\(x < 0\\). Hence, for \\(x < 0\\),
*
*     ```tex
*     \mathrm{signgam} = \operatorname{sign}(\sin(\pi x))
*     ```
*
*     and
*
*     ```tex
*     \begin{align*}
*     \operatorname{lgamma}(x) &= \ln(|\Gamma(x)|) \\
*     &= \ln\biggl(\frac{\pi}{|x \sin(\pi x)|}\biggr) - \operatorname{lgamma}(-x)
*     \end{align*}
*     ```
*
*     <!-- <note> -->
*
*     Note that one should avoid computing \\(\pi (-x)\\) directly in the computation of \\(\sin(\pi (-x))\\).
*
*     <!-- </note> -->
*
* ## Special Cases
*
* ```tex
* \begin{align*}
* \operatorname{lgamma}(2+s) &\approx s (1-\gamma) & \mathrm{for\ tiny\ s} \\
* \operatorname{lgamma}(x) &\approx -\ln(x) & \mathrm{for\ tiny\ x} \\
* \operatorname{lgamma}(1) &= 0 & \\
* \operatorname{lgamma}(2) &= 0 & \\
* \operatorname{lgamma}(0) &= \infty & \\
* \operatorname{lgamma}(\infty) &= \infty & \\
* \operatorname{lgamma}(-\mathrm{integer}) &= \pm \infty
* \end{align*}
* ```
*
* @param {number} x - input value
* @returns {number} function value
*
* @example
* var v = gammaln( 1.0 );
* // returns 0.0
*
* @example
* var v = gammaln( 2.0 );
* // returns 0.0
*
* @example
* var v = gammaln( 4.0 );
* // returns ~1.792
*
* @example
* var v = gammaln( -0.5 );
* // returns ~1.266
*
* @example
* var v = gammaln( 0.5 );
* // returns ~0.572
*
* @example
* var v = gammaln( 0.0 );
* // returns Infinity
*
* @example
* var v = gammaln( NaN );
* // returns NaN
*/
export function gammaln(x: number): number {
    let isNegative: boolean;
    let nadj = 0;
    let flg;
    let p3;
    let p2;
    let p1;
    let p;
    let q;
    // let t;
    let w;
    let y;
    let z;
    let r;

    // Special cases: NaN, +-infinity
    if (isNaN(x)) {
        return NaN;
    }
    if (!isFinite(x) ) {
        return PINF;
    }
    // Special case: 0
    if (x === 0.0) {
        return PINF;
    }
    if (x < 0.0) {
        isNegative = true;
        x = -x;
    } else {
        isNegative = false;
    }

    // If |x| < 2**-70, return -ln(|x|)
    if (x < TINY) {
        return -Math.log(x);
    }
    if ( isNegative ) {
        // If |x| >= 2**52, must be -integer
        if (x >= TWO52) {
            return PINF;
        }
        const t = sinpi(x);
        if (t === 0.0) {
            return PINF;
        }
        nadj = Math.log(PI) - Math.log(Math.abs(t * x));
    }

    // If x equals 1 or 2, return 0
    if (x === 1.0 || x === 2.0) {
        return 0.0;
    }

    // If x < 2, use lgamma(x) = lgamma(x+1) - log(x)
    if (x < 2.0) {
        if (x <= 0.9) {
            r = -Math.log(x);

            // 0.7316 <= x <=  0.9
            if (x >= (YMIN - 1.0 + 0.27)) {
                y = 1.0 - x;
                flg = 0;
            }
            // 0.2316 <= x < 0.7316
            else if (x >= (YMIN - 1.0 - 0.27)) {
                y = x - (TC - 1.0);
                flg = 1;
            }
            // 0 < x < 0.2316
            else {
                y = x;
                flg = 2;
            }
        } else {
            r = 0.0;

            // 1.7316 <= x < 2
            if (x >= (YMIN + 0.27)) {
                y = 2.0 - x;
                flg = 0;
            }
            // 1.2316 <= x < 1.7316
            else if (x >= (YMIN - 0.27)) {
                y = x - TC;
                flg = 1;
            }
            // 0.9 < x < 1.2316
            else {
                y = x - 1.0;
                flg = 2;
            }
        }
        switch (flg) { // eslint-disable-line default-case
            case 0:
                z = y * y;
                p1 = polyvalA1(z);
                p2 = z * polyvalA2(z);
                p = (y * p1) + p2;
                r += (p - (0.5 * y));
                break;
            case 1:
                z = y * y;
                w = z * y;
                p1 = polyvalT1(w);
                p2 = polyvalT2(w);
                p3 = polyvalT3(w);
                p = (z * p1) - (TT - (w * (p2 + (y * p3))));
                r += (TF + p);
                break;
            case 2:
                p1 = y * polyvalU(y);
                p2 = polyvalV(y);
                r += (-0.5 * y) + (p1 / p2);
            break;
        }
    }
    // 2 <= x < 8
    else if (x < 8.0) {
        flg = Math.trunc(x);
        y = x - flg;
        p = y * polyvalS(y);
        q = polyvalR(y);
        r = (0.5 * y) + (p / q);
        z = 1.0; // gammaln(1 + s) = ln(s) + gammaln(s)

        for (; flg >= 3; flg--) {
            z *= y + (flg - 1);
        }
        r += Math.log(z);
    }
    // 8 <= x < 2**58
    else if (x < TWO58) {
        const t = Math.log(x);
        z = 1.0 / x;
        y = z * z;
        w = WC + (z * polyvalW(y));
        r = ((x - 0.5) * (t - 1.0)) + w;
    }
    // 2**58 <= x <= Inf
    else {
        r = x * (Math.log(x) - 1.0);
    }

    if (isNegative) {
        r = nadj - r;
    }
    return r;
}


// polyval functions
// values are refered in SpecialFunctions.jl
function polyvalA1(x: number): number {
    if ( x === 0.0 ) {
        return 7.72156649015328655494e-02;
    }
    return 7.72156649015328655494e-02 + (x * (6.73523010531292681824e-02 + (x * (7.38555086081402883957e-03 + (x * (1.19270763183362067845e-03 + (x * (2.20862790713908385557e-04 + (x * 2.52144565451257326939e-05))))))))); // eslint-disable-line max-len
}

function polyvalA2(x: number): number {
    if (x === 0.0) {
        return 3.22467033424113591611e-01;
    }
    return 3.22467033424113591611e-01 + (x * (2.05808084325167332806e-02 + (x * (2.89051383673415629091e-03 + (x * (5.10069792153511336608e-04 + (x * (1.08011567247583939954e-04 + (x * 4.48640949618915160150e-05))))))))); // eslint-disable-line max-len
}


function polyvalT1(x: number): number {
    if (x === 0.0) {
        return 4.83836122723810047042e-01;
    }
    return 4.83836122723810047042e-01 + (x * (-3.27885410759859649565e-02 + (x * (6.10053870246291332635e-03 + (x * (-1.40346469989232843813e-03 + (x * 3.15632070903625950361e-04))))))); // eslint-disable-line max-len
}

function polyvalT2(x: number): number {
    if (x === 0.0) {
        return -1.47587722994593911752e-01;
    }
    return -1.47587722994593911752e-01 + (x * (1.79706750811820387126e-02 + (x * (-3.68452016781138256760e-03 + (x * (8.81081882437654011382e-04 + (x * -3.12754168375120860518e-04))))))); // eslint-disable-line max-len
}

function polyvalT3(x: number): number {
    if (x === 0.0) {
        return 6.46249402391333854778e-02;
    }
    return 6.46249402391333854778e-02 + (x * (-1.03142241298341437450e-02 + (x * (2.25964780900612472250e-03 + (x * (-5.38595305356740546715e-04 + (x * 3.35529192635519073543e-04))))))); // eslint-disable-line max-len
}

function polyvalU(x: number): number {
    if (x === 0.0) {
        return -7.72156649015328655494e-02;
    }
    return -7.72156649015328655494e-02 + (x * (6.32827064025093366517e-01 + (x * (1.45492250137234768737 + (x * (9.77717527963372745603e-01 + (x * (2.28963728064692451092e-01 + (x * 1.33810918536787660377e-02))))))))); // eslint-disable-line max-len
}

function polyvalV(x: number): number {
    if (x === 0.0) {
        return 1.0;
    }
    return 1.0 + (x * (2.45597793713041134822 + (x * (2.12848976379893395361 + (x * (7.69285150456672783825e-01 + (x * (1.04222645593369134254e-01 + (x * 3.21709242282423911810e-03))))))))); // eslint-disable-line max-len
}

function polyvalS(x: number): number {
    if (x === 0.0) {
        return -7.72156649015328655494e-2;
    }
    return -7.72156649015328655494e-2 + (x * (2.14982415960608852501e-1 + (x * (3.25778796408930981787e-1 + (x * (1.46350472652464452805e-1 + (x * (2.66422703033638609560e-2 + (x * (1.84028451407337715652e-3 + (x * 3.19475326584100867617e-5))))))))))); // eslint-disable-line max-len
}

function polyvalR(x: number): number {
    if (x === 0.0) {
        return 1.0;
    }
    return 1.0 + (x * (1.39200533467621045958 + (x * (7.21935547567138069525e-1 + (x * (1.71933865632803078993e-1 + (x * (1.86459191715652901344e-2 + (x * (7.77942496381893596434e-4 + (x * 7.32668430744625636189e-6))))))))))); // eslint-disable-line max-len
}

function polyvalW(x: number): number {
    if (x === 0.0) {
        return 8.33333333333329678849e-2;
    }
    return 8.33333333333329678849e-2 + (x * (-2.77777777728775536470e-3 + (x * (7.93650558643019558500e-4 + (x * (-5.95187557450339963135e-4 + (x * (8.36339918996282139126e-4 + (x * -1.63092934096575273989e-3))))))))); // eslint-disable-line max-len
}

