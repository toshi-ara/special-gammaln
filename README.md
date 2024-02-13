<!--

@license Apache-2.0

Copyright (c) 2018 The Stdlib Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

-->

# gammaln

> Natural logarithm of the gamma function.

This package is a rewrite of
 [@stdlib/math-base-special-gammaln](https://www.npmjs.com/package/@stdlib/math-base-special-gammaln)
 in Typescript.
This package supports both CommonJs and ES Modules.

## Usage

``` javascript
// for CommonJs
const { gammaln } = require('@toshiara/special-gammaln');

// for ES Modules
import { gammaln } from '@toshiara/special-gammaln';
```

### gammaln(x)

Evaluates the natural logarithm of the gamma function.

```javascript
gammaln(1.0);
// returns 0.0

gammaln(2.0);
// returns 0.0

gammaln(4.0);
// returns 1.791759469228055

gammaln(0.5);
// returns 0.5723649429247001

gammaln(-0.5);
// returns 1.2655121234846454

gammaln(0.0);
// returns Infinity

gammaln(NaN);
// returns NaN
```

