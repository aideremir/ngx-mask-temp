(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('ngx-mask', ['exports', '@angular/core', '@angular/common', '@angular/forms'], factory) :
    (global = global || self, factory(global['ngx-mask'] = {}, global.ng.core, global.ng.common, global.ng.forms));
}(this, function (exports, core, common, forms) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    var config = new core.InjectionToken('config');
    var NEW_CONFIG = new core.InjectionToken('NEW_CONFIG');
    var INITIAL_CONFIG = new core.InjectionToken('INITIAL_CONFIG');
    var initialConfig = {
        sufix: '',
        prefix: '',
        clearIfNotMatch: false,
        showTemplate: false,
        showMaskTyped: false,
        dropSpecialCharacters: true,
        hiddenInput: undefined,
        shownMaskExpression: '',
        validation: true,
        // tslint:disable-next-line: quotemark
        specialCharacters: ['-', '/', '(', ')', '.', ':', ' ', '+', ',', '@', '[', ']', '"', "'"],
        patterns: {
            '0': {
                pattern: new RegExp('\\d'),
            },
            '9': {
                pattern: new RegExp('\\d'),
                optional: true,
            },
            X: {
                pattern: new RegExp('\\d'),
                symbol: '*',
            },
            A: {
                pattern: new RegExp('[a-zA-Z0-9]'),
            },
            S: {
                pattern: new RegExp('[a-zA-Z]'),
            },
            d: {
                pattern: new RegExp('\\d'),
            },
            m: {
                pattern: new RegExp('\\d'),
            },
            M: {
                pattern: new RegExp('\\d'),
            },
            H: {
                pattern: new RegExp('\\d'),
            },
            h: {
                pattern: new RegExp('\\d'),
            },
            s: {
                pattern: new RegExp('\\d'),
            },
        },
    };
    var withoutValidation = [
        'percent',
        'Hh:m0:s0',
        'Hh:m0',
        'Hh',
        'm0:s0',
        's0',
        'm0',
        'separator',
        'dot_separator',
        'comma_separator',
        'd0/M0/0000',
        'd0/M0',
        'd0',
        'M0',
    ];

    var MaskApplierService = /** @class */ (function () {
        function MaskApplierService(_config) {
            this._config = _config;
            this.maskExpression = '';
            this.actualValue = '';
            this.shownMaskExpression = '';
            this.separator = function (str, char, decimalChar, precision) {
                str += '';
                var x = str.split(decimalChar);
                var decimals = x.length > 1 ? "" + decimalChar + x[1] : '';
                var res = x[0];
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(res)) {
                    res = res.replace(rgx, '$1' + char + '$2');
                }
                if (precision === undefined) {
                    return res + decimals;
                }
                else if (precision === 0) {
                    return res;
                }
                return res + decimals.substr(0, precision + 1);
            };
            this.percentage = function (str) {
                return Number(str) >= 0 && Number(str) <= 100;
            };
            this.getPrecision = function (maskExpression) {
                var x = maskExpression.split('.');
                if (x.length > 1) {
                    return Number(x[x.length - 1]);
                }
                return Infinity;
            };
            this.checkInputPrecision = function (inputValue, precision, decimalMarker) {
                if (precision < Infinity) {
                    var precisionRegEx = void 0;
                    if (decimalMarker === '.') {
                        precisionRegEx = new RegExp("\\.\\d{" + precision + "}.*$");
                    }
                    else {
                        precisionRegEx = new RegExp(",\\d{" + precision + "}.*$");
                    }
                    var precisionMatch = inputValue.match(precisionRegEx);
                    if (precisionMatch && precisionMatch[0].length - 1 > precision) {
                        inputValue = inputValue.substring(0, inputValue.length - 1);
                    }
                    else if (precision === 0 && inputValue.endsWith(decimalMarker)) {
                        inputValue = inputValue.substring(0, inputValue.length - 1);
                    }
                }
                return inputValue;
            };
            this._shift = new Set();
            this.clearIfNotMatch = this._config.clearIfNotMatch;
            this.dropSpecialCharacters = this._config.dropSpecialCharacters;
            this.maskSpecialCharacters = this._config.specialCharacters;
            this.maskAvailablePatterns = this._config.patterns;
            this.prefix = this._config.prefix;
            this.sufix = this._config.sufix;
            this.hiddenInput = this._config.hiddenInput;
            this.showMaskTyped = this._config.showMaskTyped;
            this.validation = this._config.validation;
        }
        // tslint:disable-next-line:no-any
        MaskApplierService.prototype.applyMaskWithPattern = function (inputValue, maskAndPattern) {
            var _a = __read(maskAndPattern, 2), mask = _a[0], customPattern = _a[1];
            this.customPattern = customPattern;
            return this.applyMask(inputValue, mask);
        };
        MaskApplierService.prototype.applyMask = function (inputValue, maskExpression, position, cb) {
            if (position === void 0) { position = 0; }
            if (cb === void 0) { cb = function () { }; }
            if (inputValue === undefined || inputValue === null || maskExpression === undefined) {
                return '';
            }
            var cursor = 0;
            var result = "";
            var multi = false;
            var backspaceShift = false;
            var shift = 1;
            if (inputValue.slice(0, this.prefix.length) === this.prefix) {
                inputValue = inputValue.slice(this.prefix.length, inputValue.length);
            }
            var inputArray = inputValue.toString().split('');
            if (maskExpression === 'IP') {
                this.ipError = !!(inputArray.filter(function (i) { return i === '.'; }).length < 3 && inputArray.length < 7);
                maskExpression = '099.099.099.099';
            }
            if (maskExpression.startsWith('percent')) {
                if (inputValue.match('[a-z]|[A-Z]') || inputValue.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,\/]/)) {
                    inputValue = this._checkInput(inputValue);
                    var precision = this.getPrecision(maskExpression);
                    inputValue = this.checkInputPrecision(inputValue, precision, '.');
                }
                if (this.percentage(inputValue)) {
                    result = inputValue;
                }
                else {
                    result = inputValue.substring(0, inputValue.length - 1);
                }
            }
            else if (maskExpression === 'separator' ||
                maskExpression.startsWith('separator') ||
                maskExpression === 'dot_separator' ||
                maskExpression.startsWith('dot_separator') ||
                maskExpression === 'comma_separator' ||
                maskExpression.startsWith('comma_separator')) {
                if (inputValue.match('[wа-яА-Я]') ||
                    inputValue.match('[a-z]|[A-Z]') ||
                    inputValue.match(/[-@#!$%\\^&*()_£¬'+|~=`{}\[\]:";<>.?\/]/)) {
                    inputValue = this._checkInput(inputValue);
                }
                var precision = this.getPrecision(maskExpression);
                var strForSep = void 0;
                if (maskExpression.startsWith('separator')) {
                    if (inputValue.includes(',') &&
                        inputValue.endsWith(',') &&
                        inputValue.indexOf(',') !== inputValue.lastIndexOf(',')) {
                        inputValue = inputValue.substring(0, inputValue.length - 1);
                    }
                }
                if (maskExpression.startsWith('dot_separator')) {
                    if (inputValue.indexOf('.') !== -1 &&
                        inputValue.indexOf('.') === inputValue.lastIndexOf('.') &&
                        inputValue.indexOf('.') > 3) {
                        inputValue = inputValue.replace('.', ',');
                    }
                    inputValue =
                        inputValue.length > 1 && inputValue[0] === '0' && inputValue[1] !== ','
                            ? inputValue.slice(1, inputValue.length)
                            : inputValue;
                }
                if (maskExpression.startsWith('comma_separator')) {
                    inputValue =
                        inputValue.length > 1 && inputValue[0] === '0' && inputValue[1] !== '.'
                            ? inputValue.slice(1, inputValue.length)
                            : inputValue;
                }
                if (maskExpression === 'separator' || maskExpression.startsWith('separator')) {
                    if (inputValue.match(/[@#!$%^&*()_+|~=`{}\[\]:,";<>?\/]/)) {
                        inputValue = inputValue.substring(0, inputValue.length - 1);
                    }
                    inputValue = this.checkInputPrecision(inputValue, precision, '.');
                    strForSep = inputValue.replace(/\s/g, '');
                    result = this.separator(strForSep, ' ', '.', precision);
                }
                else if (maskExpression === 'dot_separator' || maskExpression.startsWith('dot_separator')) {
                    if (inputValue.match(/[@#!$%^&*()_+|~=`{}\[\]:\s";<>?\/]/)) {
                        inputValue = inputValue.substring(0, inputValue.length - 1);
                    }
                    inputValue = this.checkInputPrecision(inputValue, precision, ',');
                    strForSep = inputValue.replace(/\./g, '');
                    result = this.separator(strForSep, '.', ',', precision);
                }
                else if (maskExpression === 'comma_separator' || maskExpression.startsWith('comma_separator')) {
                    strForSep = inputValue.replace(/,/g, '');
                    result = this.separator(strForSep, ',', '.', precision);
                }
                var commaShift = result.indexOf(',') - inputValue.indexOf(',');
                var shiftStep = result.length - inputValue.length;
                if (shiftStep > 0 && result[position] !== ',') {
                    backspaceShift = true;
                    var _shift = 0;
                    do {
                        this._shift.add(position + _shift);
                        _shift++;
                    } while (_shift < shiftStep);
                }
                else if ((commaShift !== 0 && position > 0 && !(result.indexOf(',') >= position && position > 3)) ||
                    (!(result.indexOf('.') >= position && position > 3) && shiftStep <= 0)) {
                    this._shift.clear();
                    backspaceShift = true;
                    shift = shiftStep;
                    position += shiftStep;
                    this._shift.add(position);
                }
                else {
                    this._shift.clear();
                }
            }
            else {
                for (
                // tslint:disable-next-line
                var i = 0, inputSymbol = inputArray[0]; i < inputArray.length; i++, inputSymbol = inputArray[i]) {
                    if (cursor === maskExpression.length) {
                        break;
                    }
                    if (this._checkSymbolMask(inputSymbol, maskExpression[cursor]) && maskExpression[cursor + 1] === '?') {
                        result += inputSymbol;
                        cursor += 2;
                    }
                    else if (maskExpression[cursor + 1] === '*' &&
                        multi &&
                        this._checkSymbolMask(inputSymbol, maskExpression[cursor + 2])) {
                        result += inputSymbol;
                        cursor += 3;
                        multi = false;
                    }
                    else if (this._checkSymbolMask(inputSymbol, maskExpression[cursor]) &&
                        maskExpression[cursor + 1] === '*') {
                        result += inputSymbol;
                        multi = true;
                    }
                    else if (maskExpression[cursor + 1] === '?' &&
                        this._checkSymbolMask(inputSymbol, maskExpression[cursor + 2])) {
                        result += inputSymbol;
                        cursor += 3;
                    }
                    else if (this._checkSymbolMask(inputSymbol, maskExpression[cursor]) ||
                        (this.hiddenInput &&
                            this.maskAvailablePatterns[maskExpression[cursor]] &&
                            this.maskAvailablePatterns[maskExpression[cursor]].symbol === inputSymbol)) {
                        if (maskExpression[cursor] === 'H') {
                            if (Number(inputSymbol) > 2) {
                                cursor += 1;
                                var shiftStep = /[*?]/g.test(maskExpression.slice(0, cursor))
                                    ? inputArray.length
                                    : cursor;
                                this._shift.add(shiftStep + this.prefix.length || 0);
                                i--;
                                continue;
                            }
                        }
                        if (maskExpression[cursor] === 'h') {
                            if (result === '2' && Number(inputSymbol) > 3) {
                                continue;
                            }
                        }
                        if (maskExpression[cursor] === 'm') {
                            if (Number(inputSymbol) > 5) {
                                cursor += 1;
                                var shiftStep = /[*?]/g.test(maskExpression.slice(0, cursor))
                                    ? inputArray.length
                                    : cursor;
                                this._shift.add(shiftStep + this.prefix.length || 0);
                                i--;
                                continue;
                            }
                        }
                        if (maskExpression[cursor] === 's') {
                            if (Number(inputSymbol) > 5) {
                                cursor += 1;
                                var shiftStep = /[*?]/g.test(maskExpression.slice(0, cursor))
                                    ? inputArray.length
                                    : cursor;
                                this._shift.add(shiftStep + this.prefix.length || 0);
                                i--;
                                continue;
                            }
                        }
                        if (maskExpression[cursor] === 'd') {
                            if (Number(inputSymbol) > 3) {
                                cursor += 1;
                                var shiftStep = /[*?]/g.test(maskExpression.slice(0, cursor))
                                    ? inputArray.length
                                    : cursor;
                                this._shift.add(shiftStep + this.prefix.length || 0);
                                i--;
                                continue;
                            }
                        }
                        if (maskExpression[cursor - 1] === 'd') {
                            if (Number(inputValue.slice(cursor - 1, cursor + 1)) > 31) {
                                continue;
                            }
                        }
                        if (maskExpression[cursor] === 'M') {
                            if (Number(inputSymbol) > 1) {
                                cursor += 1;
                                var shiftStep = /[*?]/g.test(maskExpression.slice(0, cursor))
                                    ? inputArray.length
                                    : cursor;
                                this._shift.add(shiftStep + this.prefix.length || 0);
                                i--;
                                continue;
                            }
                        }
                        if (maskExpression[cursor - 1] === 'M') {
                            if (Number(inputValue.slice(cursor - 1, cursor + 1)) > 12) {
                                continue;
                            }
                        }
                        result += inputSymbol;
                        cursor++;
                    }
                    else if (this.maskSpecialCharacters.indexOf(maskExpression[cursor]) !== -1) {
                        result += maskExpression[cursor];
                        cursor++;
                        var shiftStep = /[*?]/g.test(maskExpression.slice(0, cursor))
                            ? inputArray.length
                            : cursor;
                        this._shift.add(shiftStep + this.prefix.length || 0);
                        i--;
                    }
                    else if (this.maskSpecialCharacters.indexOf(inputSymbol) > -1 &&
                        this.maskAvailablePatterns[maskExpression[cursor]] &&
                        this.maskAvailablePatterns[maskExpression[cursor]].optional) {
                        cursor++;
                        i--;
                    }
                    else if (this.maskExpression[cursor + 1] === '*' &&
                        this._findSpecialChar(this.maskExpression[cursor + 2]) &&
                        this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2] &&
                        multi) {
                        cursor += 3;
                        result += inputSymbol;
                    }
                    else if (this.maskExpression[cursor + 1] === '?' &&
                        this._findSpecialChar(this.maskExpression[cursor + 2]) &&
                        this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2] &&
                        multi) {
                        cursor += 3;
                        result += inputSymbol;
                    }
                }
            }
            if (result.length + 1 === maskExpression.length &&
                this.maskSpecialCharacters.indexOf(maskExpression[maskExpression.length - 1]) !== -1) {
                result += maskExpression[maskExpression.length - 1];
            }
            var newPosition = position + 1;
            while (this._shift.has(newPosition)) {
                shift++;
                newPosition++;
            }
            cb(this._shift.has(position) ? shift : 0, backspaceShift);
            if (shift < 0) {
                this._shift.clear();
            }
            var res = this.sufix ? "" + this.prefix + result + this.sufix : "" + this.prefix + result;
            if (result.length === 0) {
                res = "" + this.prefix + result;
            }
            return res;
        };
        MaskApplierService.prototype._findSpecialChar = function (inputSymbol) {
            return this.maskSpecialCharacters.find(function (val) { return val === inputSymbol; });
        };
        MaskApplierService.prototype._checkSymbolMask = function (inputSymbol, maskSymbol) {
            this.maskAvailablePatterns = this.customPattern ? this.customPattern : this.maskAvailablePatterns;
            return (this.maskAvailablePatterns[maskSymbol] &&
                this.maskAvailablePatterns[maskSymbol].pattern &&
                this.maskAvailablePatterns[maskSymbol].pattern.test(inputSymbol));
        };
        MaskApplierService.prototype._checkInput = function (str) {
            return str
                .split('')
                .filter(function (i) { return i.match('\\d') || i === '.' || i === ','; })
                .join('');
        };
        MaskApplierService = __decorate([
            core.Injectable(),
            __param(0, core.Inject(config)),
            __metadata("design:paramtypes", [Object])
        ], MaskApplierService);
        return MaskApplierService;
    }());

    var MaskService = /** @class */ (function (_super) {
        __extends(MaskService, _super);
        function MaskService(
        // tslint:disable-next-line
        document, _config, _elementRef, _renderer) {
            var _this = _super.call(this, _config) || this;
            _this.document = document;
            _this._config = _config;
            _this._elementRef = _elementRef;
            _this._renderer = _renderer;
            _this.validation = true;
            _this.maskExpression = '';
            _this.isNumberValue = false;
            _this.showMaskTyped = false;
            _this.maskIsShown = '';
            _this.selStart = null;
            _this.selEnd = null;
            // tslint:disable-next-line
            _this.onChange = function (_) { };
            _this._formElement = _this._elementRef.nativeElement;
            return _this;
        }
        // tslint:disable-next-line:cyclomatic-complexity
        MaskService.prototype.applyMask = function (inputValue, maskExpression, position, cb) {
            if (position === void 0) { position = 0; }
            if (cb === void 0) { cb = function () { }; }
            if (!maskExpression) {
                return inputValue;
            }
            this.maskIsShown = this.showMaskTyped ? this.showMaskInInput() : '';
            if (this.maskExpression === 'IP' && this.showMaskTyped) {
                this.maskIsShown = this.showMaskInInput(inputValue || '#');
            }
            if (!inputValue && this.showMaskTyped) {
                this.formControlResult(this.prefix);
                return this.prefix + this.maskIsShown;
            }
            var getSymbol = !!inputValue && typeof this.selStart === 'number' ? inputValue[this.selStart] : '';
            var newInputValue = '';
            if (this.hiddenInput !== undefined) {
                var actualResult = this.actualValue.split('');
                inputValue !== '' && actualResult.length
                    ? typeof this.selStart === 'number' && typeof this.selEnd === 'number'
                        ? inputValue.length > actualResult.length
                            ? actualResult.splice(this.selStart, 0, getSymbol)
                            : inputValue.length < actualResult.length
                                ? actualResult.length - inputValue.length === 1
                                    ? actualResult.splice(this.selStart - 1, 1)
                                    : actualResult.splice(this.selStart, this.selEnd - this.selStart)
                                : null
                        : null
                    : (actualResult = []);
                newInputValue = this.actualValue.length ? this.shiftTypedSymbols(actualResult.join('')) : inputValue;
            }
            newInputValue = Boolean(newInputValue) && newInputValue.length ? newInputValue : inputValue;
            var result = _super.prototype.applyMask.call(this, newInputValue, maskExpression, position, cb);
            this.actualValue = this.getActualValue(result);
            if (this.maskExpression.startsWith('separator') && this.dropSpecialCharacters === true) {
                this.maskSpecialCharacters = this.maskSpecialCharacters.filter(function (item) { return item !== ','; });
            }
            if ('separator' === this.maskExpression && this.dropSpecialCharacters === true) {
                this.maskSpecialCharacters = this.maskSpecialCharacters.filter(function (item) { return item !== ','; });
            }
            if (this.maskExpression.startsWith('dot_separator') && this.dropSpecialCharacters === true) {
                this.maskSpecialCharacters = this.maskSpecialCharacters.filter(function (item) { return item !== ','; });
            }
            if ('dot_separator' === this.maskExpression && this.dropSpecialCharacters === true) {
                this.maskSpecialCharacters = this.maskSpecialCharacters.filter(function (item) { return item !== ','; });
            }
            if (this.maskExpression.startsWith('comma_separator') && this.dropSpecialCharacters === true) {
                this.maskSpecialCharacters = this.maskSpecialCharacters.filter(function (item) { return item !== '.'; });
            }
            if ('comma_separator' === this.maskExpression && this.dropSpecialCharacters === true) {
                this.maskSpecialCharacters = this.maskSpecialCharacters.filter(function (item) { return item !== '.'; });
            }
            this.formControlResult(result);
            var ifMaskIsShown = '';
            if (!this.showMaskTyped) {
                if (this.hiddenInput) {
                    return result && result.length ? this.hideInput(result, this.maskExpression) : result;
                }
                return result;
            }
            var resLen = result.length;
            var prefNmask = this.prefix + this.maskIsShown;
            ifMaskIsShown = this.maskExpression === 'IP' ? prefNmask : prefNmask.slice(resLen);
            return result + ifMaskIsShown;
        };
        MaskService.prototype.applyValueChanges = function (position, cb) {
            if (position === void 0) { position = 0; }
            if (cb === void 0) { cb = function () { }; }
            this._formElement.value = this.applyMask(this._formElement.value, this.maskExpression, position, cb);
            if (this._formElement === this.document.activeElement) {
                return;
            }
            this.clearIfNotMatchFn();
        };
        MaskService.prototype.hideInput = function (inputValue, maskExpression) {
            var _this = this;
            return inputValue
                .split('')
                .map(function (curr, index) {
                if (_this.maskAvailablePatterns &&
                    _this.maskAvailablePatterns[maskExpression[index]] &&
                    _this.maskAvailablePatterns[maskExpression[index]].symbol) {
                    return _this.maskAvailablePatterns[maskExpression[index]].symbol;
                }
                return curr;
            })
                .join('');
        };
        // this function is not necessary, it checks result against maskExpression
        MaskService.prototype.getActualValue = function (res) {
            var _this = this;
            var compare = res
                .split('')
                .filter(function (symbol, i) {
                return _this._checkSymbolMask(symbol, _this.maskExpression[i]) ||
                    (_this.maskSpecialCharacters.includes(_this.maskExpression[i]) && symbol === _this.maskExpression[i]);
            });
            if (compare.join('') === res) {
                return compare.join('');
            }
            return res;
        };
        MaskService.prototype.shiftTypedSymbols = function (inputValue) {
            var _this = this;
            var symbolToReplace = '';
            var newInputValue = (inputValue &&
                inputValue.split('').map(function (currSymbol, index) {
                    if (_this.maskSpecialCharacters.includes(inputValue[index + 1]) &&
                        inputValue[index + 1] !== _this.maskExpression[index + 1]) {
                        symbolToReplace = currSymbol;
                        return inputValue[index + 1];
                    }
                    if (symbolToReplace.length) {
                        var replaceSymbol = symbolToReplace;
                        symbolToReplace = '';
                        return replaceSymbol;
                    }
                    return currSymbol;
                })) ||
                [];
            return newInputValue.join('');
        };
        MaskService.prototype.showMaskInInput = function (inputVal) {
            if (this.showMaskTyped && !!this.shownMaskExpression) {
                if (this.maskExpression.length !== this.shownMaskExpression.length) {
                    throw new Error('Mask expression must match mask placeholder length');
                }
                else {
                    return this.shownMaskExpression;
                }
            }
            else if (this.showMaskTyped) {
                if (inputVal) {
                    return this._checkForIp(inputVal);
                }
                return this.maskExpression.replace(/\w/g, '_');
            }
            return '';
        };
        MaskService.prototype.clearIfNotMatchFn = function () {
            if (this.clearIfNotMatch
                && this.prefix.length + this.maskExpression.length + this.sufix.length !== this._formElement.value.length) {
                this.formElementProperty = ['value', ''];
                this.applyMask(this._formElement.value, this.maskExpression);
            }
        };
        Object.defineProperty(MaskService.prototype, "formElementProperty", {
            set: function (_a) {
                var _b = __read(_a, 2), name = _b[0], value = _b[1];
                this._renderer.setProperty(this._formElement, name, value);
            },
            enumerable: true,
            configurable: true
        });
        MaskService.prototype.checkSpecialCharAmount = function (mask) {
            var _this = this;
            var chars = mask.split('').filter(function (item) { return _this._findSpecialChar(item); });
            return chars.length;
        };
        // tslint:disable-next-line: cyclomatic-complexity
        MaskService.prototype._checkForIp = function (inputVal) {
            if (inputVal === '#') {
                return '_._._._';
            }
            var arr = [];
            for (var i = 0; i < inputVal.length; i++) {
                if (inputVal[i].match('\\d')) {
                    arr.push(inputVal[i]);
                }
            }
            if (arr.length <= 3) {
                return '_._._';
            }
            if (arr.length > 3 && arr.length <= 6) {
                return '_._';
            }
            if (arr.length > 6 && arr.length <= 9) {
                return '_';
            }
            if (arr.length > 9 && arr.length <= 12) {
                return '';
            }
            return '';
        };
        MaskService.prototype.formControlResult = function (inputValue) {
            if (Array.isArray(this.dropSpecialCharacters)) {
                this.onChange(this._removeMask(this._removeSufix(this._removePrefix(inputValue)), this.dropSpecialCharacters));
            }
            else if (this.dropSpecialCharacters) {
                this.onChange(this._checkSymbols(inputValue));
            }
            else {
                this.onChange(this._removeSufix(this._removePrefix(inputValue)));
            }
        };
        MaskService.prototype._removeMask = function (value, specialCharactersForRemove) {
            return value ? value.replace(this._regExpForRemove(specialCharactersForRemove), '') : value;
        };
        MaskService.prototype._removePrefix = function (value) {
            if (!this.prefix) {
                return value;
            }
            return value ? value.replace(this.prefix, '') : value;
        };
        MaskService.prototype._removeSufix = function (value) {
            if (!this.sufix) {
                return value;
            }
            return value ? value.replace(this.sufix, '') : value;
        };
        MaskService.prototype._regExpForRemove = function (specialCharactersForRemove) {
            return new RegExp(specialCharactersForRemove.map(function (item) { return "\\" + item; }).join('|'), 'gi');
        };
        MaskService.prototype._checkSymbols = function (result) {
            if ('separator.2' === this.maskExpression && this.isNumberValue) {
                // tslint:disable-next-line:max-line-length
                return result === ''
                    ? result
                    : result === ','
                        ? null
                        : Number(this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters).replace(',', '.')).toFixed(2);
            }
            if ('dot_separator.2' === this.maskExpression && this.isNumberValue) {
                // tslint:disable-next-line:max-line-length
                return result === ''
                    ? result
                    : result === ','
                        ? null
                        : Number(this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters).replace(',', '.')).toFixed(2);
            }
            if ('comma_separator.2' === this.maskExpression && this.isNumberValue) {
                // tslint:disable-next-line:max-line-length
                return result === ''
                    ? result
                    : result === '.'
                        ? null
                        : Number(this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters)).toFixed(2);
            }
            if (this.isNumberValue) {
                return result === ''
                    ? result
                    : Number(this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters));
            }
            else if (this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters).indexOf(',') !==
                -1) {
                return this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters).replace(',', '.');
            }
            else {
                return this._removeMask(this._removeSufix(this._removePrefix(result)), this.maskSpecialCharacters);
            }
        };
        MaskService = __decorate([
            core.Injectable(),
            __param(0, core.Inject(common.DOCUMENT)),
            __param(1, core.Inject(config)),
            __metadata("design:paramtypes", [Object, Object, core.ElementRef,
                core.Renderer2])
        ], MaskService);
        return MaskService;
    }(MaskApplierService));

    var MaskDirective = /** @class */ (function () {
        function MaskDirective(
        // tslint:disable-next-line
        document, _maskService) {
            this.document = document;
            this._maskService = _maskService;
            this.maskExpression = '';
            this.specialCharacters = [];
            this.patterns = {};
            this.prefix = '';
            this.sufix = '';
            this.dropSpecialCharacters = null;
            this.hiddenInput = null;
            this.showMaskTyped = null;
            this.shownMaskExpression = null;
            this.showTemplate = null;
            this.clearIfNotMatch = null;
            this.validation = null;
            this._position = null;
            // tslint:disable-next-line
            this.onChange = function (_) { };
            this.onTouch = function () { };
        }
        MaskDirective_1 = MaskDirective;
        MaskDirective.prototype.ngOnChanges = function (changes) {
            // tslint:disable-next-line:max-line-length
            var maskExpression = changes.maskExpression, specialCharacters = changes.specialCharacters, patterns = changes.patterns, prefix = changes.prefix, sufix = changes.sufix, dropSpecialCharacters = changes.dropSpecialCharacters, hiddenInput = changes.hiddenInput, showMaskTyped = changes.showMaskTyped, shownMaskExpression = changes.shownMaskExpression, showTemplate = changes.showTemplate, clearIfNotMatch = changes.clearIfNotMatch, validation = changes.validation;
            if (maskExpression) {
                this._maskValue = changes.maskExpression.currentValue || '';
            }
            if (specialCharacters) {
                if (!specialCharacters.currentValue ||
                    !Array.isArray(specialCharacters.currentValue) ||
                    (Array.isArray(specialCharacters.currentValue) && !specialCharacters.currentValue.length)) {
                    return;
                }
                this._maskService.maskSpecialCharacters = changes.specialCharacters.currentValue || '';
            }
            if (patterns) {
                this._maskService.maskAvailablePatterns = patterns.currentValue;
            }
            if (prefix) {
                this._maskService.prefix = prefix.currentValue;
            }
            if (sufix) {
                this._maskService.sufix = sufix.currentValue;
            }
            if (dropSpecialCharacters) {
                this._maskService.dropSpecialCharacters = dropSpecialCharacters.currentValue;
            }
            if (hiddenInput) {
                this._maskService.hiddenInput = hiddenInput.currentValue;
            }
            if (showMaskTyped) {
                this._maskService.showMaskTyped = showMaskTyped.currentValue;
            }
            if (shownMaskExpression) {
                this._maskService.shownMaskExpression = shownMaskExpression.currentValue;
            }
            if (showTemplate) {
                this._maskService.showTemplate = showTemplate.currentValue;
            }
            if (clearIfNotMatch) {
                this._maskService.clearIfNotMatch = clearIfNotMatch.currentValue;
            }
            if (validation) {
                this._maskService.validation = validation.currentValue;
            }
            this._applyMask();
        };
        // tslint:disable-next-line: cyclomatic-complexity
        MaskDirective.prototype.validate = function (_a) {
            var value = _a.value;
            if (!this._maskService.validation) {
                return null;
            }
            if (this._maskService.ipError) {
                return { 'Mask error': true };
            }
            if (this._maskValue.startsWith('dot_separator') || this._maskValue.startsWith('comma_separator')) {
                return null;
            }
            if (withoutValidation.includes(this._maskValue)) {
                return null;
            }
            if (this._maskService.clearIfNotMatch) {
                return null;
            }
            if (value && value.toString().length >= 1) {
                var counterOfOpt = 0;
                var _loop_1 = function (key) {
                    if (this_1._maskService.maskAvailablePatterns[key].optional &&
                        this_1._maskService.maskAvailablePatterns[key].optional === true) {
                        if (this_1._maskValue.indexOf(key) !== this_1._maskValue.lastIndexOf(key)) {
                            var opt = this_1._maskValue.split('').filter(function (i) { return i === key; }).join('');
                            counterOfOpt += opt.length;
                        }
                        else if (this_1._maskValue.indexOf(key) !== -1) {
                            counterOfOpt++;
                        }
                        if (this_1._maskValue.indexOf(key) !== -1 &&
                            value.toString().length >= this_1._maskValue.indexOf(key)) {
                            return { value: null };
                        }
                        if (counterOfOpt === this_1._maskValue.length) {
                            return { value: null };
                        }
                    }
                };
                var this_1 = this;
                for (var key in this._maskService.maskAvailablePatterns) {
                    var state_1 = _loop_1(key);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
                if (this._maskValue.indexOf('*') === 1 ||
                    this._maskValue.indexOf('?') === 1 ||
                    this._maskValue.indexOf('{') === 1) {
                    return null;
                }
                else if ((this._maskValue.indexOf('*') > 1 && value.toString().length < this._maskValue.indexOf('*')) ||
                    (this._maskValue.indexOf('?') > 1 && value.toString().length < this._maskValue.indexOf('?'))) {
                    return { 'Mask error': true };
                }
                if (this._maskValue.indexOf('*') === -1 || this._maskValue.indexOf('?') === -1) {
                    var length_1 = this._maskService.dropSpecialCharacters
                        ? this._maskValue.length - this._maskService.checkSpecialCharAmount(this._maskValue) - counterOfOpt
                        : this._maskValue.length - counterOfOpt;
                    if (value.toString().length < length_1) {
                        return { 'Mask error': true };
                    }
                }
            }
            return null;
        };
        MaskDirective.prototype.onInput = function (e) {
            var el = e.target;
            this._inputValue = el.value;
            if (!this._maskValue) {
                this.onChange(el.value);
                return;
            }
            var position = el.selectionStart === 1
                ? el.selectionStart + this._maskService.prefix.length
                : el.selectionStart;
            var caretShift = 0;
            var backspaceShift = false;
            this._maskService.applyValueChanges(position, function (shift, _backspaceShift) {
                caretShift = shift;
                backspaceShift = _backspaceShift;
            });
            // only set the selection if the element is active
            if (this.document.activeElement !== el) {
                return;
            }
            this._position = this._position === 1 && this._inputValue.length === 1 ? null : this._position;
            el.selectionStart = el.selectionEnd =
                this._position !== null
                    ? this._position
                    : position +
                        // tslint:disable-next-line
                        (this._code === 'Backspace' && !backspaceShift ? 0 : caretShift);
            this._position = null;
        };
        MaskDirective.prototype.onBlur = function () {
            this._maskService.clearIfNotMatchFn();
            this.onTouch();
        };
        MaskDirective.prototype.onFocus = function (e) {
            var el = e.target;
            var posStart = 0;
            var posEnd = 0;
            if (el !== null &&
                el.selectionStart !== null &&
                el.selectionStart === el.selectionEnd &&
                el.selectionStart > this._maskService.prefix.length &&
                // tslint:disable-next-line
                e.keyCode !== 38)
                if (this._maskService.showMaskTyped) {
                    // ) {
                    //     return;
                    // }
                    this._maskService.maskIsShown = this._maskService.showMaskInInput();
                    if (el.setSelectionRange && this._maskService.prefix + this._maskService.maskIsShown === el.value) {
                        el.focus();
                        el.setSelectionRange(posStart, posEnd);
                    }
                    else if (el.setSelectionRange && this._maskService.maskIsShown !== el.value) {
                        el.focus();
                        el.setSelectionRange(posStart, posEnd);
                    }
                    if (this._inputValue.match('[wа-яА-Я]') || this._inputValue.match('[a-z]|[A-Z]')) ;
                }
            el.value =
                !el.value || el.value === this._maskService.prefix
                    ? this._maskService.prefix + this._maskService.maskIsShown
                    : el.value;
            /** fix of cursor position with prefix when mouse click occur */
            if ((el.selectionStart || el.selectionEnd) <= this._maskService.prefix.length) {
                el.selectionStart = this._maskService.prefix.length;
                return;
            }
        };
        MaskDirective.prototype.a = function (e) {
            this._code = e.code ? e.code : e.key;
            var el = e.target;
            this._maskService.selStart = el.selectionStart;
            this._maskService.selEnd = el.selectionEnd;
            if (e.keyCode === 38) {
                e.preventDefault();
            }
            if (e.keyCode === 37 || e.keyCode === 8) {
                if (e.keyCode === 37) {
                    el.selectionStart = el.selectionEnd - 1;
                }
                if (e.keyCode === 8 && el.value.length === 0) {
                    el.selectionStart = el.selectionEnd;
                }
                if (el.selectionStart <= this._maskService.prefix.length &&
                    el.selectionEnd <= this._maskService.prefix.length) {
                    e.preventDefault();
                }
                var cursorStart = el.selectionStart;
                // this.onFocus(e);
                if (e.keyCode === 8 && cursorStart === 0 && el.selectionEnd === el.value.length && el.value.length !== 0) {
                    this._position = this._maskService.prefix ? this._maskService.prefix.length : 0;
                    this._maskService.applyMask(this._maskService.prefix, this._maskService.maskExpression, this._position);
                }
            }
        };
        MaskDirective.prototype.onPaste = function () {
            this._position = Number.MAX_SAFE_INTEGER;
        };
        /** It writes the value in the input */
        MaskDirective.prototype.writeValue = function (inputValue) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (inputValue === undefined) {
                        inputValue = '';
                    }
                    if (typeof inputValue === 'number') {
                        inputValue = String(inputValue);
                        inputValue = this._maskValue.startsWith('dot_separator') ? inputValue.replace('.', ',') : inputValue;
                        this._maskService.isNumberValue = true;
                    }
                    (inputValue && this._maskService.maskExpression) ||
                        (this._maskService.maskExpression && (this._maskService.prefix || this._maskService.showMaskTyped))
                        ? (this._maskService.formElementProperty = [
                            'value',
                            this._maskService.applyMask(inputValue, this._maskService.maskExpression),
                        ])
                        : (this._maskService.formElementProperty = ['value', inputValue]);
                    this._inputValue = inputValue;
                    return [2 /*return*/];
                });
            });
        };
        // tslint:disable-next-line
        MaskDirective.prototype.registerOnChange = function (fn) {
            this.onChange = fn;
            this._maskService.onChange = this.onChange;
        };
        // tslint:disable-next-line
        MaskDirective.prototype.registerOnTouched = function (fn) {
            this.onTouch = fn;
        };
        /** It disables the input element */
        MaskDirective.prototype.setDisabledState = function (isDisabled) {
            this._maskService.formElementProperty = ['disabled', isDisabled];
        };
        MaskDirective.prototype._repeatPatternSymbols = function (maskExp) {
            var _this = this;
            return ((maskExp.match(/{[0-9]+}/) &&
                maskExp.split('').reduce(function (accum, currval, index) {
                    _this._start = currval === '{' ? index : _this._start;
                    if (currval !== '}') {
                        return _this._maskService._findSpecialChar(currval) ? accum + currval : accum;
                    }
                    _this._end = index;
                    var repeatNumber = Number(maskExp.slice(_this._start + 1, _this._end));
                    var repaceWith = new Array(repeatNumber + 1).join(maskExp[_this._start - 1]);
                    return accum + repaceWith;
                }, '')) ||
                maskExp);
        };
        // tslint:disable-next-line:no-any
        MaskDirective.prototype._applyMask = function () {
            this._maskService.maskExpression = this._repeatPatternSymbols(this._maskValue || '');
            this._maskService.formElementProperty = [
                'value',
                this._maskService.applyMask(this._inputValue, this._maskService.maskExpression),
            ];
        };
        var MaskDirective_1;
        __decorate([
            core.Input('mask'),
            __metadata("design:type", String)
        ], MaskDirective.prototype, "maskExpression", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MaskDirective.prototype, "specialCharacters", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MaskDirective.prototype, "patterns", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MaskDirective.prototype, "prefix", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MaskDirective.prototype, "sufix", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MaskDirective.prototype, "dropSpecialCharacters", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MaskDirective.prototype, "hiddenInput", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MaskDirective.prototype, "showMaskTyped", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MaskDirective.prototype, "shownMaskExpression", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MaskDirective.prototype, "showTemplate", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MaskDirective.prototype, "clearIfNotMatch", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MaskDirective.prototype, "validation", void 0);
        __decorate([
            core.HostListener('input', ['$event']),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], MaskDirective.prototype, "onInput", null);
        __decorate([
            core.HostListener('blur'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], MaskDirective.prototype, "onBlur", null);
        __decorate([
            core.HostListener('click', ['$event']),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], MaskDirective.prototype, "onFocus", null);
        __decorate([
            core.HostListener('keydown', ['$event']),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], MaskDirective.prototype, "a", null);
        __decorate([
            core.HostListener('paste'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], MaskDirective.prototype, "onPaste", null);
        MaskDirective = MaskDirective_1 = __decorate([
            core.Directive({
                selector: '[mask]',
                providers: [
                    {
                        provide: forms.NG_VALUE_ACCESSOR,
                        useExisting: core.forwardRef(function () { return MaskDirective_1; }),
                        multi: true,
                    },
                    {
                        provide: forms.NG_VALIDATORS,
                        useExisting: core.forwardRef(function () { return MaskDirective_1; }),
                        multi: true,
                    },
                    MaskService,
                ],
            }),
            __param(0, core.Inject(common.DOCUMENT)),
            __metadata("design:paramtypes", [Object, MaskService])
        ], MaskDirective);
        return MaskDirective;
    }());

    var MaskPipe = /** @class */ (function () {
        function MaskPipe(_maskService) {
            this._maskService = _maskService;
        }
        MaskPipe.prototype.transform = function (value, mask) {
            if (!value && typeof value !== 'number') {
                return '';
            }
            if (typeof mask === 'string') {
                return this._maskService.applyMask("" + value, mask);
            }
            return this._maskService.applyMaskWithPattern("" + value, mask);
        };
        MaskPipe = __decorate([
            core.Pipe({
                name: 'mask',
                pure: true,
            }),
            __metadata("design:paramtypes", [MaskApplierService])
        ], MaskPipe);
        return MaskPipe;
    }());

    var NgxMaskModule = /** @class */ (function () {
        function NgxMaskModule() {
        }
        NgxMaskModule_1 = NgxMaskModule;
        NgxMaskModule.forRoot = function (configValue) {
            return {
                ngModule: NgxMaskModule_1,
                providers: [
                    {
                        provide: NEW_CONFIG,
                        useValue: configValue,
                    },
                    {
                        provide: INITIAL_CONFIG,
                        useValue: initialConfig,
                    },
                    {
                        provide: config,
                        useFactory: _configFactory,
                        deps: [INITIAL_CONFIG, NEW_CONFIG],
                    },
                    MaskApplierService,
                ],
            };
        };
        NgxMaskModule.forChild = function (_configValue) {
            return {
                ngModule: NgxMaskModule_1,
            };
        };
        var NgxMaskModule_1;
        NgxMaskModule = NgxMaskModule_1 = __decorate([
            core.NgModule({
                exports: [MaskDirective, MaskPipe],
                declarations: [MaskDirective, MaskPipe],
            })
        ], NgxMaskModule);
        return NgxMaskModule;
    }());
    /**
     * @internal
     */
    function _configFactory(initConfig, configValue) {
        return configValue instanceof Function ? __assign({}, initConfig, configValue()) : __assign({}, initConfig, configValue);
    }

    exports.INITIAL_CONFIG = INITIAL_CONFIG;
    exports.MaskDirective = MaskDirective;
    exports.MaskPipe = MaskPipe;
    exports.MaskService = MaskService;
    exports.NEW_CONFIG = NEW_CONFIG;
    exports.NgxMaskModule = NgxMaskModule;
    exports._configFactory = _configFactory;
    exports.config = config;
    exports.initialConfig = initialConfig;
    exports.withoutValidation = withoutValidation;
    exports.ɵa = MaskApplierService;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ngx-mask.umd.js.map
