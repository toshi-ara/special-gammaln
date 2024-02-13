import { gammaln } from "../dist/esm/index.js";


describe("gammaln functions", () => {
    it("Check gammaln function", () => {
        let digits = 18;
        //
        // results by loggamma function in Julia SpecialFunction package
        expect(gammaln(10**-80)).toBeCloseTo(184.20680743952366, digits);
        expect(gammaln(10**-6)).toBeCloseTo(13.81550998074943, digits);
        expect(gammaln(0.001)).toBeCloseTo(6.907178885383853, digits);
        expect(gammaln(0.5)).toBeCloseTo(0.5723649429247001, digits);
        expect(gammaln(0.8)).toBeCloseTo(0.15205967839983756, digits);
        expect(gammaln(1.5)).toBeCloseTo(-0.12078223763524522, digits);
        expect(gammaln(2.5)).toBeCloseTo(0.2846828704729192, digits);
        expect(gammaln(7.5)).toBeCloseTo(7.534364236758734, digits);
        expect(gammaln(10)).toBeCloseTo(12.80182748008147, digits);
        expect(gammaln(100)).toBeCloseTo(359.13420536957545, digits);
        expect(gammaln(1000)).toBeCloseTo(5905.220423209181, digits);
    });
});

