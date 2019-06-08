import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { config } from './config';
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
        var _a = tslib_1.__read(maskAndPattern, 2), mask = _a[0], customPattern = _a[1];
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
    MaskApplierService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(config)),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], MaskApplierService);
    return MaskApplierService;
}());
export { MaskApplierService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzay1hcHBsaWVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtbWFzay8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtbWFzay9tYXNrLWFwcGxpZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLE1BQU0sRUFBVyxNQUFNLFVBQVUsQ0FBQztBQUczQztJQW1CSSw0QkFBNkMsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQWR0RCxtQkFBYyxHQUFXLEVBQUUsQ0FBQztRQUM1QixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUN6Qix3QkFBbUIsR0FBVyxFQUFFLENBQUM7UUEyVWhDLGNBQVMsR0FBRyxVQUFDLEdBQVcsRUFBRSxJQUFZLEVBQUUsV0FBbUIsRUFBRSxTQUFpQjtZQUNsRixHQUFHLElBQUksRUFBRSxDQUFDO1lBQ1YsSUFBTSxDQUFDLEdBQWEsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMzQyxJQUFNLFFBQVEsR0FBVyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBRyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDckUsSUFBSSxHQUFHLEdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQU0sR0FBRyxHQUFXLGNBQWMsQ0FBQztZQUNuQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xCLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO2FBQzlDO1lBQ0QsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO2dCQUN6QixPQUFPLEdBQUcsR0FBRyxR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Q0FBQTs7T0FuQnpCLGtCQUFrQixDQTBZOUI7SUFBRCx5QkFBQztDQUFBLEFBMVlELElBMFlDO1NBMVlZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY29uZmlnLCBJQ29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWFza0FwcGxpZXJTZXJ2aWNlIHtcbiAgICBwdWJsaWMgZHJvcFNwZWNpYWxDaGFyYWN0ZXJzOiBJQ29uZmlnWydkcm9wU3BlY2lhbENoYXJhY3RlcnMnXTtcbiAgICBwdWJsaWMgaGlkZGVuSW5wdXQ6IElDb25maWdbJ2hpZGRlbklucHV0J107XG4gICAgcHVibGljIHNob3dUZW1wbGF0ZSE6IElDb25maWdbJ3Nob3dUZW1wbGF0ZSddO1xuICAgIHB1YmxpYyBjbGVhcklmTm90TWF0Y2ghOiBJQ29uZmlnWydjbGVhcklmTm90TWF0Y2gnXTtcbiAgICBwdWJsaWMgbWFza0V4cHJlc3Npb246IHN0cmluZyA9ICcnO1xuICAgIHB1YmxpYyBhY3R1YWxWYWx1ZTogc3RyaW5nID0gJyc7XG4gICAgcHVibGljIHNob3duTWFza0V4cHJlc3Npb246IHN0cmluZyA9ICcnO1xuICAgIHB1YmxpYyBtYXNrU3BlY2lhbENoYXJhY3RlcnMhOiBJQ29uZmlnWydzcGVjaWFsQ2hhcmFjdGVycyddO1xuICAgIHB1YmxpYyBtYXNrQXZhaWxhYmxlUGF0dGVybnMhOiBJQ29uZmlnWydwYXR0ZXJucyddO1xuICAgIHB1YmxpYyBwcmVmaXghOiBJQ29uZmlnWydwcmVmaXgnXTtcbiAgICBwdWJsaWMgc3VmaXghOiBJQ29uZmlnWydzdWZpeCddO1xuICAgIHB1YmxpYyBjdXN0b21QYXR0ZXJuITogSUNvbmZpZ1sncGF0dGVybnMnXTtcbiAgICBwdWJsaWMgaXBFcnJvcj86IGJvb2xlYW47XG4gICAgcHVibGljIHNob3dNYXNrVHlwZWQhOiBJQ29uZmlnWydzaG93TWFza1R5cGVkJ107XG4gICAgcHVibGljIHZhbGlkYXRpb246IElDb25maWdbJ3ZhbGlkYXRpb24nXTtcblxuICAgIHByaXZhdGUgX3NoaWZ0ITogU2V0PG51bWJlcj47XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoQEluamVjdChjb25maWcpIHByb3RlY3RlZCBfY29uZmlnOiBJQ29uZmlnKSB7XG4gICAgICAgIHRoaXMuX3NoaWZ0ID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmNsZWFySWZOb3RNYXRjaCA9IHRoaXMuX2NvbmZpZy5jbGVhcklmTm90TWF0Y2g7XG4gICAgICAgIHRoaXMuZHJvcFNwZWNpYWxDaGFyYWN0ZXJzID0gdGhpcy5fY29uZmlnLmRyb3BTcGVjaWFsQ2hhcmFjdGVycztcbiAgICAgICAgdGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnMgPSB0aGlzLl9jb25maWchLnNwZWNpYWxDaGFyYWN0ZXJzO1xuICAgICAgICB0aGlzLm1hc2tBdmFpbGFibGVQYXR0ZXJucyA9IHRoaXMuX2NvbmZpZy5wYXR0ZXJucztcbiAgICAgICAgdGhpcy5wcmVmaXggPSB0aGlzLl9jb25maWcucHJlZml4O1xuICAgICAgICB0aGlzLnN1Zml4ID0gdGhpcy5fY29uZmlnLnN1Zml4O1xuICAgICAgICB0aGlzLmhpZGRlbklucHV0ID0gdGhpcy5fY29uZmlnLmhpZGRlbklucHV0O1xuICAgICAgICB0aGlzLnNob3dNYXNrVHlwZWQgPSB0aGlzLl9jb25maWcuc2hvd01hc2tUeXBlZDtcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uID0gdGhpcy5fY29uZmlnLnZhbGlkYXRpb247XG4gICAgfVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBwdWJsaWMgYXBwbHlNYXNrV2l0aFBhdHRlcm4oaW5wdXRWYWx1ZTogc3RyaW5nLCBtYXNrQW5kUGF0dGVybjogW3N0cmluZywgSUNvbmZpZ1sncGF0dGVybnMnXV0pOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBbbWFzaywgY3VzdG9tUGF0dGVybl0gPSBtYXNrQW5kUGF0dGVybjtcbiAgICAgICAgdGhpcy5jdXN0b21QYXR0ZXJuID0gY3VzdG9tUGF0dGVybjtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwbHlNYXNrKGlucHV0VmFsdWUsIG1hc2spO1xuICAgIH1cbiAgICBwdWJsaWMgYXBwbHlNYXNrKFxuICAgICAgICBpbnB1dFZhbHVlOiBzdHJpbmcsXG4gICAgICAgIG1hc2tFeHByZXNzaW9uOiBzdHJpbmcsXG4gICAgICAgIHBvc2l0aW9uOiBudW1iZXIgPSAwLFxuICAgICAgICBjYjogRnVuY3Rpb24gPSAoKSA9PiB7fVxuICAgICk6IHN0cmluZyB7XG4gICAgICAgIGlmIChpbnB1dFZhbHVlID09PSB1bmRlZmluZWQgfHwgaW5wdXRWYWx1ZSA9PT0gbnVsbCB8fCBtYXNrRXhwcmVzc2lvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGN1cnNvcjogbnVtYmVyID0gMDtcbiAgICAgICAgbGV0IHJlc3VsdDogc3RyaW5nID0gYGA7XG4gICAgICAgIGxldCBtdWx0aTogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBsZXQgYmFja3NwYWNlU2hpZnQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgbGV0IHNoaWZ0OiBudW1iZXIgPSAxO1xuICAgICAgICBpZiAoaW5wdXRWYWx1ZS5zbGljZSgwLCB0aGlzLnByZWZpeC5sZW5ndGgpID09PSB0aGlzLnByZWZpeCkge1xuICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IGlucHV0VmFsdWUuc2xpY2UodGhpcy5wcmVmaXgubGVuZ3RoLCBpbnB1dFZhbHVlLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaW5wdXRBcnJheTogc3RyaW5nW10gPSBpbnB1dFZhbHVlLnRvU3RyaW5nKCkuc3BsaXQoJycpO1xuICAgICAgICBpZiAobWFza0V4cHJlc3Npb24gPT09ICdJUCcpIHtcbiAgICAgICAgICAgIHRoaXMuaXBFcnJvciA9ICEhKGlucHV0QXJyYXkuZmlsdGVyKChpOiBzdHJpbmcpID0+IGkgPT09ICcuJykubGVuZ3RoIDwgMyAmJiBpbnB1dEFycmF5Lmxlbmd0aCA8IDcpO1xuICAgICAgICAgICAgbWFza0V4cHJlc3Npb24gPSAnMDk5LjA5OS4wOTkuMDk5JztcbiAgICAgICAgfVxuICAgICAgICBpZiAobWFza0V4cHJlc3Npb24uc3RhcnRzV2l0aCgncGVyY2VudCcpKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXRWYWx1ZS5tYXRjaCgnW2Etel18W0EtWl0nKSB8fCBpbnB1dFZhbHVlLm1hdGNoKC9bLSEkJV4mKigpXyt8fj1ge31cXFtcXF06XCI7Jzw+PyxcXC9dLykpIHtcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID0gdGhpcy5fY2hlY2tJbnB1dChpbnB1dFZhbHVlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmVjaXNpb246IG51bWJlciA9IHRoaXMuZ2V0UHJlY2lzaW9uKG1hc2tFeHByZXNzaW9uKTtcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID0gdGhpcy5jaGVja0lucHV0UHJlY2lzaW9uKGlucHV0VmFsdWUsIHByZWNpc2lvbiwgJy4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnBlcmNlbnRhZ2UoaW5wdXRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBpbnB1dFZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBpbnB1dFZhbHVlLnN1YnN0cmluZygwLCBpbnB1dFZhbHVlLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgbWFza0V4cHJlc3Npb24gPT09ICdzZXBhcmF0b3InIHx8XG4gICAgICAgICAgICBtYXNrRXhwcmVzc2lvbi5zdGFydHNXaXRoKCdzZXBhcmF0b3InKSB8fFxuICAgICAgICAgICAgbWFza0V4cHJlc3Npb24gPT09ICdkb3Rfc2VwYXJhdG9yJyB8fFxuICAgICAgICAgICAgbWFza0V4cHJlc3Npb24uc3RhcnRzV2l0aCgnZG90X3NlcGFyYXRvcicpIHx8XG4gICAgICAgICAgICBtYXNrRXhwcmVzc2lvbiA9PT0gJ2NvbW1hX3NlcGFyYXRvcicgfHxcbiAgICAgICAgICAgIG1hc2tFeHByZXNzaW9uLnN0YXJ0c1dpdGgoJ2NvbW1hX3NlcGFyYXRvcicpXG4gICAgICAgICkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGlucHV0VmFsdWUubWF0Y2goJ1t30LAt0Y/QkC3Qr10nKSB8fFxuICAgICAgICAgICAgICAgIGlucHV0VmFsdWUubWF0Y2goJ1thLXpdfFtBLVpdJykgfHxcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlLm1hdGNoKC9bLUAjISQlXFxcXF4mKigpX8KjwqwnK3x+PWB7fVxcW1xcXTpcIjs8Pi4/XFwvXS8pXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID0gdGhpcy5fY2hlY2tJbnB1dChpbnB1dFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHByZWNpc2lvbjogbnVtYmVyID0gdGhpcy5nZXRQcmVjaXNpb24obWFza0V4cHJlc3Npb24pO1xuICAgICAgICAgICAgbGV0IHN0ckZvclNlcDogc3RyaW5nO1xuICAgICAgICAgICAgaWYgKG1hc2tFeHByZXNzaW9uLnN0YXJ0c1dpdGgoJ3NlcGFyYXRvcicpKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbHVlLmluY2x1ZGVzKCcsJykgJiZcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZS5lbmRzV2l0aCgnLCcpICYmXG4gICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWUuaW5kZXhPZignLCcpICE9PSBpbnB1dFZhbHVlLmxhc3RJbmRleE9mKCcsJylcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IGlucHV0VmFsdWUuc3Vic3RyaW5nKDAsIGlucHV0VmFsdWUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hc2tFeHByZXNzaW9uLnN0YXJ0c1dpdGgoJ2RvdF9zZXBhcmF0b3InKSkge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZS5pbmRleE9mKCcuJykgIT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWUuaW5kZXhPZignLicpID09PSBpbnB1dFZhbHVlLmxhc3RJbmRleE9mKCcuJykgJiZcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZS5pbmRleE9mKCcuJykgPiAzXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWUgPSBpbnB1dFZhbHVlLnJlcGxhY2UoJy4nLCAnLCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID1cbiAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZS5sZW5ndGggPiAxICYmIGlucHV0VmFsdWVbMF0gPT09ICcwJyAmJiBpbnB1dFZhbHVlWzFdICE9PSAnLCdcbiAgICAgICAgICAgICAgICAgICAgICAgID8gaW5wdXRWYWx1ZS5zbGljZSgxLCBpbnB1dFZhbHVlLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIDogaW5wdXRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXNrRXhwcmVzc2lvbi5zdGFydHNXaXRoKCdjb21tYV9zZXBhcmF0b3InKSkge1xuICAgICAgICAgICAgICAgIGlucHV0VmFsdWUgPVxuICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbHVlLmxlbmd0aCA+IDEgJiYgaW5wdXRWYWx1ZVswXSA9PT0gJzAnICYmIGlucHV0VmFsdWVbMV0gIT09ICcuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgPyBpbnB1dFZhbHVlLnNsaWNlKDEsIGlucHV0VmFsdWUubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBpbnB1dFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hc2tFeHByZXNzaW9uID09PSAnc2VwYXJhdG9yJyB8fCBtYXNrRXhwcmVzc2lvbi5zdGFydHNXaXRoKCdzZXBhcmF0b3InKSkge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dFZhbHVlLm1hdGNoKC9bQCMhJCVeJiooKV8rfH49YHt9XFxbXFxdOixcIjs8Pj9cXC9dLykpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IGlucHV0VmFsdWUuc3Vic3RyaW5nKDAsIGlucHV0VmFsdWUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlucHV0VmFsdWUgPSB0aGlzLmNoZWNrSW5wdXRQcmVjaXNpb24oaW5wdXRWYWx1ZSwgcHJlY2lzaW9uLCAnLicpO1xuICAgICAgICAgICAgICAgIHN0ckZvclNlcCA9IGlucHV0VmFsdWUucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLnNlcGFyYXRvcihzdHJGb3JTZXAsICcgJywgJy4nLCBwcmVjaXNpb24pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXNrRXhwcmVzc2lvbiA9PT0gJ2RvdF9zZXBhcmF0b3InIHx8IG1hc2tFeHByZXNzaW9uLnN0YXJ0c1dpdGgoJ2RvdF9zZXBhcmF0b3InKSkge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dFZhbHVlLm1hdGNoKC9bQCMhJCVeJiooKV8rfH49YHt9XFxbXFxdOlxcc1wiOzw+P1xcL10vKSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID0gaW5wdXRWYWx1ZS5zdWJzdHJpbmcoMCwgaW5wdXRWYWx1ZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IHRoaXMuY2hlY2tJbnB1dFByZWNpc2lvbihpbnB1dFZhbHVlLCBwcmVjaXNpb24sICcsJyk7XG4gICAgICAgICAgICAgICAgc3RyRm9yU2VwID0gaW5wdXRWYWx1ZS5yZXBsYWNlKC9cXC4vZywgJycpO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuc2VwYXJhdG9yKHN0ckZvclNlcCwgJy4nLCAnLCcsIHByZWNpc2lvbik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1hc2tFeHByZXNzaW9uID09PSAnY29tbWFfc2VwYXJhdG9yJyB8fCBtYXNrRXhwcmVzc2lvbi5zdGFydHNXaXRoKCdjb21tYV9zZXBhcmF0b3InKSkge1xuICAgICAgICAgICAgICAgIHN0ckZvclNlcCA9IGlucHV0VmFsdWUucmVwbGFjZSgvLC9nLCAnJyk7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5zZXBhcmF0b3Ioc3RyRm9yU2VwLCAnLCcsICcuJywgcHJlY2lzaW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY29tbWFTaGlmdDogbnVtYmVyID0gcmVzdWx0LmluZGV4T2YoJywnKSAtIGlucHV0VmFsdWUuaW5kZXhPZignLCcpO1xuICAgICAgICAgICAgY29uc3Qgc2hpZnRTdGVwOiBudW1iZXIgPSByZXN1bHQubGVuZ3RoIC0gaW5wdXRWYWx1ZS5sZW5ndGg7XG5cbiAgICAgICAgICAgIGlmIChzaGlmdFN0ZXAgPiAwICYmIHJlc3VsdFtwb3NpdGlvbl0gIT09ICcsJykge1xuICAgICAgICAgICAgICAgIGJhY2tzcGFjZVNoaWZ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBsZXQgX3NoaWZ0OiBudW1iZXIgPSAwO1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hpZnQuYWRkKHBvc2l0aW9uICsgX3NoaWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgX3NoaWZ0Kys7XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoX3NoaWZ0IDwgc2hpZnRTdGVwKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgKGNvbW1hU2hpZnQgIT09IDAgJiYgcG9zaXRpb24gPiAwICYmICEocmVzdWx0LmluZGV4T2YoJywnKSA+PSBwb3NpdGlvbiAmJiBwb3NpdGlvbiA+IDMpKSB8fFxuICAgICAgICAgICAgICAgICghKHJlc3VsdC5pbmRleE9mKCcuJykgPj0gcG9zaXRpb24gJiYgcG9zaXRpb24gPiAzKSAmJiBzaGlmdFN0ZXAgPD0gMClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NoaWZ0LmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgYmFja3NwYWNlU2hpZnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNoaWZ0ID0gc2hpZnRTdGVwO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uICs9IHNoaWZ0U3RlcDtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaGlmdC5hZGQocG9zaXRpb24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaGlmdC5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChcbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgICAgICAgICBsZXQgaTogbnVtYmVyID0gMCwgaW5wdXRTeW1ib2w6IHN0cmluZyA9IGlucHV0QXJyYXlbMF07XG4gICAgICAgICAgICAgICAgaSA8IGlucHV0QXJyYXkubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGkrKywgaW5wdXRTeW1ib2wgPSBpbnB1dEFycmF5W2ldXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyc29yID09PSBtYXNrRXhwcmVzc2lvbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jaGVja1N5bWJvbE1hc2soaW5wdXRTeW1ib2wsIG1hc2tFeHByZXNzaW9uW2N1cnNvcl0pICYmIG1hc2tFeHByZXNzaW9uW2N1cnNvciArIDFdID09PSAnPycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IGlucHV0U3ltYm9sO1xuICAgICAgICAgICAgICAgICAgICBjdXJzb3IgKz0gMjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICBtYXNrRXhwcmVzc2lvbltjdXJzb3IgKyAxXSA9PT0gJyonICYmXG4gICAgICAgICAgICAgICAgICAgIG11bHRpICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrU3ltYm9sTWFzayhpbnB1dFN5bWJvbCwgbWFza0V4cHJlc3Npb25bY3Vyc29yICsgMl0pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBpbnB1dFN5bWJvbDtcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yICs9IDM7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tTeW1ib2xNYXNrKGlucHV0U3ltYm9sLCBtYXNrRXhwcmVzc2lvbltjdXJzb3JdKSAmJlxuICAgICAgICAgICAgICAgICAgICBtYXNrRXhwcmVzc2lvbltjdXJzb3IgKyAxXSA9PT0gJyonXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBpbnB1dFN5bWJvbDtcbiAgICAgICAgICAgICAgICAgICAgbXVsdGkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIG1hc2tFeHByZXNzaW9uW2N1cnNvciArIDFdID09PSAnPycgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tTeW1ib2xNYXNrKGlucHV0U3ltYm9sLCBtYXNrRXhwcmVzc2lvbltjdXJzb3IgKyAyXSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IGlucHV0U3ltYm9sO1xuICAgICAgICAgICAgICAgICAgICBjdXJzb3IgKz0gMztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGVja1N5bWJvbE1hc2soaW5wdXRTeW1ib2wsIG1hc2tFeHByZXNzaW9uW2N1cnNvcl0pIHx8XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmhpZGRlbklucHV0ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hc2tBdmFpbGFibGVQYXR0ZXJuc1ttYXNrRXhwcmVzc2lvbltjdXJzb3JdXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXNrQXZhaWxhYmxlUGF0dGVybnNbbWFza0V4cHJlc3Npb25bY3Vyc29yXV0uc3ltYm9sID09PSBpbnB1dFN5bWJvbClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hc2tFeHByZXNzaW9uW2N1cnNvcl0gPT09ICdIJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlcihpbnB1dFN5bWJvbCkgPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hpZnRTdGVwOiBudW1iZXIgPSAvWyo/XS9nLnRlc3QobWFza0V4cHJlc3Npb24uc2xpY2UoMCwgY3Vyc29yKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBpbnB1dEFycmF5Lmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnNvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGlmdC5hZGQoc2hpZnRTdGVwICsgdGhpcy5wcmVmaXgubGVuZ3RoIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobWFza0V4cHJlc3Npb25bY3Vyc29yXSA9PT0gJ2gnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09PSAnMicgJiYgTnVtYmVyKGlucHV0U3ltYm9sKSA+IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobWFza0V4cHJlc3Npb25bY3Vyc29yXSA9PT0gJ20nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyKGlucHV0U3ltYm9sKSA+IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3IgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGlmdFN0ZXA6IG51bWJlciA9IC9bKj9dL2cudGVzdChtYXNrRXhwcmVzc2lvbi5zbGljZSgwLCBjdXJzb3IpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGlucHV0QXJyYXkubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogY3Vyc29yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoaWZ0LmFkZChzaGlmdFN0ZXAgKyB0aGlzLnByZWZpeC5sZW5ndGggfHwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXNrRXhwcmVzc2lvbltjdXJzb3JdID09PSAncycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIoaW5wdXRTeW1ib2wpID4gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvciArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoaWZ0U3RlcDogbnVtYmVyID0gL1sqP10vZy50ZXN0KG1hc2tFeHByZXNzaW9uLnNsaWNlKDAsIGN1cnNvcikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gaW5wdXRBcnJheS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjdXJzb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hpZnQuYWRkKHNoaWZ0U3RlcCArIHRoaXMucHJlZml4Lmxlbmd0aCB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hc2tFeHByZXNzaW9uW2N1cnNvcl0gPT09ICdkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlcihpbnB1dFN5bWJvbCkgPiAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hpZnRTdGVwOiBudW1iZXIgPSAvWyo/XS9nLnRlc3QobWFza0V4cHJlc3Npb24uc2xpY2UoMCwgY3Vyc29yKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBpbnB1dEFycmF5Lmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnNvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGlmdC5hZGQoc2hpZnRTdGVwICsgdGhpcy5wcmVmaXgubGVuZ3RoIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobWFza0V4cHJlc3Npb25bY3Vyc29yIC0gMV0gPT09ICdkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlcihpbnB1dFZhbHVlLnNsaWNlKGN1cnNvciAtIDEsIGN1cnNvciArIDEpKSA+IDMxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hc2tFeHByZXNzaW9uW2N1cnNvcl0gPT09ICdNJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlcihpbnB1dFN5bWJvbCkgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hpZnRTdGVwOiBudW1iZXIgPSAvWyo/XS9nLnRlc3QobWFza0V4cHJlc3Npb24uc2xpY2UoMCwgY3Vyc29yKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBpbnB1dEFycmF5Lmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnNvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGlmdC5hZGQoc2hpZnRTdGVwICsgdGhpcy5wcmVmaXgubGVuZ3RoIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobWFza0V4cHJlc3Npb25bY3Vyc29yIC0gMV0gPT09ICdNJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlcihpbnB1dFZhbHVlLnNsaWNlKGN1cnNvciAtIDEsIGN1cnNvciArIDEpKSA+IDEyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IGlucHV0U3ltYm9sO1xuICAgICAgICAgICAgICAgICAgICBjdXJzb3IrKztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWFza1NwZWNpYWxDaGFyYWN0ZXJzLmluZGV4T2YobWFza0V4cHJlc3Npb25bY3Vyc29yXSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBtYXNrRXhwcmVzc2lvbltjdXJzb3JdO1xuICAgICAgICAgICAgICAgICAgICBjdXJzb3IrKztcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hpZnRTdGVwOiBudW1iZXIgPSAvWyo/XS9nLnRlc3QobWFza0V4cHJlc3Npb24uc2xpY2UoMCwgY3Vyc29yKSlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gaW5wdXRBcnJheS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgIDogY3Vyc29yO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGlmdC5hZGQoc2hpZnRTdGVwICsgdGhpcy5wcmVmaXgubGVuZ3RoIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnMuaW5kZXhPZihpbnB1dFN5bWJvbCkgPiAtMSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hc2tBdmFpbGFibGVQYXR0ZXJuc1ttYXNrRXhwcmVzc2lvbltjdXJzb3JdXSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hc2tBdmFpbGFibGVQYXR0ZXJuc1ttYXNrRXhwcmVzc2lvbltjdXJzb3JdXS5vcHRpb25hbFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBjdXJzb3IrKztcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFza0V4cHJlc3Npb25bY3Vyc29yICsgMV0gPT09ICcqJyAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9maW5kU3BlY2lhbENoYXIodGhpcy5tYXNrRXhwcmVzc2lvbltjdXJzb3IgKyAyXSkgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmluZFNwZWNpYWxDaGFyKGlucHV0U3ltYm9sKSA9PT0gdGhpcy5tYXNrRXhwcmVzc2lvbltjdXJzb3IgKyAyXSAmJlxuICAgICAgICAgICAgICAgICAgICBtdWx0aVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBjdXJzb3IgKz0gMztcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IGlucHV0U3ltYm9sO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFza0V4cHJlc3Npb25bY3Vyc29yICsgMV0gPT09ICc/JyAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9maW5kU3BlY2lhbENoYXIodGhpcy5tYXNrRXhwcmVzc2lvbltjdXJzb3IgKyAyXSkgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmluZFNwZWNpYWxDaGFyKGlucHV0U3ltYm9sKSA9PT0gdGhpcy5tYXNrRXhwcmVzc2lvbltjdXJzb3IgKyAyXSAmJlxuICAgICAgICAgICAgICAgICAgICBtdWx0aVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBjdXJzb3IgKz0gMztcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IGlucHV0U3ltYm9sO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICByZXN1bHQubGVuZ3RoICsgMSA9PT0gbWFza0V4cHJlc3Npb24ubGVuZ3RoICYmXG4gICAgICAgICAgICB0aGlzLm1hc2tTcGVjaWFsQ2hhcmFjdGVycy5pbmRleE9mKG1hc2tFeHByZXNzaW9uW21hc2tFeHByZXNzaW9uLmxlbmd0aCAtIDFdKSAhPT0gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gbWFza0V4cHJlc3Npb25bbWFza0V4cHJlc3Npb24ubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbmV3UG9zaXRpb246IG51bWJlciA9IHBvc2l0aW9uICsgMTtcblxuICAgICAgICB3aGlsZSAodGhpcy5fc2hpZnQuaGFzKG5ld1Bvc2l0aW9uKSkge1xuICAgICAgICAgICAgc2hpZnQrKztcbiAgICAgICAgICAgIG5ld1Bvc2l0aW9uKys7XG4gICAgICAgIH1cblxuICAgICAgICBjYih0aGlzLl9zaGlmdC5oYXMocG9zaXRpb24pID8gc2hpZnQgOiAwLCBiYWNrc3BhY2VTaGlmdCk7XG4gICAgICAgIGlmIChzaGlmdCA8IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3NoaWZ0LmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlczogc3RyaW5nID0gdGhpcy5zdWZpeCA/IGAke3RoaXMucHJlZml4fSR7cmVzdWx0fSR7dGhpcy5zdWZpeH1gIDogYCR7dGhpcy5wcmVmaXh9JHtyZXN1bHR9YDtcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJlcyA9IGAke3RoaXMucHJlZml4fSR7cmVzdWx0fWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgcHVibGljIF9maW5kU3BlY2lhbENoYXIoaW5wdXRTeW1ib2w6IHN0cmluZyk6IHVuZGVmaW5lZCB8IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hc2tTcGVjaWFsQ2hhcmFjdGVycy5maW5kKCh2YWw6IHN0cmluZykgPT4gdmFsID09PSBpbnB1dFN5bWJvbCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF9jaGVja1N5bWJvbE1hc2soaW5wdXRTeW1ib2w6IHN0cmluZywgbWFza1N5bWJvbDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHRoaXMubWFza0F2YWlsYWJsZVBhdHRlcm5zID0gdGhpcy5jdXN0b21QYXR0ZXJuID8gdGhpcy5jdXN0b21QYXR0ZXJuIDogdGhpcy5tYXNrQXZhaWxhYmxlUGF0dGVybnM7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLm1hc2tBdmFpbGFibGVQYXR0ZXJuc1ttYXNrU3ltYm9sXSAmJlxuICAgICAgICAgICAgdGhpcy5tYXNrQXZhaWxhYmxlUGF0dGVybnNbbWFza1N5bWJvbF0ucGF0dGVybiAmJlxuICAgICAgICAgICAgdGhpcy5tYXNrQXZhaWxhYmxlUGF0dGVybnNbbWFza1N5bWJvbF0ucGF0dGVybi50ZXN0KGlucHV0U3ltYm9sKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2VwYXJhdG9yID0gKHN0cjogc3RyaW5nLCBjaGFyOiBzdHJpbmcsIGRlY2ltYWxDaGFyOiBzdHJpbmcsIHByZWNpc2lvbjogbnVtYmVyKSA9PiB7XG4gICAgICAgIHN0ciArPSAnJztcbiAgICAgICAgY29uc3QgeDogc3RyaW5nW10gPSBzdHIuc3BsaXQoZGVjaW1hbENoYXIpO1xuICAgICAgICBjb25zdCBkZWNpbWFsczogc3RyaW5nID0geC5sZW5ndGggPiAxID8gYCR7ZGVjaW1hbENoYXJ9JHt4WzFdfWAgOiAnJztcbiAgICAgICAgbGV0IHJlczogc3RyaW5nID0geFswXTtcbiAgICAgICAgY29uc3Qgcmd4OiBSZWdFeHAgPSAvKFxcZCspKFxcZHszfSkvO1xuICAgICAgICB3aGlsZSAocmd4LnRlc3QocmVzKSkge1xuICAgICAgICAgICAgcmVzID0gcmVzLnJlcGxhY2Uocmd4LCAnJDEnICsgY2hhciArICckMicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcmVjaXNpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcyArIGRlY2ltYWxzO1xuICAgICAgICB9IGVsc2UgaWYgKHByZWNpc2lvbiA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzICsgZGVjaW1hbHMuc3Vic3RyKDAsIHByZWNpc2lvbiArIDEpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHBlcmNlbnRhZ2UgPSAoc3RyOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICAgICAgcmV0dXJuIE51bWJlcihzdHIpID49IDAgJiYgTnVtYmVyKHN0cikgPD0gMTAwO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGdldFByZWNpc2lvbiA9IChtYXNrRXhwcmVzc2lvbjogc3RyaW5nKTogbnVtYmVyID0+IHtcbiAgICAgICAgY29uc3QgeDogc3RyaW5nW10gPSBtYXNrRXhwcmVzc2lvbi5zcGxpdCgnLicpO1xuICAgICAgICBpZiAoeC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyKHhbeC5sZW5ndGggLSAxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEluZmluaXR5O1xuICAgIH07XG5cbiAgICBwcml2YXRlIGNoZWNrSW5wdXRQcmVjaXNpb24gPSAoaW5wdXRWYWx1ZTogc3RyaW5nLCBwcmVjaXNpb246IG51bWJlciwgZGVjaW1hbE1hcmtlcjogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgaWYgKHByZWNpc2lvbiA8IEluZmluaXR5KSB7XG4gICAgICAgICAgICBsZXQgcHJlY2lzaW9uUmVnRXg6IFJlZ0V4cDtcblxuICAgICAgICAgICAgaWYgKGRlY2ltYWxNYXJrZXIgPT09ICcuJykge1xuICAgICAgICAgICAgICAgIHByZWNpc2lvblJlZ0V4ID0gbmV3IFJlZ0V4cChgXFxcXC5cXFxcZHske3ByZWNpc2lvbn19LiokYCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHByZWNpc2lvblJlZ0V4ID0gbmV3IFJlZ0V4cChgLFxcXFxkeyR7cHJlY2lzaW9ufX0uKiRgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcHJlY2lzaW9uTWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsID0gaW5wdXRWYWx1ZS5tYXRjaChwcmVjaXNpb25SZWdFeCk7XG4gICAgICAgICAgICBpZiAocHJlY2lzaW9uTWF0Y2ggJiYgcHJlY2lzaW9uTWF0Y2hbMF0ubGVuZ3RoIC0gMSA+IHByZWNpc2lvbikge1xuICAgICAgICAgICAgICAgIGlucHV0VmFsdWUgPSBpbnB1dFZhbHVlLnN1YnN0cmluZygwLCBpbnB1dFZhbHVlLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcmVjaXNpb24gPT09IDAgJiYgaW5wdXRWYWx1ZS5lbmRzV2l0aChkZWNpbWFsTWFya2VyKSkge1xuICAgICAgICAgICAgICAgIGlucHV0VmFsdWUgPSBpbnB1dFZhbHVlLnN1YnN0cmluZygwLCBpbnB1dFZhbHVlLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dFZhbHVlO1xuICAgIH07XG5cbiAgICBwcml2YXRlIF9jaGVja0lucHV0KHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHN0clxuICAgICAgICAgICAgLnNwbGl0KCcnKVxuICAgICAgICAgICAgLmZpbHRlcigoaTogc3RyaW5nKSA9PiBpLm1hdGNoKCdcXFxcZCcpIHx8IGkgPT09ICcuJyB8fCBpID09PSAnLCcpXG4gICAgICAgICAgICAuam9pbignJyk7XG4gICAgfVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbWF4LWZpbGUtbGluZS1jb3VudFxufVxuIl19