import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { config } from './config';
let MaskApplierService = class MaskApplierService {
    constructor(_config) {
        this._config = _config;
        this.maskExpression = '';
        this.actualValue = '';
        this.shownMaskExpression = '';
        this.separator = (str, char, decimalChar, precision) => {
            str += '';
            const x = str.split(decimalChar);
            const decimals = x.length > 1 ? `${decimalChar}${x[1]}` : '';
            let res = x[0];
            const rgx = /(\d+)(\d{3})/;
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
        this.percentage = (str) => {
            return Number(str) >= 0 && Number(str) <= 100;
        };
        this.getPrecision = (maskExpression) => {
            const x = maskExpression.split('.');
            if (x.length > 1) {
                return Number(x[x.length - 1]);
            }
            return Infinity;
        };
        this.checkInputPrecision = (inputValue, precision, decimalMarker) => {
            if (precision < Infinity) {
                let precisionRegEx;
                if (decimalMarker === '.') {
                    precisionRegEx = new RegExp(`\\.\\d{${precision}}.*$`);
                }
                else {
                    precisionRegEx = new RegExp(`,\\d{${precision}}.*$`);
                }
                const precisionMatch = inputValue.match(precisionRegEx);
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
    applyMaskWithPattern(inputValue, maskAndPattern) {
        const [mask, customPattern] = maskAndPattern;
        this.customPattern = customPattern;
        return this.applyMask(inputValue, mask);
    }
    applyMask(inputValue, maskExpression, position = 0, cb = () => { }) {
        if (inputValue === undefined || inputValue === null || maskExpression === undefined) {
            return '';
        }
        let cursor = 0;
        let result = ``;
        let multi = false;
        let backspaceShift = false;
        let shift = 1;
        if (inputValue.slice(0, this.prefix.length) === this.prefix) {
            inputValue = inputValue.slice(this.prefix.length, inputValue.length);
        }
        const inputArray = inputValue.toString().split('');
        if (maskExpression === 'IP') {
            this.ipError = !!(inputArray.filter((i) => i === '.').length < 3 && inputArray.length < 7);
            maskExpression = '099.099.099.099';
        }
        if (maskExpression.startsWith('percent')) {
            if (inputValue.match('[a-z]|[A-Z]') || inputValue.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,\/]/)) {
                inputValue = this._checkInput(inputValue);
                const precision = this.getPrecision(maskExpression);
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
            const precision = this.getPrecision(maskExpression);
            let strForSep;
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
            const commaShift = result.indexOf(',') - inputValue.indexOf(',');
            const shiftStep = result.length - inputValue.length;
            if (shiftStep > 0 && result[position] !== ',') {
                backspaceShift = true;
                let _shift = 0;
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
            let i = 0, inputSymbol = inputArray[0]; i < inputArray.length; i++, inputSymbol = inputArray[i]) {
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
                            const shiftStep = /[*?]/g.test(maskExpression.slice(0, cursor))
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
                            const shiftStep = /[*?]/g.test(maskExpression.slice(0, cursor))
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
                            const shiftStep = /[*?]/g.test(maskExpression.slice(0, cursor))
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
                            const shiftStep = /[*?]/g.test(maskExpression.slice(0, cursor))
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
                            const shiftStep = /[*?]/g.test(maskExpression.slice(0, cursor))
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
                    const shiftStep = /[*?]/g.test(maskExpression.slice(0, cursor))
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
        let newPosition = position + 1;
        while (this._shift.has(newPosition)) {
            shift++;
            newPosition++;
        }
        cb(this._shift.has(position) ? shift : 0, backspaceShift);
        if (shift < 0) {
            this._shift.clear();
        }
        let res = this.sufix ? `${this.prefix}${result}${this.sufix}` : `${this.prefix}${result}`;
        if (result.length === 0) {
            res = `${this.prefix}${result}`;
        }
        return res;
    }
    _findSpecialChar(inputSymbol) {
        return this.maskSpecialCharacters.find((val) => val === inputSymbol);
    }
    _checkSymbolMask(inputSymbol, maskSymbol) {
        this.maskAvailablePatterns = this.customPattern ? this.customPattern : this.maskAvailablePatterns;
        return (this.maskAvailablePatterns[maskSymbol] &&
            this.maskAvailablePatterns[maskSymbol].pattern &&
            this.maskAvailablePatterns[maskSymbol].pattern.test(inputSymbol));
    }
    _checkInput(str) {
        return str
            .split('')
            .filter((i) => i.match('\\d') || i === '.' || i === ',')
            .join('');
    }
};
MaskApplierService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__param(0, Inject(config)),
    tslib_1.__metadata("design:paramtypes", [Object])
], MaskApplierService);
export { MaskApplierService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzay1hcHBsaWVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtbWFzay8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtbWFzay9tYXNrLWFwcGxpZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLE1BQU0sRUFBVyxNQUFNLFVBQVUsQ0FBQztBQUczQyxJQUFhLGtCQUFrQixHQUEvQixNQUFhLGtCQUFrQjtJQW1CM0IsWUFBNkMsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQWR0RCxtQkFBYyxHQUFXLEVBQUUsQ0FBQztRQUM1QixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUN6Qix3QkFBbUIsR0FBVyxFQUFFLENBQUM7UUEyVWhDLGNBQVMsR0FBRyxDQUFDLEdBQVcsRUFBRSxJQUFZLEVBQUUsV0FBbUIsRUFBRSxTQUFpQixFQUFFLEVBQUU7WUFDdEYsR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUNWLE1BQU0sQ0FBQyxHQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDM0MsTUFBTSxRQUFRLEdBQVcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDckUsSUFBSSxHQUFHLEdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sR0FBRyxHQUFXLGNBQWMsQ0FBQztZQUNuQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xCLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO2FBQzlDO1lBQ0QsSUFB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QUFDLE1BQU0sQ0FBQyxDQUFBOztHQW5CekIsa0JBQWtCLENBMFk5QjtTQTFZWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNvbmZpZywgSUNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hc2tBcHBsaWVyU2VydmljZSB7XG4gICAgcHVibGljIGRyb3BTcGVjaWFsQ2hhcmFjdGVyczogSUNvbmZpZ1snZHJvcFNwZWNpYWxDaGFyYWN0ZXJzJ107XG4gICAgcHVibGljIGhpZGRlbklucHV0OiBJQ29uZmlnWydoaWRkZW5JbnB1dCddO1xuICAgIHB1YmxpYyBzaG93VGVtcGxhdGUhOiBJQ29uZmlnWydzaG93VGVtcGxhdGUnXTtcbiAgICBwdWJsaWMgY2xlYXJJZk5vdE1hdGNoITogSUNvbmZpZ1snY2xlYXJJZk5vdE1hdGNoJ107XG4gICAgcHVibGljIG1hc2tFeHByZXNzaW9uOiBzdHJpbmcgPSAnJztcbiAgICBwdWJsaWMgYWN0dWFsVmFsdWU6IHN0cmluZyA9ICcnO1xuICAgIHB1YmxpYyBzaG93bk1hc2tFeHByZXNzaW9uOiBzdHJpbmcgPSAnJztcbiAgICBwdWJsaWMgbWFza1NwZWNpYWxDaGFyYWN0ZXJzITogSUNvbmZpZ1snc3BlY2lhbENoYXJhY3RlcnMnXTtcbiAgICBwdWJsaWMgbWFza0F2YWlsYWJsZVBhdHRlcm5zITogSUNvbmZpZ1sncGF0dGVybnMnXTtcbiAgICBwdWJsaWMgcHJlZml4ITogSUNvbmZpZ1sncHJlZml4J107XG4gICAgcHVibGljIHN1Zml4ITogSUNvbmZpZ1snc3VmaXgnXTtcbiAgICBwdWJsaWMgY3VzdG9tUGF0dGVybiE6IElDb25maWdbJ3BhdHRlcm5zJ107XG4gICAgcHVibGljIGlwRXJyb3I/OiBib29sZWFuO1xuICAgIHB1YmxpYyBzaG93TWFza1R5cGVkITogSUNvbmZpZ1snc2hvd01hc2tUeXBlZCddO1xuICAgIHB1YmxpYyB2YWxpZGF0aW9uOiBJQ29uZmlnWyd2YWxpZGF0aW9uJ107XG5cbiAgICBwcml2YXRlIF9zaGlmdCE6IFNldDxudW1iZXI+O1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKEBJbmplY3QoY29uZmlnKSBwcm90ZWN0ZWQgX2NvbmZpZzogSUNvbmZpZykge1xuICAgICAgICB0aGlzLl9zaGlmdCA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5jbGVhcklmTm90TWF0Y2ggPSB0aGlzLl9jb25maWcuY2xlYXJJZk5vdE1hdGNoO1xuICAgICAgICB0aGlzLmRyb3BTcGVjaWFsQ2hhcmFjdGVycyA9IHRoaXMuX2NvbmZpZy5kcm9wU3BlY2lhbENoYXJhY3RlcnM7XG4gICAgICAgIHRoaXMubWFza1NwZWNpYWxDaGFyYWN0ZXJzID0gdGhpcy5fY29uZmlnIS5zcGVjaWFsQ2hhcmFjdGVycztcbiAgICAgICAgdGhpcy5tYXNrQXZhaWxhYmxlUGF0dGVybnMgPSB0aGlzLl9jb25maWcucGF0dGVybnM7XG4gICAgICAgIHRoaXMucHJlZml4ID0gdGhpcy5fY29uZmlnLnByZWZpeDtcbiAgICAgICAgdGhpcy5zdWZpeCA9IHRoaXMuX2NvbmZpZy5zdWZpeDtcbiAgICAgICAgdGhpcy5oaWRkZW5JbnB1dCA9IHRoaXMuX2NvbmZpZy5oaWRkZW5JbnB1dDtcbiAgICAgICAgdGhpcy5zaG93TWFza1R5cGVkID0gdGhpcy5fY29uZmlnLnNob3dNYXNrVHlwZWQ7XG4gICAgICAgIHRoaXMudmFsaWRhdGlvbiA9IHRoaXMuX2NvbmZpZy52YWxpZGF0aW9uO1xuICAgIH1cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgcHVibGljIGFwcGx5TWFza1dpdGhQYXR0ZXJuKGlucHV0VmFsdWU6IHN0cmluZywgbWFza0FuZFBhdHRlcm46IFtzdHJpbmcsIElDb25maWdbJ3BhdHRlcm5zJ11dKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgW21hc2ssIGN1c3RvbVBhdHRlcm5dID0gbWFza0FuZFBhdHRlcm47XG4gICAgICAgIHRoaXMuY3VzdG9tUGF0dGVybiA9IGN1c3RvbVBhdHRlcm47XG4gICAgICAgIHJldHVybiB0aGlzLmFwcGx5TWFzayhpbnB1dFZhbHVlLCBtYXNrKTtcbiAgICB9XG4gICAgcHVibGljIGFwcGx5TWFzayhcbiAgICAgICAgaW5wdXRWYWx1ZTogc3RyaW5nLFxuICAgICAgICBtYXNrRXhwcmVzc2lvbjogc3RyaW5nLFxuICAgICAgICBwb3NpdGlvbjogbnVtYmVyID0gMCxcbiAgICAgICAgY2I6IEZ1bmN0aW9uID0gKCkgPT4ge31cbiAgICApOiBzdHJpbmcge1xuICAgICAgICBpZiAoaW5wdXRWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGlucHV0VmFsdWUgPT09IG51bGwgfHwgbWFza0V4cHJlc3Npb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjdXJzb3I6IG51bWJlciA9IDA7XG4gICAgICAgIGxldCByZXN1bHQ6IHN0cmluZyA9IGBgO1xuICAgICAgICBsZXQgbXVsdGk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgbGV0IGJhY2tzcGFjZVNoaWZ0OiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGxldCBzaGlmdDogbnVtYmVyID0gMTtcbiAgICAgICAgaWYgKGlucHV0VmFsdWUuc2xpY2UoMCwgdGhpcy5wcmVmaXgubGVuZ3RoKSA9PT0gdGhpcy5wcmVmaXgpIHtcbiAgICAgICAgICAgIGlucHV0VmFsdWUgPSBpbnB1dFZhbHVlLnNsaWNlKHRoaXMucHJlZml4Lmxlbmd0aCwgaW5wdXRWYWx1ZS5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGlucHV0QXJyYXk6IHN0cmluZ1tdID0gaW5wdXRWYWx1ZS50b1N0cmluZygpLnNwbGl0KCcnKTtcbiAgICAgICAgaWYgKG1hc2tFeHByZXNzaW9uID09PSAnSVAnKSB7XG4gICAgICAgICAgICB0aGlzLmlwRXJyb3IgPSAhIShpbnB1dEFycmF5LmZpbHRlcigoaTogc3RyaW5nKSA9PiBpID09PSAnLicpLmxlbmd0aCA8IDMgJiYgaW5wdXRBcnJheS5sZW5ndGggPCA3KTtcbiAgICAgICAgICAgIG1hc2tFeHByZXNzaW9uID0gJzA5OS4wOTkuMDk5LjA5OSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hc2tFeHByZXNzaW9uLnN0YXJ0c1dpdGgoJ3BlcmNlbnQnKSkge1xuICAgICAgICAgICAgaWYgKGlucHV0VmFsdWUubWF0Y2goJ1thLXpdfFtBLVpdJykgfHwgaW5wdXRWYWx1ZS5tYXRjaCgvWy0hJCVeJiooKV8rfH49YHt9XFxbXFxdOlwiOyc8Pj8sXFwvXS8pKSB7XG4gICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IHRoaXMuX2NoZWNrSW5wdXQoaW5wdXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJlY2lzaW9uOiBudW1iZXIgPSB0aGlzLmdldFByZWNpc2lvbihtYXNrRXhwcmVzc2lvbik7XG4gICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IHRoaXMuY2hlY2tJbnB1dFByZWNpc2lvbihpbnB1dFZhbHVlLCBwcmVjaXNpb24sICcuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wZXJjZW50YWdlKGlucHV0VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gaW5wdXRWYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gaW5wdXRWYWx1ZS5zdWJzdHJpbmcoMCwgaW5wdXRWYWx1ZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIG1hc2tFeHByZXNzaW9uID09PSAnc2VwYXJhdG9yJyB8fFxuICAgICAgICAgICAgbWFza0V4cHJlc3Npb24uc3RhcnRzV2l0aCgnc2VwYXJhdG9yJykgfHxcbiAgICAgICAgICAgIG1hc2tFeHByZXNzaW9uID09PSAnZG90X3NlcGFyYXRvcicgfHxcbiAgICAgICAgICAgIG1hc2tFeHByZXNzaW9uLnN0YXJ0c1dpdGgoJ2RvdF9zZXBhcmF0b3InKSB8fFxuICAgICAgICAgICAgbWFza0V4cHJlc3Npb24gPT09ICdjb21tYV9zZXBhcmF0b3InIHx8XG4gICAgICAgICAgICBtYXNrRXhwcmVzc2lvbi5zdGFydHNXaXRoKCdjb21tYV9zZXBhcmF0b3InKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlLm1hdGNoKCdbd9CwLdGP0JAt0K9dJykgfHxcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlLm1hdGNoKCdbYS16XXxbQS1aXScpIHx8XG4gICAgICAgICAgICAgICAgaW5wdXRWYWx1ZS5tYXRjaCgvWy1AIyEkJVxcXFxeJiooKV/Co8KsJyt8fj1ge31cXFtcXF06XCI7PD4uP1xcL10vKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IHRoaXMuX2NoZWNrSW5wdXQoaW5wdXRWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwcmVjaXNpb246IG51bWJlciA9IHRoaXMuZ2V0UHJlY2lzaW9uKG1hc2tFeHByZXNzaW9uKTtcbiAgICAgICAgICAgIGxldCBzdHJGb3JTZXA6IHN0cmluZztcbiAgICAgICAgICAgIGlmIChtYXNrRXhwcmVzc2lvbi5zdGFydHNXaXRoKCdzZXBhcmF0b3InKSkge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZS5pbmNsdWRlcygnLCcpICYmXG4gICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWUuZW5kc1dpdGgoJywnKSAmJlxuICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbHVlLmluZGV4T2YoJywnKSAhPT0gaW5wdXRWYWx1ZS5sYXN0SW5kZXhPZignLCcpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWUgPSBpbnB1dFZhbHVlLnN1YnN0cmluZygwLCBpbnB1dFZhbHVlLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXNrRXhwcmVzc2lvbi5zdGFydHNXaXRoKCdkb3Rfc2VwYXJhdG9yJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWUuaW5kZXhPZignLicpICE9PSAtMSAmJlxuICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbHVlLmluZGV4T2YoJy4nKSA9PT0gaW5wdXRWYWx1ZS5sYXN0SW5kZXhPZignLicpICYmXG4gICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWUuaW5kZXhPZignLicpID4gM1xuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID0gaW5wdXRWYWx1ZS5yZXBsYWNlKCcuJywgJywnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSA9XG4gICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWUubGVuZ3RoID4gMSAmJiBpbnB1dFZhbHVlWzBdID09PSAnMCcgJiYgaW5wdXRWYWx1ZVsxXSAhPT0gJywnXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGlucHV0VmFsdWUuc2xpY2UoMSwgaW5wdXRWYWx1ZS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGlucHV0VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWFza0V4cHJlc3Npb24uc3RhcnRzV2l0aCgnY29tbWFfc2VwYXJhdG9yJykpIHtcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID1cbiAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZS5sZW5ndGggPiAxICYmIGlucHV0VmFsdWVbMF0gPT09ICcwJyAmJiBpbnB1dFZhbHVlWzFdICE9PSAnLidcbiAgICAgICAgICAgICAgICAgICAgICAgID8gaW5wdXRWYWx1ZS5zbGljZSgxLCBpbnB1dFZhbHVlLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIDogaW5wdXRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXNrRXhwcmVzc2lvbiA9PT0gJ3NlcGFyYXRvcicgfHwgbWFza0V4cHJlc3Npb24uc3RhcnRzV2l0aCgnc2VwYXJhdG9yJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXRWYWx1ZS5tYXRjaCgvW0AjISQlXiYqKClfK3x+PWB7fVxcW1xcXTosXCI7PD4/XFwvXS8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWUgPSBpbnB1dFZhbHVlLnN1YnN0cmluZygwLCBpbnB1dFZhbHVlLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID0gdGhpcy5jaGVja0lucHV0UHJlY2lzaW9uKGlucHV0VmFsdWUsIHByZWNpc2lvbiwgJy4nKTtcbiAgICAgICAgICAgICAgICBzdHJGb3JTZXAgPSBpbnB1dFZhbHVlLnJlcGxhY2UoL1xccy9nLCAnJyk7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5zZXBhcmF0b3Ioc3RyRm9yU2VwLCAnICcsICcuJywgcHJlY2lzaW9uKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWFza0V4cHJlc3Npb24gPT09ICdkb3Rfc2VwYXJhdG9yJyB8fCBtYXNrRXhwcmVzc2lvbi5zdGFydHNXaXRoKCdkb3Rfc2VwYXJhdG9yJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXRWYWx1ZS5tYXRjaCgvW0AjISQlXiYqKClfK3x+PWB7fVxcW1xcXTpcXHNcIjs8Pj9cXC9dLykpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IGlucHV0VmFsdWUuc3Vic3RyaW5nKDAsIGlucHV0VmFsdWUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlucHV0VmFsdWUgPSB0aGlzLmNoZWNrSW5wdXRQcmVjaXNpb24oaW5wdXRWYWx1ZSwgcHJlY2lzaW9uLCAnLCcpO1xuICAgICAgICAgICAgICAgIHN0ckZvclNlcCA9IGlucHV0VmFsdWUucmVwbGFjZSgvXFwuL2csICcnKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLnNlcGFyYXRvcihzdHJGb3JTZXAsICcuJywgJywnLCBwcmVjaXNpb24pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXNrRXhwcmVzc2lvbiA9PT0gJ2NvbW1hX3NlcGFyYXRvcicgfHwgbWFza0V4cHJlc3Npb24uc3RhcnRzV2l0aCgnY29tbWFfc2VwYXJhdG9yJykpIHtcbiAgICAgICAgICAgICAgICBzdHJGb3JTZXAgPSBpbnB1dFZhbHVlLnJlcGxhY2UoLywvZywgJycpO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuc2VwYXJhdG9yKHN0ckZvclNlcCwgJywnLCAnLicsIHByZWNpc2lvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbW1hU2hpZnQ6IG51bWJlciA9IHJlc3VsdC5pbmRleE9mKCcsJykgLSBpbnB1dFZhbHVlLmluZGV4T2YoJywnKTtcbiAgICAgICAgICAgIGNvbnN0IHNoaWZ0U3RlcDogbnVtYmVyID0gcmVzdWx0Lmxlbmd0aCAtIGlucHV0VmFsdWUubGVuZ3RoO1xuXG4gICAgICAgICAgICBpZiAoc2hpZnRTdGVwID4gMCAmJiByZXN1bHRbcG9zaXRpb25dICE9PSAnLCcpIHtcbiAgICAgICAgICAgICAgICBiYWNrc3BhY2VTaGlmdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IF9zaGlmdDogbnVtYmVyID0gMDtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoaWZ0LmFkZChwb3NpdGlvbiArIF9zaGlmdCk7XG4gICAgICAgICAgICAgICAgICAgIF9zaGlmdCsrO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKF9zaGlmdCA8IHNoaWZ0U3RlcCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIChjb21tYVNoaWZ0ICE9PSAwICYmIHBvc2l0aW9uID4gMCAmJiAhKHJlc3VsdC5pbmRleE9mKCcsJykgPj0gcG9zaXRpb24gJiYgcG9zaXRpb24gPiAzKSkgfHxcbiAgICAgICAgICAgICAgICAoIShyZXN1bHQuaW5kZXhPZignLicpID49IHBvc2l0aW9uICYmIHBvc2l0aW9uID4gMykgJiYgc2hpZnRTdGVwIDw9IDApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaGlmdC5jbGVhcigpO1xuICAgICAgICAgICAgICAgIGJhY2tzcGFjZVNoaWZ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzaGlmdCA9IHNoaWZ0U3RlcDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiArPSBzaGlmdFN0ZXA7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hpZnQuYWRkKHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hpZnQuY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoXG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IDAsIGlucHV0U3ltYm9sOiBzdHJpbmcgPSBpbnB1dEFycmF5WzBdO1xuICAgICAgICAgICAgICAgIGkgPCBpbnB1dEFycmF5Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpKyssIGlucHV0U3ltYm9sID0gaW5wdXRBcnJheVtpXVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnNvciA9PT0gbWFza0V4cHJlc3Npb24ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2hlY2tTeW1ib2xNYXNrKGlucHV0U3ltYm9sLCBtYXNrRXhwcmVzc2lvbltjdXJzb3JdKSAmJiBtYXNrRXhwcmVzc2lvbltjdXJzb3IgKyAxXSA9PT0gJz8nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBpbnB1dFN5bWJvbDtcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yICs9IDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgbWFza0V4cHJlc3Npb25bY3Vyc29yICsgMV0gPT09ICcqJyAmJlxuICAgICAgICAgICAgICAgICAgICBtdWx0aSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGVja1N5bWJvbE1hc2soaW5wdXRTeW1ib2wsIG1hc2tFeHByZXNzaW9uW2N1cnNvciArIDJdKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gaW5wdXRTeW1ib2w7XG4gICAgICAgICAgICAgICAgICAgIGN1cnNvciArPSAzO1xuICAgICAgICAgICAgICAgICAgICBtdWx0aSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrU3ltYm9sTWFzayhpbnB1dFN5bWJvbCwgbWFza0V4cHJlc3Npb25bY3Vyc29yXSkgJiZcbiAgICAgICAgICAgICAgICAgICAgbWFza0V4cHJlc3Npb25bY3Vyc29yICsgMV0gPT09ICcqJ1xuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gaW5wdXRTeW1ib2w7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICBtYXNrRXhwcmVzc2lvbltjdXJzb3IgKyAxXSA9PT0gJz8nICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrU3ltYm9sTWFzayhpbnB1dFN5bWJvbCwgbWFza0V4cHJlc3Npb25bY3Vyc29yICsgMl0pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBpbnB1dFN5bWJvbDtcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yICs9IDM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tTeW1ib2xNYXNrKGlucHV0U3ltYm9sLCBtYXNrRXhwcmVzc2lvbltjdXJzb3JdKSB8fFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5oaWRkZW5JbnB1dCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXNrQXZhaWxhYmxlUGF0dGVybnNbbWFza0V4cHJlc3Npb25bY3Vyc29yXV0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFza0F2YWlsYWJsZVBhdHRlcm5zW21hc2tFeHByZXNzaW9uW2N1cnNvcl1dLnN5bWJvbCA9PT0gaW5wdXRTeW1ib2wpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXNrRXhwcmVzc2lvbltjdXJzb3JdID09PSAnSCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIoaW5wdXRTeW1ib2wpID4gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvciArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoaWZ0U3RlcDogbnVtYmVyID0gL1sqP10vZy50ZXN0KG1hc2tFeHByZXNzaW9uLnNsaWNlKDAsIGN1cnNvcikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gaW5wdXRBcnJheS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjdXJzb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hpZnQuYWRkKHNoaWZ0U3RlcCArIHRoaXMucHJlZml4Lmxlbmd0aCB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hc2tFeHByZXNzaW9uW2N1cnNvcl0gPT09ICdoJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gJzInICYmIE51bWJlcihpbnB1dFN5bWJvbCkgPiAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hc2tFeHByZXNzaW9uW2N1cnNvcl0gPT09ICdtJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlcihpbnB1dFN5bWJvbCkgPiA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hpZnRTdGVwOiBudW1iZXIgPSAvWyo/XS9nLnRlc3QobWFza0V4cHJlc3Npb24uc2xpY2UoMCwgY3Vyc29yKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBpbnB1dEFycmF5Lmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnNvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGlmdC5hZGQoc2hpZnRTdGVwICsgdGhpcy5wcmVmaXgubGVuZ3RoIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobWFza0V4cHJlc3Npb25bY3Vyc29yXSA9PT0gJ3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyKGlucHV0U3ltYm9sKSA+IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3IgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGlmdFN0ZXA6IG51bWJlciA9IC9bKj9dL2cudGVzdChtYXNrRXhwcmVzc2lvbi5zbGljZSgwLCBjdXJzb3IpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGlucHV0QXJyYXkubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogY3Vyc29yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoaWZ0LmFkZChzaGlmdFN0ZXAgKyB0aGlzLnByZWZpeC5sZW5ndGggfHwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXNrRXhwcmVzc2lvbltjdXJzb3JdID09PSAnZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIoaW5wdXRTeW1ib2wpID4gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvciArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoaWZ0U3RlcDogbnVtYmVyID0gL1sqP10vZy50ZXN0KG1hc2tFeHByZXNzaW9uLnNsaWNlKDAsIGN1cnNvcikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gaW5wdXRBcnJheS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjdXJzb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hpZnQuYWRkKHNoaWZ0U3RlcCArIHRoaXMucHJlZml4Lmxlbmd0aCB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hc2tFeHByZXNzaW9uW2N1cnNvciAtIDFdID09PSAnZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIoaW5wdXRWYWx1ZS5zbGljZShjdXJzb3IgLSAxLCBjdXJzb3IgKyAxKSkgPiAzMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXNrRXhwcmVzc2lvbltjdXJzb3JdID09PSAnTScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIoaW5wdXRTeW1ib2wpID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvciArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoaWZ0U3RlcDogbnVtYmVyID0gL1sqP10vZy50ZXN0KG1hc2tFeHByZXNzaW9uLnNsaWNlKDAsIGN1cnNvcikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gaW5wdXRBcnJheS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjdXJzb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hpZnQuYWRkKHNoaWZ0U3RlcCArIHRoaXMucHJlZml4Lmxlbmd0aCB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hc2tFeHByZXNzaW9uW2N1cnNvciAtIDFdID09PSAnTScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIoaW5wdXRWYWx1ZS5zbGljZShjdXJzb3IgLSAxLCBjdXJzb3IgKyAxKSkgPiAxMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBpbnB1dFN5bWJvbDtcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yKys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hc2tTcGVjaWFsQ2hhcmFjdGVycy5pbmRleE9mKG1hc2tFeHByZXNzaW9uW2N1cnNvcl0pICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gbWFza0V4cHJlc3Npb25bY3Vyc29yXTtcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yKys7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoaWZ0U3RlcDogbnVtYmVyID0gL1sqP10vZy50ZXN0KG1hc2tFeHByZXNzaW9uLnNsaWNlKDAsIGN1cnNvcikpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGlucHV0QXJyYXkubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGN1cnNvcjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hpZnQuYWRkKHNoaWZ0U3RlcCArIHRoaXMucHJlZml4Lmxlbmd0aCB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFza1NwZWNpYWxDaGFyYWN0ZXJzLmluZGV4T2YoaW5wdXRTeW1ib2wpID4gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXNrQXZhaWxhYmxlUGF0dGVybnNbbWFza0V4cHJlc3Npb25bY3Vyc29yXV0gJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXNrQXZhaWxhYmxlUGF0dGVybnNbbWFza0V4cHJlc3Npb25bY3Vyc29yXV0ub3B0aW9uYWxcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yKys7XG4gICAgICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hc2tFeHByZXNzaW9uW2N1cnNvciArIDFdID09PSAnKicgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmluZFNwZWNpYWxDaGFyKHRoaXMubWFza0V4cHJlc3Npb25bY3Vyc29yICsgMl0pICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpbmRTcGVjaWFsQ2hhcihpbnB1dFN5bWJvbCkgPT09IHRoaXMubWFza0V4cHJlc3Npb25bY3Vyc29yICsgMl0gJiZcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yICs9IDM7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBpbnB1dFN5bWJvbDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hc2tFeHByZXNzaW9uW2N1cnNvciArIDFdID09PSAnPycgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmluZFNwZWNpYWxDaGFyKHRoaXMubWFza0V4cHJlc3Npb25bY3Vyc29yICsgMl0pICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpbmRTcGVjaWFsQ2hhcihpbnB1dFN5bWJvbCkgPT09IHRoaXMubWFza0V4cHJlc3Npb25bY3Vyc29yICsgMl0gJiZcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yICs9IDM7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBpbnB1dFN5bWJvbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgcmVzdWx0Lmxlbmd0aCArIDEgPT09IG1hc2tFeHByZXNzaW9uLmxlbmd0aCAmJlxuICAgICAgICAgICAgdGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnMuaW5kZXhPZihtYXNrRXhwcmVzc2lvblttYXNrRXhwcmVzc2lvbi5sZW5ndGggLSAxXSkgIT09IC0xXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IG1hc2tFeHByZXNzaW9uW21hc2tFeHByZXNzaW9uLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5ld1Bvc2l0aW9uOiBudW1iZXIgPSBwb3NpdGlvbiArIDE7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMuX3NoaWZ0LmhhcyhuZXdQb3NpdGlvbikpIHtcbiAgICAgICAgICAgIHNoaWZ0Kys7XG4gICAgICAgICAgICBuZXdQb3NpdGlvbisrO1xuICAgICAgICB9XG5cbiAgICAgICAgY2IodGhpcy5fc2hpZnQuaGFzKHBvc2l0aW9uKSA/IHNoaWZ0IDogMCwgYmFja3NwYWNlU2hpZnQpO1xuICAgICAgICBpZiAoc2hpZnQgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLl9zaGlmdC5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXM6IHN0cmluZyA9IHRoaXMuc3VmaXggPyBgJHt0aGlzLnByZWZpeH0ke3Jlc3VsdH0ke3RoaXMuc3VmaXh9YCA6IGAke3RoaXMucHJlZml4fSR7cmVzdWx0fWA7XG4gICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXMgPSBgJHt0aGlzLnByZWZpeH0ke3Jlc3VsdH1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIHB1YmxpYyBfZmluZFNwZWNpYWxDaGFyKGlucHV0U3ltYm9sOiBzdHJpbmcpOiB1bmRlZmluZWQgfCBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnMuZmluZCgodmFsOiBzdHJpbmcpID0+IHZhbCA9PT0gaW5wdXRTeW1ib2wpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfY2hlY2tTeW1ib2xNYXNrKGlucHV0U3ltYm9sOiBzdHJpbmcsIG1hc2tTeW1ib2w6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICB0aGlzLm1hc2tBdmFpbGFibGVQYXR0ZXJucyA9IHRoaXMuY3VzdG9tUGF0dGVybiA/IHRoaXMuY3VzdG9tUGF0dGVybiA6IHRoaXMubWFza0F2YWlsYWJsZVBhdHRlcm5zO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy5tYXNrQXZhaWxhYmxlUGF0dGVybnNbbWFza1N5bWJvbF0gJiZcbiAgICAgICAgICAgIHRoaXMubWFza0F2YWlsYWJsZVBhdHRlcm5zW21hc2tTeW1ib2xdLnBhdHRlcm4gJiZcbiAgICAgICAgICAgIHRoaXMubWFza0F2YWlsYWJsZVBhdHRlcm5zW21hc2tTeW1ib2xdLnBhdHRlcm4udGVzdChpbnB1dFN5bWJvbClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNlcGFyYXRvciA9IChzdHI6IHN0cmluZywgY2hhcjogc3RyaW5nLCBkZWNpbWFsQ2hhcjogc3RyaW5nLCBwcmVjaXNpb246IG51bWJlcikgPT4ge1xuICAgICAgICBzdHIgKz0gJyc7XG4gICAgICAgIGNvbnN0IHg6IHN0cmluZ1tdID0gc3RyLnNwbGl0KGRlY2ltYWxDaGFyKTtcbiAgICAgICAgY29uc3QgZGVjaW1hbHM6IHN0cmluZyA9IHgubGVuZ3RoID4gMSA/IGAke2RlY2ltYWxDaGFyfSR7eFsxXX1gIDogJyc7XG4gICAgICAgIGxldCByZXM6IHN0cmluZyA9IHhbMF07XG4gICAgICAgIGNvbnN0IHJneDogUmVnRXhwID0gLyhcXGQrKShcXGR7M30pLztcbiAgICAgICAgd2hpbGUgKHJneC50ZXN0KHJlcykpIHtcbiAgICAgICAgICAgIHJlcyA9IHJlcy5yZXBsYWNlKHJneCwgJyQxJyArIGNoYXIgKyAnJDInKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJlY2lzaW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMgKyBkZWNpbWFscztcbiAgICAgICAgfSBlbHNlIGlmIChwcmVjaXNpb24gPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcyArIGRlY2ltYWxzLnN1YnN0cigwLCBwcmVjaXNpb24gKyAxKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBwZXJjZW50YWdlID0gKHN0cjogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgICAgIHJldHVybiBOdW1iZXIoc3RyKSA+PSAwICYmIE51bWJlcihzdHIpIDw9IDEwMDtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBnZXRQcmVjaXNpb24gPSAobWFza0V4cHJlc3Npb246IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgICAgIGNvbnN0IHg6IHN0cmluZ1tdID0gbWFza0V4cHJlc3Npb24uc3BsaXQoJy4nKTtcbiAgICAgICAgaWYgKHgubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIE51bWJlcih4W3gubGVuZ3RoIC0gMV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbmZpbml0eTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBjaGVja0lucHV0UHJlY2lzaW9uID0gKGlucHV0VmFsdWU6IHN0cmluZywgcHJlY2lzaW9uOiBudW1iZXIsIGRlY2ltYWxNYXJrZXI6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgIGlmIChwcmVjaXNpb24gPCBJbmZpbml0eSkge1xuICAgICAgICAgICAgbGV0IHByZWNpc2lvblJlZ0V4OiBSZWdFeHA7XG5cbiAgICAgICAgICAgIGlmIChkZWNpbWFsTWFya2VyID09PSAnLicpIHtcbiAgICAgICAgICAgICAgICBwcmVjaXNpb25SZWdFeCA9IG5ldyBSZWdFeHAoYFxcXFwuXFxcXGR7JHtwcmVjaXNpb259fS4qJGApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcmVjaXNpb25SZWdFeCA9IG5ldyBSZWdFeHAoYCxcXFxcZHske3ByZWNpc2lvbn19LiokYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHByZWNpc2lvbk1hdGNoOiBSZWdFeHBNYXRjaEFycmF5IHwgbnVsbCA9IGlucHV0VmFsdWUubWF0Y2gocHJlY2lzaW9uUmVnRXgpO1xuICAgICAgICAgICAgaWYgKHByZWNpc2lvbk1hdGNoICYmIHByZWNpc2lvbk1hdGNoWzBdLmxlbmd0aCAtIDEgPiBwcmVjaXNpb24pIHtcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID0gaW5wdXRWYWx1ZS5zdWJzdHJpbmcoMCwgaW5wdXRWYWx1ZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJlY2lzaW9uID09PSAwICYmIGlucHV0VmFsdWUuZW5kc1dpdGgoZGVjaW1hbE1hcmtlcikpIHtcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID0gaW5wdXRWYWx1ZS5zdWJzdHJpbmcoMCwgaW5wdXRWYWx1ZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBfY2hlY2tJbnB1dChzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBzdHJcbiAgICAgICAgICAgIC5zcGxpdCgnJylcbiAgICAgICAgICAgIC5maWx0ZXIoKGk6IHN0cmluZykgPT4gaS5tYXRjaCgnXFxcXGQnKSB8fCBpID09PSAnLicgfHwgaSA9PT0gJywnKVxuICAgICAgICAgICAgLmpvaW4oJycpO1xuICAgIH1cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG1heC1maWxlLWxpbmUtY291bnRcbn1cbiJdfQ==