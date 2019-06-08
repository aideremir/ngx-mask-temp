import * as tslib_1 from "tslib";
import { Directive, forwardRef, HostListener, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaskService } from './mask.service';
import { withoutValidation } from './config';
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
                if (this._inputValue.match('[wа-яА-Я]') || this._inputValue.match('[a-z]|[A-Z]')) {
                    posStart;
                }
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
    tslib_1.__decorate([
        Input('mask'),
        tslib_1.__metadata("design:type", String)
    ], MaskDirective.prototype, "maskExpression", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], MaskDirective.prototype, "specialCharacters", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], MaskDirective.prototype, "patterns", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], MaskDirective.prototype, "prefix", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], MaskDirective.prototype, "sufix", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], MaskDirective.prototype, "dropSpecialCharacters", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], MaskDirective.prototype, "hiddenInput", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], MaskDirective.prototype, "showMaskTyped", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], MaskDirective.prototype, "shownMaskExpression", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], MaskDirective.prototype, "showTemplate", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], MaskDirective.prototype, "clearIfNotMatch", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], MaskDirective.prototype, "validation", void 0);
    tslib_1.__decorate([
        HostListener('input', ['$event']),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], MaskDirective.prototype, "onInput", null);
    tslib_1.__decorate([
        HostListener('blur'),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], MaskDirective.prototype, "onBlur", null);
    tslib_1.__decorate([
        HostListener('click', ['$event']),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], MaskDirective.prototype, "onFocus", null);
    tslib_1.__decorate([
        HostListener('keydown', ['$event']),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], MaskDirective.prototype, "a", null);
    tslib_1.__decorate([
        HostListener('paste'),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], MaskDirective.prototype, "onPaste", null);
    MaskDirective = MaskDirective_1 = tslib_1.__decorate([
        Directive({
            selector: '[mask]',
            providers: [
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(function () { return MaskDirective_1; }),
                    multi: true,
                },
                {
                    provide: NG_VALIDATORS,
                    useExisting: forwardRef(function () { return MaskDirective_1; }),
                    multi: true,
                },
                MaskService,
            ],
        }),
        tslib_1.__param(0, Inject(DOCUMENT)),
        tslib_1.__metadata("design:paramtypes", [Object, MaskService])
    ], MaskDirective);
    return MaskDirective;
}());
export { MaskDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzay5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtbWFzay8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtbWFzay9tYXNrLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBQzdHLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQXFDLGFBQWEsRUFBRSxpQkFBaUIsRUFBb0IsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2SCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFXLGlCQUFpQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBbUJ0RDtJQXdCSTtJQUNJLDJCQUEyQjtJQUNELFFBQWEsRUFDL0IsWUFBeUI7UUFEUCxhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQy9CLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBMUJmLG1CQUFjLEdBQVcsRUFBRSxDQUFDO1FBQ2xDLHNCQUFpQixHQUFpQyxFQUFFLENBQUM7UUFDckQsYUFBUSxHQUF3QixFQUFFLENBQUM7UUFDbkMsV0FBTSxHQUFzQixFQUFFLENBQUM7UUFDL0IsVUFBSyxHQUFxQixFQUFFLENBQUM7UUFDN0IsMEJBQXFCLEdBQTRDLElBQUksQ0FBQztRQUN0RSxnQkFBVyxHQUFrQyxJQUFJLENBQUM7UUFDbEQsa0JBQWEsR0FBb0MsSUFBSSxDQUFDO1FBQ3RELHdCQUFtQixHQUEwQyxJQUFJLENBQUM7UUFDbEUsaUJBQVksR0FBbUMsSUFBSSxDQUFDO1FBQ3BELG9CQUFlLEdBQXNDLElBQUksQ0FBQztRQUMxRCxlQUFVLEdBQWlDLElBQUksQ0FBQztRQUd4RCxjQUFTLEdBQWtCLElBQUksQ0FBQztRQUt4QywyQkFBMkI7UUFDcEIsYUFBUSxHQUFHLFVBQUMs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QUM7Ozs7MENBNkJuQztJQUdEO1FBREMsWUFBWSxDQUFDLE9BQU8sQ0FBQzs7OztnREFHckI7SUE3UVEsYUFBYTtRQWhCekIsU0FBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFFBQVE7WUFDbEIsU0FBUyxFQUFFO2dCQUNQO29CQUNJLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLGVBQWEsRUFBYixDQUFhLENBQUM7b0JBQzVDLEtBQUssRUFBRSxJQUFJO2lCQUNkO2dCQUNEO29CQUNJLE9BQU8sRUFBRSxhQUFhO29CQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLGNBQU0sT0FBQSxlQUFhLEVBQWIsQ0FBYSxDQUFDO29CQUM1QyxLQUFLLEVBQUUsSUFBSTtpQkFDZDtnQkFDRCxXQUFXO2FBQ2Q7U0FDSixDQUFDO1FBMkJPLG1CQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTt5REFDSyxXQUFXO09BM0I1QixhQUFhLENBNFV6QjtJQUFELG9CQUFDO0NBQUEsQUE1VUQsSUE0VUM7U0E1VVksYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgZm9yd2FyZFJlZiwgSG9zdExpc3RlbmVyLCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBGb3JtQ29udHJvbCwgTkdfVkFMSURBVE9SUywgTkdfVkFMVUVfQUNDRVNTT1IsIFZhbGlkYXRpb25FcnJvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNYXNrU2VydmljZSB9IGZyb20gJy4vbWFzay5zZXJ2aWNlJztcbmltcG9ydCB7IElDb25maWcsIHdpdGhvdXRWYWxpZGF0aW9uIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgQ3VzdG9tS2V5Ym9hcmRFdmVudCB9IGZyb20gJy4vY3VzdG9tLWtleWJvYXJkLWV2ZW50JztcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbbWFza10nLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgICAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hc2tEaXJlY3RpdmUpLFxuICAgICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgICAgICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXNrRGlyZWN0aXZlKSxcbiAgICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBNYXNrU2VydmljZSxcbiAgICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXNrRGlyZWN0aXZlIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uQ2hhbmdlcyB7XG4gICAgQElucHV0KCdtYXNrJykgcHVibGljIG1hc2tFeHByZXNzaW9uOiBzdHJpbmcgPSAnJztcbiAgICBASW5wdXQoKSBwdWJsaWMgc3BlY2lhbENoYXJhY3RlcnM6IElDb25maWdbJ3NwZWNpYWxDaGFyYWN0ZXJzJ10gPSBbXTtcbiAgICBASW5wdXQoKSBwdWJsaWMgcGF0dGVybnM6IElDb25maWdbJ3BhdHRlcm5zJ10gPSB7fTtcbiAgICBASW5wdXQoKSBwdWJsaWMgcHJlZml4OiBJQ29uZmlnWydwcmVmaXgnXSA9ICcnO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBzdWZpeDogSUNvbmZpZ1snc3VmaXgnXSA9ICcnO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBkcm9wU3BlY2lhbENoYXJhY3RlcnM6IElDb25maWdbJ2Ryb3BTcGVjaWFsQ2hhcmFjdGVycyddIHwgbnVsbCA9IG51bGw7XG4gICAgQElucHV0KCkgcHVibGljIGhpZGRlbklucHV0OiBJQ29uZmlnWydoaWRkZW5JbnB1dCddIHwgbnVsbCA9IG51bGw7XG4gICAgQElucHV0KCkgcHVibGljIHNob3dNYXNrVHlwZWQ6IElDb25maWdbJ3Nob3dNYXNrVHlwZWQnXSB8IG51bGwgPSBudWxsO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBzaG93bk1hc2tFeHByZXNzaW9uOiBJQ29uZmlnWydzaG93bk1hc2tFeHByZXNzaW9uJ10gfCBudWxsID0gbnVsbDtcbiAgICBASW5wdXQoKSBwdWJsaWMgc2hvd1RlbXBsYXRlOiBJQ29uZmlnWydzaG93VGVtcGxhdGUnXSB8IG51bGwgPSBudWxsO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBjbGVhcklmTm90TWF0Y2g6IElDb25maWdbJ2NsZWFySWZOb3RNYXRjaCddIHwgbnVsbCA9IG51bGw7XG4gICAgQElucHV0KCkgcHVibGljIHZhbGlkYXRpb246IElDb25maWdbJ3ZhbGlkYXRpb24nXSB8IG51bGwgPSBudWxsO1xuICAgIHByaXZhdGUgX21hc2tWYWx1ZSE6IHN0cmluZztcbiAgICBwcml2YXRlIF9pbnB1dFZhbHVlITogc3RyaW5nO1xuICAgIHByaXZhdGUgX3Bvc2l0aW9uOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBwcml2YXRlIF9zdGFydCE6IG51bWJlcjtcbiAgICBwcml2YXRlIF9lbmQhOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfY29kZSE6IHN0cmluZztcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBwdWJsaWMgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcbiAgICBwdWJsaWMgb25Ub3VjaCA9ICgpID0+IHt9O1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55LFxuICAgICAgICBwcml2YXRlIF9tYXNrU2VydmljZTogTWFza1NlcnZpY2VcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIG1hc2tFeHByZXNzaW9uLFxuICAgICAgICAgICAgc3BlY2lhbENoYXJhY3RlcnMsXG4gICAgICAgICAgICBwYXR0ZXJucyxcbiAgICAgICAgICAgIHByZWZpeCxcbiAgICAgICAgICAgIHN1Zml4LFxuICAgICAgICAgICAgZHJvcFNwZWNpYWxDaGFyYWN0ZXJzLFxuICAgICAgICAgICAgaGlkZGVuSW5wdXQsXG4gICAgICAgICAgICBzaG93TWFza1R5cGVkLFxuICAgICAgICAgICAgc2hvd25NYXNrRXhwcmVzc2lvbixcbiAgICAgICAgICAgIHNob3dUZW1wbGF0ZSxcbiAgICAgICAgICAgIGNsZWFySWZOb3RNYXRjaCxcbiAgICAgICAgICAgIHZhbGlkYXRpb24sXG4gICAgICAgIH0gPSBjaGFuZ2VzO1xuICAgICAgICBpZiAobWFza0V4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMuX21hc2tWYWx1ZSA9IGNoYW5nZXMubWFza0V4cHJlc3Npb24uY3VycmVudFZhbHVlIHx8ICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcGVjaWFsQ2hhcmFjdGVycykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICFzcGVjaWFsQ2hhcmFjdGVycy5jdXJyZW50VmFsdWUgfHxcbiAgICAgICAgICAgICAgICAhQXJyYXkuaXNBcnJheShzcGVjaWFsQ2hhcmFjdGVycy5jdXJyZW50VmFsdWUpIHx8XG4gICAgICAgICAgICAgICAgKEFycmF5LmlzQXJyYXkoc3BlY2lhbENoYXJhY3RlcnMuY3VycmVudFZhbHVlKSAmJiAhc3BlY2lhbENoYXJhY3RlcnMuY3VycmVudFZhbHVlLmxlbmd0aClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLm1hc2tTcGVjaWFsQ2hhcmFjdGVycyA9IGNoYW5nZXMuc3BlY2lhbENoYXJhY3RlcnMuY3VycmVudFZhbHVlIHx8ICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXR0ZXJucykge1xuICAgICAgICAgICAgdGhpcy5fbWFza1NlcnZpY2UubWFza0F2YWlsYWJsZVBhdHRlcm5zID0gcGF0dGVybnMuY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLnByZWZpeCA9IHByZWZpeC5jdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN1Zml4KSB7XG4gICAgICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5zdWZpeCA9IHN1Zml4LmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHJvcFNwZWNpYWxDaGFyYWN0ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5kcm9wU3BlY2lhbENoYXJhY3RlcnMgPSBkcm9wU3BlY2lhbENoYXJhY3RlcnMuY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoaWRkZW5JbnB1dCkge1xuICAgICAgICAgICAgdGhpcy5fbWFza1NlcnZpY2UuaGlkZGVuSW5wdXQgPSBoaWRkZW5JbnB1dC5jdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNob3dNYXNrVHlwZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLnNob3dNYXNrVHlwZWQgPSBzaG93TWFza1R5cGVkLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2hvd25NYXNrRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgdGhpcy5fbWFza1NlcnZpY2Uuc2hvd25NYXNrRXhwcmVzc2lvbiA9IHNob3duTWFza0V4cHJlc3Npb24uY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaG93VGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLnNob3dUZW1wbGF0ZSA9IHNob3dUZW1wbGF0ZS5jdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsZWFySWZOb3RNYXRjaCkge1xuICAgICAgICAgICAgdGhpcy5fbWFza1NlcnZpY2UuY2xlYXJJZk5vdE1hdGNoID0gY2xlYXJJZk5vdE1hdGNoLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsaWRhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fbWFza1NlcnZpY2UudmFsaWRhdGlvbiA9IHZhbGlkYXRpb24uY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2FwcGx5TWFzaygpO1xuICAgIH1cblxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogY3ljbG9tYXRpYy1jb21wbGV4aXR5XG4gICAgcHVibGljIHZhbGlkYXRlKHsgdmFsdWUgfTogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCB7XG4gICAgICAgIGlmICghdGhpcy5fbWFza1NlcnZpY2UudmFsaWRhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX21hc2tTZXJ2aWNlLmlwRXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4geyAnTWFzayBlcnJvcic6IHRydWUgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fbWFza1ZhbHVlLnN0YXJ0c1dpdGgoJ2RvdF9zZXBhcmF0b3InKSB8fCB0aGlzLl9tYXNrVmFsdWUuc3RhcnRzV2l0aCgnY29tbWFfc2VwYXJhdG9yJykpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh3aXRob3V0VmFsaWRhdGlvbi5pbmNsdWRlcyh0aGlzLl9tYXNrVmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fbWFza1NlcnZpY2UuY2xlYXJJZk5vdE1hdGNoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUudG9TdHJpbmcoKS5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgbGV0IGNvdW50ZXJPZk9wdDogbnVtYmVyID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuX21hc2tTZXJ2aWNlLm1hc2tBdmFpbGFibGVQYXR0ZXJucykge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWFza1NlcnZpY2UubWFza0F2YWlsYWJsZVBhdHRlcm5zW2tleV0ub3B0aW9uYWwgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWFza1NlcnZpY2UubWFza0F2YWlsYWJsZVBhdHRlcm5zW2tleV0ub3B0aW9uYWwgPT09IHRydWVcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX21hc2tWYWx1ZS5pbmRleE9mKGtleSkgIT09IHRoaXMuX21hc2tWYWx1ZS5sYXN0SW5kZXhPZihrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHQ6IHN0cmluZyA9IHRoaXMuX21hc2tWYWx1ZS5zcGxpdCgnJykuZmlsdGVyKChpOiBzdHJpbmcpID0+IGkgPT09IGtleSkuam9pbignJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudGVyT2ZPcHQgKz0gb3B0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9tYXNrVmFsdWUuaW5kZXhPZihrZXkpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRlck9mT3B0Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWFza1ZhbHVlLmluZGV4T2Yoa2V5KSAhPT0gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnRvU3RyaW5nKCkubGVuZ3RoID49IHRoaXMuX21hc2tWYWx1ZS5pbmRleE9mKGtleSlcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY291bnRlck9mT3B0ID09PSB0aGlzLl9tYXNrVmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXNrVmFsdWUuaW5kZXhPZignKicpID09PSAxIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFza1ZhbHVlLmluZGV4T2YoJz8nKSA9PT0gMSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuX21hc2tWYWx1ZS5pbmRleE9mKCd7JykgPT09IDFcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAodGhpcy5fbWFza1ZhbHVlLmluZGV4T2YoJyonKSA+IDEgJiYgdmFsdWUudG9TdHJpbmcoKS5sZW5ndGggPCB0aGlzLl9tYXNrVmFsdWUuaW5kZXhPZignKicpKSB8fFxuICAgICAgICAgICAgICAgICh0aGlzLl9tYXNrVmFsdWUuaW5kZXhPZignPycpID4gMSAmJiB2YWx1ZS50b1N0cmluZygpLmxlbmd0aCA8IHRoaXMuX21hc2tWYWx1ZS5pbmRleE9mKCc/JykpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyAnTWFzayBlcnJvcic6IHRydWUgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXNrVmFsdWUuaW5kZXhPZignKicpID09PSAtMSB8fCB0aGlzLl9tYXNrVmFsdWUuaW5kZXhPZignPycpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxlbmd0aDogbnVtYmVyID0gdGhpcy5fbWFza1NlcnZpY2UuZHJvcFNwZWNpYWxDaGFyYWN0ZXJzXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5fbWFza1ZhbHVlLmxlbmd0aCAtIHRoaXMuX21hc2tTZXJ2aWNlLmNoZWNrU3BlY2lhbENoYXJBbW91bnQodGhpcy5fbWFza1ZhbHVlKSAtIGNvdW50ZXJPZk9wdFxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuX21hc2tWYWx1ZS5sZW5ndGggLSBjb3VudGVyT2ZPcHQ7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnRvU3RyaW5nKCkubGVuZ3RoIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7ICdNYXNrIGVycm9yJzogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdpbnB1dCcsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIG9uSW5wdXQoZTogQ3VzdG9tS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICBjb25zdCBlbDogSFRNTElucHV0RWxlbWVudCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgIHRoaXMuX2lucHV0VmFsdWUgPSBlbC52YWx1ZTtcbiAgICAgICAgaWYgKCF0aGlzLl9tYXNrVmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UoZWwudmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uOiBudW1iZXIgPVxuICAgICAgICAgICAgZWwuc2VsZWN0aW9uU3RhcnQgPT09IDFcbiAgICAgICAgICAgICAgICA/IChlbC5zZWxlY3Rpb25TdGFydCBhcyBudW1iZXIpICsgdGhpcy5fbWFza1NlcnZpY2UucHJlZml4Lmxlbmd0aFxuICAgICAgICAgICAgICAgIDogKGVsLnNlbGVjdGlvblN0YXJ0IGFzIG51bWJlcik7XG4gICAgICAgIGxldCBjYXJldFNoaWZ0OiBudW1iZXIgPSAwO1xuICAgICAgICBsZXQgYmFja3NwYWNlU2hpZnQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbWFza1NlcnZpY2UuYXBwbHlWYWx1ZUNoYW5nZXMocG9zaXRpb24sIChzaGlmdDogbnVtYmVyLCBfYmFja3NwYWNlU2hpZnQ6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgIGNhcmV0U2hpZnQgPSBzaGlmdDtcbiAgICAgICAgICAgIGJhY2tzcGFjZVNoaWZ0ID0gX2JhY2tzcGFjZVNoaWZ0O1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gb25seSBzZXQgdGhlIHNlbGVjdGlvbiBpZiB0aGUgZWxlbWVudCBpcyBhY3RpdmVcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IHRoaXMuX3Bvc2l0aW9uID09PSAxICYmIHRoaXMuX2lucHV0VmFsdWUubGVuZ3RoID09PSAxID8gbnVsbCA6IHRoaXMuX3Bvc2l0aW9uO1xuICAgICAgICBlbC5zZWxlY3Rpb25TdGFydCA9IGVsLnNlbGVjdGlvbkVuZCA9XG4gICAgICAgICAgICB0aGlzLl9wb3NpdGlvbiAhPT0gbnVsbFxuICAgICAgICAgICAgICAgID8gdGhpcy5fcG9zaXRpb25cbiAgICAgICAgICAgICAgICA6IHBvc2l0aW9uICtcbiAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICAgICAgICAgICAgICAgICAgKHRoaXMuX2NvZGUgPT09ICdCYWNrc3BhY2UnICYmICFiYWNrc3BhY2VTaGlmdCA/IDAgOiBjYXJldFNoaWZ0KTtcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSBudWxsO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxuICAgIHB1YmxpYyBvbkJsdXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLmNsZWFySWZOb3RNYXRjaEZuKCk7XG4gICAgICAgIHRoaXMub25Ub3VjaCgpO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25Gb2N1cyhlOiBNb3VzZUV2ZW50IHwgQ3VzdG9tS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICBjb25zdCBlbDogSFRNTElucHV0RWxlbWVudCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHBvc1N0YXJ0OiBudW1iZXIgPSAwO1xuICAgICAgICBjb25zdCBwb3NFbmQ6IG51bWJlciA9IDA7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGVsICE9PSBudWxsICYmXG4gICAgICAgICAgICBlbC5zZWxlY3Rpb25TdGFydCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgZWwuc2VsZWN0aW9uU3RhcnQgPT09IGVsLnNlbGVjdGlvbkVuZCAmJlxuICAgICAgICAgICAgZWwuc2VsZWN0aW9uU3RhcnQgPiB0aGlzLl9tYXNrU2VydmljZS5wcmVmaXgubGVuZ3RoICYmXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgICAgIChlIGFzIGFueSkua2V5Q29kZSAhPT0gMzhcbiAgICAgICAgKVxuICAgICAgICAgICAgaWYgKHRoaXMuX21hc2tTZXJ2aWNlLnNob3dNYXNrVHlwZWQpIHtcbiAgICAgICAgICAgICAgICAvLyApIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5tYXNrSXNTaG93biA9IHRoaXMuX21hc2tTZXJ2aWNlLnNob3dNYXNrSW5JbnB1dCgpO1xuICAgICAgICAgICAgICAgIGlmIChlbC5zZXRTZWxlY3Rpb25SYW5nZSAmJiB0aGlzLl9tYXNrU2VydmljZS5wcmVmaXggKyB0aGlzLl9tYXNrU2VydmljZS5tYXNrSXNTaG93biA9PT0gZWwudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgZWwuc2V0U2VsZWN0aW9uUmFuZ2UocG9zU3RhcnQsIHBvc0VuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlbC5zZXRTZWxlY3Rpb25SYW5nZSAmJiB0aGlzLl9tYXNrU2VydmljZS5tYXNrSXNTaG93biAhPT0gZWwudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgZWwuc2V0U2VsZWN0aW9uUmFuZ2UocG9zU3RhcnQsIHBvc0VuZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbnB1dFZhbHVlLm1hdGNoKCdbd9CwLdGP0JAt0K9dJykgfHwgdGhpcy5faW5wdXRWYWx1ZS5tYXRjaCgnW2Etel18W0EtWl0nKSkge1xuICAgICAgICAgICAgICAgICAgICBwb3NTdGFydDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgZWwudmFsdWUgPVxuICAgICAgICAgICAgIWVsLnZhbHVlIHx8IGVsLnZhbHVlID09PSB0aGlzLl9tYXNrU2VydmljZS5wcmVmaXhcbiAgICAgICAgICAgICAgICA/IHRoaXMuX21hc2tTZXJ2aWNlLnByZWZpeCArIHRoaXMuX21hc2tTZXJ2aWNlLm1hc2tJc1Nob3duXG4gICAgICAgICAgICAgICAgOiBlbC52YWx1ZTtcbiAgICAgICAgLyoqIGZpeCBvZiBjdXJzb3IgcG9zaXRpb24gd2l0aCBwcmVmaXggd2hlbiBtb3VzZSBjbGljayBvY2N1ciAqL1xuICAgICAgICBpZiAoKChlbC5zZWxlY3Rpb25TdGFydCBhcyBudW1iZXIpIHx8IChlbC5zZWxlY3Rpb25FbmQgYXMgbnVtYmVyKSkgPD0gdGhpcy5fbWFza1NlcnZpY2UucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICAgICAgZWwuc2VsZWN0aW9uU3RhcnQgPSB0aGlzLl9tYXNrU2VydmljZS5wcmVmaXgubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bicsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIGEoZTogQ3VzdG9tS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9jb2RlID0gZS5jb2RlID8gZS5jb2RlIDogZS5rZXk7XG4gICAgICAgIGNvbnN0IGVsOiBIVE1MSW5wdXRFbGVtZW50ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgdGhpcy5fbWFza1NlcnZpY2Uuc2VsU3RhcnQgPSBlbC5zZWxlY3Rpb25TdGFydDtcbiAgICAgICAgdGhpcy5fbWFza1NlcnZpY2Uuc2VsRW5kID0gZWwuc2VsZWN0aW9uRW5kO1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAzOCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IDM3IHx8IGUua2V5Q29kZSA9PT0gOCkge1xuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMzcpIHtcbiAgICAgICAgICAgICAgICBlbC5zZWxlY3Rpb25TdGFydCA9IChlbC5zZWxlY3Rpb25FbmQgYXMgbnVtYmVyKSAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSA4ICYmIGVsLnZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGVsLnNlbGVjdGlvblN0YXJ0ID0gZWwuc2VsZWN0aW9uRW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIChlbC5zZWxlY3Rpb25TdGFydCBhcyBudW1iZXIpIDw9IHRoaXMuX21hc2tTZXJ2aWNlLnByZWZpeC5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAoZWwuc2VsZWN0aW9uRW5kIGFzIG51bWJlcikgPD0gdGhpcy5fbWFza1NlcnZpY2UucHJlZml4Lmxlbmd0aFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY3Vyc29yU3RhcnQ6IG51bWJlciB8IG51bGwgPSBlbC5zZWxlY3Rpb25TdGFydDtcbiAgICAgICAgICAgIC8vIHRoaXMub25Gb2N1cyhlKTtcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDggJiYgY3Vyc29yU3RhcnQgPT09IDAgJiYgZWwuc2VsZWN0aW9uRW5kID09PSBlbC52YWx1ZS5sZW5ndGggJiYgZWwudmFsdWUubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9zaXRpb24gPSB0aGlzLl9tYXNrU2VydmljZS5wcmVmaXggPyB0aGlzLl9tYXNrU2VydmljZS5wcmVmaXgubGVuZ3RoIDogMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5hcHBseU1hc2sodGhpcy5fbWFza1NlcnZpY2UucHJlZml4LCB0aGlzLl9tYXNrU2VydmljZS5tYXNrRXhwcmVzc2lvbiwgdGhpcy5fcG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigncGFzdGUnKVxuICAgIHB1YmxpYyBvblBhc3RlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgIH1cblxuICAgIC8qKiBJdCB3cml0ZXMgdGhlIHZhbHVlIGluIHRoZSBpbnB1dCAqL1xuICAgIHB1YmxpYyBhc3luYyB3cml0ZVZhbHVlKGlucHV0VmFsdWU6IHN0cmluZyB8IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoaW5wdXRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpbnB1dFZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dFZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IFN0cmluZyhpbnB1dFZhbHVlKTtcbiAgICAgICAgICAgIGlucHV0VmFsdWUgPSB0aGlzLl9tYXNrVmFsdWUuc3RhcnRzV2l0aCgnZG90X3NlcGFyYXRvcicpID8gaW5wdXRWYWx1ZS5yZXBsYWNlKCcuJywgJywnKSA6IGlucHV0VmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5pc051bWJlclZhbHVlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAoaW5wdXRWYWx1ZSAmJiB0aGlzLl9tYXNrU2VydmljZS5tYXNrRXhwcmVzc2lvbikgfHxcbiAgICAgICAgKHRoaXMuX21hc2tTZXJ2aWNlLm1hc2tFeHByZXNzaW9uICYmICh0aGlzLl9tYXNrU2VydmljZS5wcmVmaXggfHwgdGhpcy5fbWFza1NlcnZpY2Uuc2hvd01hc2tUeXBlZCkpXG4gICAgICAgICAgICA/ICh0aGlzLl9tYXNrU2VydmljZS5mb3JtRWxlbWVudFByb3BlcnR5ID0gW1xuICAgICAgICAgICAgICAgICAgJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLmFwcGx5TWFzayhpbnB1dFZhbHVlLCB0aGlzLl9tYXNrU2VydmljZS5tYXNrRXhwcmVzc2lvbiksXG4gICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICA6ICh0aGlzLl9tYXNrU2VydmljZS5mb3JtRWxlbWVudFByb3BlcnR5ID0gWyd2YWx1ZScsIGlucHV0VmFsdWVdKTtcbiAgICAgICAgdGhpcy5faW5wdXRWYWx1ZSA9IGlucHV0VmFsdWU7XG4gICAgfVxuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLm9uQ2hhbmdlID0gdGhpcy5vbkNoYW5nZTtcbiAgICB9XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uVG91Y2ggPSBmbjtcbiAgICB9XG5cbiAgICAvKiogSXQgZGlzYWJsZXMgdGhlIGlucHV0IGVsZW1lbnQgKi9cbiAgICBwdWJsaWMgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLmZvcm1FbGVtZW50UHJvcGVydHkgPSBbJ2Rpc2FibGVkJywgaXNEaXNhYmxlZF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcmVwZWF0UGF0dGVyblN5bWJvbHMobWFza0V4cDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIChtYXNrRXhwLm1hdGNoKC97WzAtOV0rfS8pICYmXG4gICAgICAgICAgICAgICAgbWFza0V4cC5zcGxpdCgnJykucmVkdWNlKChhY2N1bTogc3RyaW5nLCBjdXJydmFsOiBzdHJpbmcsIGluZGV4OiBudW1iZXIpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGFydCA9IGN1cnJ2YWwgPT09ICd7JyA/IGluZGV4IDogdGhpcy5fc3RhcnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJ2YWwgIT09ICd9Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hc2tTZXJ2aWNlLl9maW5kU3BlY2lhbENoYXIoY3VycnZhbCkgPyBhY2N1bSArIGN1cnJ2YWwgOiBhY2N1bTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbmQgPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVwZWF0TnVtYmVyOiBudW1iZXIgPSBOdW1iZXIobWFza0V4cC5zbGljZSh0aGlzLl9zdGFydCArIDEsIHRoaXMuX2VuZCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXBhY2VXaXRoOiBzdHJpbmcgPSBuZXcgQXJyYXkocmVwZWF0TnVtYmVyICsgMSkuam9pbihtYXNrRXhwW3RoaXMuX3N0YXJ0IC0gMV0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW0gKyByZXBhY2VXaXRoO1xuICAgICAgICAgICAgICAgIH0sICcnKSkgfHxcbiAgICAgICAgICAgIG1hc2tFeHBcbiAgICAgICAgKTtcbiAgICB9XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIHByaXZhdGUgX2FwcGx5TWFzaygpOiBhbnkge1xuICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5tYXNrRXhwcmVzc2lvbiA9IHRoaXMuX3JlcGVhdFBhdHRlcm5TeW1ib2xzKHRoaXMuX21hc2tWYWx1ZSB8fCAnJyk7XG4gICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLmZvcm1FbGVtZW50UHJvcGVydHkgPSBbXG4gICAgICAgICAgICAndmFsdWUnLFxuICAgICAgICAgICAgdGhpcy5fbWFza1NlcnZpY2UuYXBwbHlNYXNrKHRoaXMuX2lucHV0VmFsdWUsIHRoaXMuX21hc2tTZXJ2aWNlLm1hc2tFeHByZXNzaW9uKSxcbiAgICAgICAgXTtcbiAgICB9XG59XG4iXX0=