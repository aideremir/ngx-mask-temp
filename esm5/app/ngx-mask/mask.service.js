import * as tslib_1 from "tslib";
import { ElementRef, Inject, Injectable, Renderer2 } from '@angular/core';
import { config } from './config';
import { DOCUMENT } from '@angular/common';
import { MaskApplierService } from './mask-applier.service';
var MaskService = /** @class */ (function (_super) {
    tslib_1.__extends(MaskService, _super);
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
            var _b = tslib_1.__read(_a, 2), name = _b[0], value = _b[1];
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
    MaskService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(DOCUMENT)),
        tslib_1.__param(1, Inject(config)),
        tslib_1.__metadata("design:paramtypes", [Object, Object, ElementRef,
            Renderer2])
    ], MaskService);
    return MaskService;
}(MaskApplierService));
export { MaskService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzay5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LW1hc2svIiwic291cmNlcyI6WyJhcHAvbmd4LW1hc2svbWFzay5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFRLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFrQixNQUFNLGVBQWUsQ0FBQztBQUNoRyxPQUFPLEVBQUUsTUFBTSxFQUFXLE1BQU0sVUFBVSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUc1RDtJQUFpQyx1Q0FBa0I7SUFXL0M7SUFDSSwyQkFBMkI7SUFDRCxRQUFhLEVBQ2IsT0FBZ0IsRUFDbEMsV0FBdUIsRUFDdkIsU0FBb0I7UUFMaEMsWUFPSSxrQkFBTSxPQUFPLENBQUMsU0FFakI7UUFQNkIsY0FBUSxHQUFSLFFBQVEsQ0FBSztRQUNiLGFBQU8sR0FBUCxPQUFPLENBQVM7UUFDbEMsaUJBQVcsR0FBWCxXQUFXLENBQVk7UUFDdkIsZUFBUyxHQUFULFNBQVMsQ0FBVztRQWZ6QixnQkFBVSxHQUFZLElBQUksQ0FBQztRQUMzQixvQkFBYyxHQUFXLEVBQUUsQ0FBQztRQUM1QixtQkFBYSxHQUFZLEtBQUssQ0FBQztRQUMvQixtQkFBYSxHQUFZLEtBQUssQ0FBQztRQUMvQixpQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUN6QixjQUFRLEdBQWtCLElBQUksQ0FBQztRQUMvQixZQUFNLEdBQWtCLElBQUksQ0FBQztRQUVwQywyQkFBMkI7UUFDcEIsY0FBUSxHQUFHLFVBQUMsQ0FBTSxJQUFNLENBQUMsQ0FBQztRQVM3QixLQUFJLENBQUMsWUFBWSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDOztJQUN2RCxDQUFDO0lBRUQsaURBQWlEO0lBQzFDLCtCQUFTLEdBQWhCLFVBQ0ks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QyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1NBQzdHO2FBQU0sSUFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDeEcsQ0FBQyxDQUFDLEVBQ0o7WUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsT0FBTyxDQUN0RyxHQUFHLEVBQ0gsR0FBRyxDQUNOLENBQUM7U0FDTDthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ3RHO0lBQ0wsQ0FBQztJQTVTUSxXQUFXO1FBRHZCLFVBQVUsRUFBRTtRQWNKLG1CQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNoQixtQkFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7aUVBQ00sVUFBVTtZQUNaLFNBQVM7T0FoQnZCLFdBQVcsQ0E2U3ZCO0lBQUQsa0JBQUM7Q0FBQSxBQTdTRCxDQUFpQyxrQkFBa0IsR0E2U2xEO1NBN1NZLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBIb3N0LCBJbmplY3QsIEluamVjdGFibGUsIFJlbmRlcmVyMiwgU2VsZiwgU2tpcFNlbGYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNvbmZpZywgSUNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE1hc2tBcHBsaWVyU2VydmljZSB9IGZyb20gJy4vbWFzay1hcHBsaWVyLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWFza1NlcnZpY2UgZXh0ZW5kcyBNYXNrQXBwbGllclNlcnZpY2Uge1xuICAgIHB1YmxpYyB2YWxpZGF0aW9uOiBib29sZWFuID0gdHJ1ZTtcbiAgICBwdWJsaWMgbWFza0V4cHJlc3Npb246IHN0cmluZyA9ICcnO1xuICAgIHB1YmxpYyBpc051bWJlclZhbHVlOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIHNob3dNYXNrVHlwZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgbWFza0lzU2hvd246IHN0cmluZyA9ICcnO1xuICAgIHB1YmxpYyBzZWxTdGFydDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gICAgcHVibGljIHNlbEVuZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gICAgcHJvdGVjdGVkIF9mb3JtRWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBwdWJsaWMgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBhbnksXG4gICAgICAgIEBJbmplY3QoY29uZmlnKSBwcm90ZWN0ZWQgX2NvbmZpZzogSUNvbmZpZyxcbiAgICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMlxuICAgICkge1xuICAgICAgICBzdXBlcihfY29uZmlnKTtcbiAgICAgICAgdGhpcy5fZm9ybUVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmN5Y2xvbWF0aWMtY29tcGxleGl0eVxuICAgIHB1YmxpYyBhcHBseU1hc2soXG4gICAgICAgIGlucHV0VmFsdWU6IHN0cmluZyxcbiAgICAgICAgbWFza0V4cHJlc3Npb246IHN0cmluZyxcbiAgICAgICAgcG9zaXRpb246IG51bWJlciA9IDAsXG4gICAgICAgIGNiOiBGdW5jdGlvbiA9ICgpID0+IHt9XG4gICAgKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCFtYXNrRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYXNrSXNTaG93biA9IHRoaXMuc2hvd01hc2tUeXBlZCA/IHRoaXMuc2hvd01hc2tJbklucHV0KCkgOiAnJztcbiAgICAgICAgaWYgKHRoaXMubWFza0V4cHJlc3Npb24gPT09ICdJUCcgJiYgdGhpcy5zaG93TWFza1R5cGVkKSB7XG4gICAgICAgICAgICB0aGlzLm1hc2tJc1Nob3duID0gdGhpcy5zaG93TWFza0luSW5wdXQoaW5wdXRWYWx1ZSB8fCAnIycpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaW5wdXRWYWx1ZSAmJiB0aGlzLnNob3dNYXNrVHlwZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUNvbnRyb2xSZXN1bHQodGhpcy5wcmVmaXgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy5tYXNrSXNTaG93bjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBnZXRTeW1ib2w6IHN0cmluZyA9ICEhaW5wdXRWYWx1ZSAmJiB0eXBlb2YgdGhpcy5zZWxTdGFydCA9PT0gJ251bWJlcicgPyBpbnB1dFZhbHVlW3RoaXMuc2VsU3RhcnRdIDogJyc7XG4gICAgICAgIGxldCBuZXdJbnB1dFZhbHVlOiBzdHJpbmcgPSAnJztcbiAgICAgICAgaWYgKHRoaXMuaGlkZGVuSW5wdXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGV0IGFjdHVhbFJlc3VsdDogc3RyaW5nW10gPSB0aGlzLmFjdHVhbFZhbHVlLnNwbGl0KCcnKTtcbiAgICAgICAgICAgIGlucHV0VmFsdWUgIT09ICcnICYmIGFjdHVhbFJlc3VsdC5sZW5ndGhcbiAgICAgICAgICAgICAgICA/IHR5cGVvZiB0aGlzLnNlbFN0YXJ0ID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgdGhpcy5zZWxFbmQgPT09ICdudW1iZXInXG4gICAgICAgICAgICAgICAgICAgID8gaW5wdXRWYWx1ZS5sZW5ndGggPiBhY3R1YWxSZXN1bHQubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGFjdHVhbFJlc3VsdC5zcGxpY2UodGhpcy5zZWxTdGFydCwgMCwgZ2V0U3ltYm9sKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBpbnB1dFZhbHVlLmxlbmd0aCA8IGFjdHVhbFJlc3VsdC5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgID8gYWN0dWFsUmVzdWx0Lmxlbmd0aCAtIGlucHV0VmFsdWUubGVuZ3RoID09PSAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBhY3R1YWxSZXN1bHQuc3BsaWNlKHRoaXMuc2VsU3RhcnQgLSAxLCAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogYWN0dWFsUmVzdWx0LnNwbGljZSh0aGlzLnNlbFN0YXJ0LCB0aGlzLnNlbEVuZCAtIHRoaXMuc2VsU3RhcnQpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXG4gICAgICAgICAgICAgICAgOiAoYWN0dWFsUmVzdWx0ID0gW10pO1xuICAgICAgICAgICAgbmV3SW5wdXRWYWx1ZSA9IHRoaXMuYWN0dWFsVmFsdWUubGVuZ3RoID8gdGhpcy5zaGlmdFR5cGVkU3ltYm9scyhhY3R1YWxSZXN1bHQuam9pbignJykpIDogaW5wdXRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBuZXdJbnB1dFZhbHVlID0gQm9vbGVhbihuZXdJbnB1dFZhbHVlKSAmJiBuZXdJbnB1dFZhbHVlLmxlbmd0aCA/IG5ld0lucHV0VmFsdWUgOiBpbnB1dFZhbHVlO1xuICAgICAgICBjb25zdCByZXN1bHQ6IHN0cmluZyA9IHN1cGVyLmFwcGx5TWFzayhuZXdJbnB1dFZhbHVlLCBtYXNrRXhwcmVzc2lvbiwgcG9zaXRpb24sIGNiKTtcbiAgICAgICAgdGhpcy5hY3R1YWxWYWx1ZSA9IHRoaXMuZ2V0QWN0dWFsVmFsdWUocmVzdWx0KTtcblxuICAgICAgICBpZiAodGhpcy5tYXNrRXhwcmVzc2lvbi5zdGFydHNXaXRoKCdzZXBhcmF0b3InKSAmJiB0aGlzLmRyb3BTcGVjaWFsQ2hhcmFjdGVycyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRoaXMubWFza1NwZWNpYWxDaGFyYWN0ZXJzID0gdGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnMuZmlsdGVyKChpdGVtOiBzdHJpbmcpID0+IGl0ZW0gIT09ICcsJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdzZXBhcmF0b3InID09PSB0aGlzLm1hc2tFeHByZXNzaW9uICYmIHRoaXMuZHJvcFNwZWNpYWxDaGFyYWN0ZXJzID09PSB0cnVlKSB7XG4gICAgICAgICAgdGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnMgPSB0aGlzLm1hc2tTcGVjaWFsQ2hhcmFjdGVycy5maWx0ZXIoKGl0ZW06IHN0cmluZykgPT4gaXRlbSAhPT0gJywnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tYXNrRXhwcmVzc2lvbi5zdGFydHNXaXRoKCdkb3Rfc2VwYXJhdG9yJykgJiYgdGhpcy5kcm9wU3BlY2lhbENoYXJhY3RlcnMgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMubWFza1NwZWNpYWxDaGFyYWN0ZXJzID0gdGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnMuZmlsdGVyKChpdGVtOiBzdHJpbmcpID0+IGl0ZW0gIT09ICcsJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdkb3Rfc2VwYXJhdG9yJyA9PT0gdGhpcy5tYXNrRXhwcmVzc2lvbiAmJiB0aGlzLmRyb3BTcGVjaWFsQ2hhcmFjdGVycyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnMgPSB0aGlzLm1hc2tTcGVjaWFsQ2hhcmFjdGVycy5maWx0ZXIoKGl0ZW06IHN0cmluZykgPT4gaXRlbSAhPT0gJywnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tYXNrRXhwcmVzc2lvbi5zdGFydHNXaXRoKCdjb21tYV9zZXBhcmF0b3InKSAmJiB0aGlzLmRyb3BTcGVjaWFsQ2hhcmFjdGVycyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnMgPSB0aGlzLm1hc2tTcGVjaWFsQ2hhcmFjdGVycy5maWx0ZXIoKGl0ZW06IHN0cmluZykgPT4gaXRlbSAhPT0gJy4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ2NvbW1hX3NlcGFyYXRvcicgPT09IHRoaXMubWFza0V4cHJlc3Npb24gJiYgdGhpcy5kcm9wU3BlY2lhbENoYXJhY3RlcnMgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMubWFza1NwZWNpYWxDaGFyYWN0ZXJzID0gdGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnMuZmlsdGVyKChpdGVtOiBzdHJpbmcpID0+IGl0ZW0gIT09ICcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZvcm1Db250cm9sUmVzdWx0KHJlc3VsdCk7XG5cbiAgICAgICAgbGV0IGlmTWFza0lzU2hvd246IHN0cmluZyA9ICcnO1xuICAgICAgICBpZiAoIXRoaXMuc2hvd01hc2tUeXBlZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaGlkZGVuSW5wdXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPyB0aGlzLmhpZGVJbnB1dChyZXN1bHQsIHRoaXMubWFza0V4cHJlc3Npb24pIDogcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXNMZW46IG51bWJlciA9IHJlc3VsdC5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHByZWZObWFzazogc3RyaW5nID0gdGhpcy5wcmVmaXggKyB0aGlzLm1hc2tJc1Nob3duO1xuICAgICAgICBpZk1hc2tJc1Nob3duID0gdGhpcy5tYXNrRXhwcmVzc2lvbiA9PT0gJ0lQJyA/IHByZWZObWFzayA6IHByZWZObWFzay5zbGljZShyZXNMZW4pO1xuICAgICAgICByZXR1cm4gcmVzdWx0ICsgaWZNYXNrSXNTaG93bjtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXBwbHlWYWx1ZUNoYW5nZXMocG9zaXRpb246IG51bWJlciA9IDAsIGNiOiBGdW5jdGlvbiA9ICgpID0+IHt9KTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2Zvcm1FbGVtZW50LnZhbHVlID0gdGhpcy5hcHBseU1hc2sodGhpcy5fZm9ybUVsZW1lbnQudmFsdWUsIHRoaXMubWFza0V4cHJlc3Npb24sIHBvc2l0aW9uLCBjYik7XG4gICAgICAgIGlmICh0aGlzLl9mb3JtRWxlbWVudCA9PT0gdGhpcy5kb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhcklmTm90TWF0Y2hGbigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBoaWRlSW5wdXQoaW5wdXRWYWx1ZTogc3RyaW5nLCBtYXNrRXhwcmVzc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGlucHV0VmFsdWVcbiAgICAgICAgICAgIC5zcGxpdCgnJylcbiAgICAgICAgICAgIC5tYXAoKGN1cnI6IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXNrQXZhaWxhYmxlUGF0dGVybnMgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXNrQXZhaWxhYmxlUGF0dGVybnNbbWFza0V4cHJlc3Npb25baW5kZXhdXSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hc2tBdmFpbGFibGVQYXR0ZXJuc1ttYXNrRXhwcmVzc2lvbltpbmRleF1dLnN5bWJvbFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXNrQXZhaWxhYmxlUGF0dGVybnNbbWFza0V4cHJlc3Npb25baW5kZXhdXS5zeW1ib2w7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKCcnKTtcbiAgICB9XG5cbiAgICAvLyB0aGlzIGZ1bmN0aW9uIGlzIG5vdCBuZWNlc3NhcnksIGl0IGNoZWNrcyByZXN1bHQgYWdhaW5zdCBtYXNrRXhwcmVzc2lvblxuICAgIHB1YmxpYyBnZXRBY3R1YWxWYWx1ZShyZXM6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGNvbXBhcmU6IHN0cmluZ1tdID0gcmVzXG4gICAgICAgICAgICAuc3BsaXQoJycpXG4gICAgICAgICAgICAuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChzeW1ib2w6IHN0cmluZywgaTogbnVtYmVyKSA9PlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGVja1N5bWJvbE1hc2soc3ltYm9sLCB0aGlzLm1hc2tFeHByZXNzaW9uW2ldKSB8fFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnMuaW5jbHVkZXModGhpcy5tYXNrRXhwcmVzc2lvbltpXSkgJiYgc3ltYm9sID09PSB0aGlzLm1hc2tFeHByZXNzaW9uW2ldKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgaWYgKGNvbXBhcmUuam9pbignJykgPT09IHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmUuam9pbignJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2hpZnRUeXBlZFN5bWJvbHMoaW5wdXRWYWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHN5bWJvbFRvUmVwbGFjZTogc3RyaW5nID0gJyc7XG4gICAgICAgIGNvbnN0IG5ld0lucHV0VmFsdWU6IHN0cmluZ1tdID1cbiAgICAgICAgICAgIChpbnB1dFZhbHVlICYmXG4gICAgICAgICAgICAgICAgaW5wdXRWYWx1ZS5zcGxpdCgnJykubWFwKChjdXJyU3ltYm9sOiBzdHJpbmcsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnMuaW5jbHVkZXMoaW5wdXRWYWx1ZVtpbmRleCArIDFdKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZVtpbmRleCArIDFdICE9PSB0aGlzLm1hc2tFeHByZXNzaW9uW2luZGV4ICsgMV1cbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzeW1ib2xUb1JlcGxhY2UgPSBjdXJyU3ltYm9sO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0VmFsdWVbaW5kZXggKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoc3ltYm9sVG9SZXBsYWNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVwbGFjZVN5bWJvbDogc3RyaW5nID0gc3ltYm9sVG9SZXBsYWNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ltYm9sVG9SZXBsYWNlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVwbGFjZVN5bWJvbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VyclN5bWJvbDtcbiAgICAgICAgICAgICAgICB9KSkgfHxcbiAgICAgICAgICAgIFtdO1xuICAgICAgICByZXR1cm4gbmV3SW5wdXRWYWx1ZS5qb2luKCcnKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2hvd01hc2tJbklucHV0KGlucHV0VmFsPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvd01hc2tUeXBlZCAmJiAhIXRoaXMuc2hvd25NYXNrRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMubWFza0V4cHJlc3Npb24ubGVuZ3RoICE9PSB0aGlzLnNob3duTWFza0V4cHJlc3Npb24ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNYXNrIGV4cHJlc3Npb24gbXVzdCBtYXRjaCBtYXNrIHBsYWNlaG9sZGVyIGxlbmd0aCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93bk1hc2tFeHByZXNzaW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2hvd01hc2tUeXBlZCkge1xuICAgICAgICAgICAgaWYgKGlucHV0VmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoZWNrRm9ySXAoaW5wdXRWYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFza0V4cHJlc3Npb24ucmVwbGFjZSgvXFx3L2csICdfJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhcklmTm90TWF0Y2hGbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY2xlYXJJZk5vdE1hdGNoXG4gICAgICAgICAgICAmJiB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLm1hc2tFeHByZXNzaW9uLmxlbmd0aCArIHRoaXMuc3VmaXgubGVuZ3RoICE9PSB0aGlzLl9mb3JtRWxlbWVudC52YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUVsZW1lbnRQcm9wZXJ0eSA9IFsndmFsdWUnLCAnJ107XG4gICAgICAgICAgICB0aGlzLmFwcGx5TWFzayh0aGlzLl9mb3JtRWxlbWVudC52YWx1ZSwgdGhpcy5tYXNrRXhwcmVzc2lvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGZvcm1FbGVtZW50UHJvcGVydHkoW25hbWUsIHZhbHVlXTogW3N0cmluZywgc3RyaW5nIHwgYm9vbGVhbl0pIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZm9ybUVsZW1lbnQsIG5hbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hlY2tTcGVjaWFsQ2hhckFtb3VudChtYXNrOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBjaGFyczogc3RyaW5nW10gPSBtYXNrLnNwbGl0KCcnKS5maWx0ZXIoKGl0ZW06IHN0cmluZykgPT4gdGhpcy5fZmluZFNwZWNpYWxDaGFyKGl0ZW0pKTtcbiAgICAgICAgcmV0dXJuIGNoYXJzLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGN5Y2xvbWF0aWMtY29tcGxleGl0eVxuICAgIHByaXZhdGUgX2NoZWNrRm9ySXAoaW5wdXRWYWw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChpbnB1dFZhbCA9PT0gJyMnKSB7XG4gICAgICAgICAgICByZXR1cm4gJ18uXy5fLl8nO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFycjogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGlucHV0VmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXRWYWxbaV0ubWF0Y2goJ1xcXFxkJykpIHtcbiAgICAgICAgICAgICAgICBhcnIucHVzaChpbnB1dFZhbFtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyci5sZW5ndGggPD0gMykge1xuICAgICAgICAgICAgcmV0dXJuICdfLl8uXyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyci5sZW5ndGggPiAzICYmIGFyci5sZW5ndGggPD0gNikge1xuICAgICAgICAgICAgcmV0dXJuICdfLl8nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcnIubGVuZ3RoID4gNiAmJiBhcnIubGVuZ3RoIDw9IDkpIHtcbiAgICAgICAgICAgIHJldHVybiAnXyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyci5sZW5ndGggPiA5ICYmIGFyci5sZW5ndGggPD0gMTIpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHByaXZhdGUgZm9ybUNvbnRyb2xSZXN1bHQoaW5wdXRWYWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuZHJvcFNwZWNpYWxDaGFyYWN0ZXJzKSkge1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZShcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVNYXNrKHRoaXMuX3JlbW92ZVN1Zml4KHRoaXMuX3JlbW92ZVByZWZpeChpbnB1dFZhbHVlKSksIHRoaXMuZHJvcFNwZWNpYWxDaGFyYWN0ZXJzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRyb3BTcGVjaWFsQ2hhcmFjdGVycykge1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLl9jaGVja1N5bWJvbHMoaW5wdXRWYWx1ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLl9yZW1vdmVTdWZpeCh0aGlzLl9yZW1vdmVQcmVmaXgoaW5wdXRWYWx1ZSkpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX3JlbW92ZU1hc2sodmFsdWU6IHN0cmluZywgc3BlY2lhbENoYXJhY3RlcnNGb3JSZW1vdmU6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlID8gdmFsdWUucmVwbGFjZSh0aGlzLl9yZWdFeHBGb3JSZW1vdmUoc3BlY2lhbENoYXJhY3RlcnNGb3JSZW1vdmUpLCAnJykgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9yZW1vdmVQcmVmaXgodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5wcmVmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWUgPyB2YWx1ZS5yZXBsYWNlKHRoaXMucHJlZml4LCAnJykgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9yZW1vdmVTdWZpeCh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLnN1Zml4KSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlID8gdmFsdWUucmVwbGFjZSh0aGlzLnN1Zml4LCAnJykgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9yZWdFeHBGb3JSZW1vdmUoc3BlY2lhbENoYXJhY3RlcnNGb3JSZW1vdmU6IHN0cmluZ1tdKTogUmVnRXhwIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoc3BlY2lhbENoYXJhY3RlcnNGb3JSZW1vdmUubWFwKChpdGVtOiBzdHJpbmcpID0+IGBcXFxcJHtpdGVtfWApLmpvaW4oJ3wnKSwgJ2dpJyk7XG4gICAgfVxuICAgIHByaXZhdGUgX2NoZWNrU3ltYm9scyhyZXN1bHQ6IHN0cmluZyk6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGwge1xuICAgICAgICBpZiAoJ3NlcGFyYXRvci4yJyA9PT0gdGhpcy5tYXNrRXhwcmVzc2lvbiAmJiB0aGlzLmlzTnVtYmVyVmFsdWUpIHtcbiAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdCA9PT0gJydcbiAgICAgICAgICAgID8gcmVzdWx0XG4gICAgICAgICAgICA6IHJlc3VsdCA9PT0gJywnXG4gICAgICAgICAgICAgID8gbnVsbFxuICAgICAgICAgICAgICA6IE51bWJlcihcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVNYXNrKFxuICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlU3VmaXgodGhpcy5fcmVtb3ZlUHJlZml4KHJlc3VsdCkpLFxuICAgICAgICAgICAgICAgICAgdGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnNcbiAgICAgICAgICAgICAgICApLnJlcGxhY2UoJywnLCAnLicpXG4gICAgICAgICAgICAgICkudG9GaXhlZCgyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ2RvdF9zZXBhcmF0b3IuMicgPT09IHRoaXMubWFza0V4cHJlc3Npb24gJiYgdGhpcy5pc051bWJlclZhbHVlKSB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0ID09PSAnJ1xuICAgICAgICAgICAgICAgID8gcmVzdWx0XG4gICAgICAgICAgICAgICAgOiByZXN1bHQgPT09ICcsJ1xuICAgICAgICAgICAgICAgID8gbnVsbFxuICAgICAgICAgICAgICAgIDogTnVtYmVyKFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZU1hc2soXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZVN1Zml4KHRoaXMuX3JlbW92ZVByZWZpeChyZXN1bHQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnNcbiAgICAgICAgICAgICAgICAgICAgICApLnJlcGxhY2UoJywnLCAnLicpXG4gICAgICAgICAgICAgICAgICApLnRvRml4ZWQoMik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdjb21tYV9zZXBhcmF0b3IuMicgPT09IHRoaXMubWFza0V4cHJlc3Npb24gJiYgdGhpcy5pc051bWJlclZhbHVlKSB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0ID09PSAnJ1xuICAgICAgICAgICAgICAgID8gcmVzdWx0XG4gICAgICAgICAgICAgICAgOiByZXN1bHQgPT09ICcuJ1xuICAgICAgICAgICAgICAgID8gbnVsbFxuICAgICAgICAgICAgICAgIDogTnVtYmVyKFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZU1hc2sodGhpcy5fcmVtb3ZlU3VmaXgodGhpcy5fcmVtb3ZlUHJlZml4KHJlc3VsdCkpLCB0aGlzLm1hc2tTcGVjaWFsQ2hhcmFjdGVycylcbiAgICAgICAgICAgICAgICAgICkudG9GaXhlZCgyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc051bWJlclZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0ID09PSAnJ1xuICAgICAgICAgICAgICAgID8gcmVzdWx0XG4gICAgICAgICAgICAgICAgOiBOdW1iZXIodGhpcy5fcmVtb3ZlTWFzayh0aGlzLl9yZW1vdmVTdWZpeCh0aGlzLl9yZW1vdmVQcmVmaXgocmVzdWx0KSksIHRoaXMubWFza1NwZWNpYWxDaGFyYWN0ZXJzKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVNYXNrKHRoaXMuX3JlbW92ZVN1Zml4KHRoaXMuX3JlbW92ZVByZWZpeChyZXN1bHQpKSwgdGhpcy5tYXNrU3BlY2lhbENoYXJhY3RlcnMpLmluZGV4T2YoJywnKSAhPT1cbiAgICAgICAgICAgIC0xXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZU1hc2sodGhpcy5fcmVtb3ZlU3VmaXgodGhpcy5fcmVtb3ZlUHJlZml4KHJlc3VsdCkpLCB0aGlzLm1hc2tTcGVjaWFsQ2hhcmFjdGVycykucmVwbGFjZShcbiAgICAgICAgICAgICAgICAnLCcsXG4gICAgICAgICAgICAgICAgJy4nXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZU1hc2sodGhpcy5fcmVtb3ZlU3VmaXgodGhpcy5fcmVtb3ZlUHJlZml4KHJlc3VsdCkpLCB0aGlzLm1hc2tTcGVjaWFsQ2hhcmFjdGVycyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=