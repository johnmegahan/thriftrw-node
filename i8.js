// Copyright (c) 2016 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

'use strict';

var bufrw = require('bufrw');
var ebufrw = require('bufrw/errors');
var util = require('util');
var TYPE = require('./TYPE');
var errors = require('./errors');

function I8RW() {
}

util.inherits(I8RW, bufrw.Base);

I8RW.prototype.name = 'i8';
I8RW.prototype.width = 1;
I8RW.prototype.min = -0x7f - 1;
I8RW.prototype.max = 0x7f;

I8RW.prototype.poolReadFrom = function poolReadFrom(result, buffer, offset) {
    var value = buffer[offset];
    return result.reset(null, offset + this.width, value);
};

I8RW.prototype.poolWriteInto = function poolWriteInto(result, value, buffer, offset) {
    var coerced = +value;
    if ((typeof value !== 'string' && typeof value !== 'number') || !isFinite(coerced)) {
        return result.reset(new ebufrw.InvalidArgument({
            expected: 'a number'
        }));
    }

    var remain = buffer.length - offset;
    if (remain < this.width) {
        return bufrw.WriteResult.poolShortError(result, this.width, remain, offset);
    }

    if (value < this.min || value > this.max) {
        return result.reset(new ebufrw.RangeError({
            value: coerced,
            min: this.min,
            max: this.max
        }));
    }

    buffer[offset] = coerced;
    return result.reset(null, offset + this.width);
};

I8RW.prototype.poolByteLength = function poolByteLength(result, value) {
    return result.reset(null, this.width);
};


function ThriftI8(annotations) {
    this.annotations = annotations;
}

ThriftI8.prototype.rw = new I8RW();
ThriftI8.prototype.name = 'i8';
ThriftI8.prototype.typeid = TYPE.I8;
ThriftI8.prototype.surface = Number;
ThriftI8.prototype.models = 'type';

module.exports.I8RW = I8RW;
module.exports.ThriftI8 = ThriftI8;
