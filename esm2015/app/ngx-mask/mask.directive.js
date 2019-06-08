import * as tslib_1 from "tslib";
var MaskDirective_1;
import { Directive, forwardRef, HostListener, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaskService } from './mask.service';
import { withoutValidation } from './config';
let MaskDirective = MaskDirective_1 = class MaskDirective {
    constructor(
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
        this.onChange = (_) => { };
        this.onTouch = () => { };
    }
    ngOnChanges(changes) {
        // tslint:disable-next-line:max-line-length
        const { maskExpression, specialCharacters, patterns, prefix, sufix, dropSpecialCharacters, hiddenInput, showMaskTyped, shownMaskExpression, showTemplate, clearIfNotMatch, validation, } = changes;
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
    }
    // tslint:disable-next-line: cyclomatic-complexity
    validate({ value }) {
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
            let counterOfOpt = 0;
            for (const key in this._maskService.maskAvailablePatterns) {
                if (this._maskService.maskAvailablePatterns[key].optional &&
                    this._maskService.maskAvailablePatterns[key].optional === true) {
                    if (this._maskValue.indexOf(key) !== this._maskValue.lastIndexOf(key)) {
                        const opt = this._maskValue.split('').filter((i) => i === key).join('');
                        counterOfOpt += opt.length;
                    }
                    else if (this._maskValue.indexOf(key) !== -1) {
                        counterOfOpt++;
                    }
                    if (this._maskValue.indexOf(key) !== -1 &&
                        value.toString().length >= this._maskValue.indexOf(key)) {
                        return null;
                    }
                    if (counterOfOpt === this._maskValue.length) {
                        return null;
                    }
                }
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
                const length = this._maskService.dropSpecialCharacters
                    ? this._maskValue.length - this._maskService.checkSpecialCharAmount(this._maskValue) - counterOfOpt
                    : this._maskValue.length - counterOfOpt;
                if (value.toString().length < length) {
                    return { 'Mask error': true };
                }
            }
        }
        return null;
    }
    onInput(e) {
        const el = e.target;
        this._inputValue = el.value;
        if (!this._maskValue) {
            this.onChange(el.value);
            return;
        }
        const position = el.selectionStart === 1
            ? el.selectionStart + this._maskService.prefix.length
            : el.selectionStart;
        let caretShift = 0;
        let backspaceShift = false;
        this._maskService.applyValueChanges(position, (shift, _backspaceShift) => {
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
    }
    onBlur() {
        this._maskService.clearIfNotMatchFn();
        this.onTouch();
    }
    onFocus(e) {
        const el = e.target;
        const posStart = 0;
        const posEnd = 0;
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
    }
    a(e) {
        this._code = e.code ? e.code : e.key;
        const el = e.target;
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
            const cursorStart = el.selectionStart;
            // this.onFocus(e);
            if (e.keyCode === 8 && cursorStart === 0 && el.selectionEnd === el.value.length && el.value.length !== 0) {
                this._position = this._maskService.prefix ? this._maskService.prefix.length : 0;
                this._maskService.applyMask(this._maskService.prefix, this._maskService.maskExpression, this._position);
            }
        }
    }
    onPaste() {
        this._position = Number.MAX_SAFE_INTEGER;
    }
    /** It writes the value in the input */
    writeValue(inputValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        });
    }
    // tslint:disable-next-line
    registerOnChange(fn) {
        this.onChange = fn;
        this._maskService.onChange = this.onChange;
    }
    // tslint:disable-next-line
    registerOnTouched(fn) {
        this.onTouch = fn;
    }
    /** It disables the input element */
    setDisabledState(isDisabled) {
        this._maskService.formElementProperty = ['disabled', isDisabled];
    }
    _repeatPatternSymbols(maskExp) {
        return ((maskExp.match(/{[0-9]+}/) &&
            maskExp.split('').reduce((accum, currval, index) => {
                this._start = currval === '{' ? index : this._start;
                if (currval !== '}') {
                    return this._maskService._findSpecialChar(currval) ? accum + currval : accum;
                }
                this._end = index;
                const repeatNumber = Number(maskExp.slice(this._start + 1, this._end));
                const repaceWith = new Array(repeatNumber + 1).join(maskExp[this._start - 1]);
                return accum + repaceWith;
            }, '')) ||
            maskExp);
    }
    // tslint:disable-next-line:no-any
    _applyMask() {
        this._maskService.maskExpression = this._repeatPatternSymbols(this._maskValue || '');
        this._maskService.formElementProperty = [
            'value',
            this._maskService.applyMask(this._inputValue, this._maskService.maskExpression),
        ];
    }
};
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
                useExisting: forwardRef(() => MaskDirective_1),
                multi: true,
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => MaskDirective_1),
                multi: true,
            },
            MaskService,
        ],
    }),
    tslib_1.__param(0, Inject(DOCUMENT)),
    tslib_1.__metadata("design:paramtypes", [Object, MaskService])
], MaskDirective);
export { MaskDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzay5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtbWFzay8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtbWFzay9tYXNrLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUM3RyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFxQyxhQUFhLEVBQUUsaUJBQWlCLEVBQW9CLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkgsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBVyxpQkFBaUIsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQW1CdEQsSUFBYSxhQUFhLHFCQUExQixNQUFhLGFBQWE7SUF3QnRCO0lBQ0ksMkJBQTJCO0lBQ0QsUUFBYSxFQUMvQixZQUF5QjtRQURQLGFBQVEsR0FBUixRQUFRLENBQUs7UUFDL0IsaUJBQVksR0FBWixZQUFZLENBQWE7UUExQmYsbUJBQWMsR0FBVyxFQUFFLENBQUM7UUFDbEMsc0JBQWlCLEdBQWlDLEVBQUUsQ0FBQztRQUNyRCxhQUFRLEdBQXdCLEVBQUUsQ0FBQztRQUNuQyxXQUFNLEdBQXNCLEVBQUUsQ0FBQztRQUMvQixVQUFLLEdBQXFCLEVBQUUsQ0FBQztRQUM3QiwwQkFBcUIsR0FBNEMsSUFBSSxDQUFDO1FBQ3RFLGdCQUFXLEdBQWtDLElBQUksQ0FBQztRQUNsRCxrQkFBYSxHQUFvQyxJQUFJLENBQUM7UUFDdEQsd0JBQW1CLEdBQTBDLElBQUksQ0FBQztRQUNsRSxpQkFBWSxHQUFtQyxJQUFJLENBQUM7UUFDcEQsb0JBQWUsR0FBc0MsSUFBSSxDQUFDO1FBQzFELGVBQVUsR0FBaUMsSUFBSSxDQUFDO1FBR3hELGNBQVMsR0FBa0IsSUFBSSxDQUFDO1FBS3hD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QUFRLENBQUMsQ0FBQzs7OztzQ0E2Qm5DO0FBR0Q7SUFEQyxZQUFZLENBQUMsT0FBTyxDQUFDOzs7OzRDQUdyQjtBQTdRUSxhQUFhO0lBaEJ6QixTQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsUUFBUTtRQUNsQixTQUFTLEVBQUU7WUFDUDtnQkFDSSxPQUFPLEVBQUUsaUJBQWlCO2dCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGVBQWEsQ0FBQztnQkFDNUMsS0FBSyxFQUFFLElBQUk7YUFDZDtZQUNEO2dCQUNJLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGVBQWEsQ0FBQztnQkFDNUMsS0FBSyxFQUFFLElBQUk7YUFDZDtZQUNELFdBQVc7U0FDZDtLQUNKLENBQUM7SUEyQk8sbUJBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO3FEQUNLLFdBQVc7R0EzQjVCLGFBQWEsQ0E0VXpCO1NBNVVZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIGZvcndhcmRSZWYsIEhvc3RMaXN0ZW5lciwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgRm9ybUNvbnRyb2wsIE5HX1ZBTElEQVRPUlMsIE5HX1ZBTFVFX0FDQ0VTU09SLCBWYWxpZGF0aW9uRXJyb3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTWFza1NlcnZpY2UgfSBmcm9tICcuL21hc2suc2VydmljZSc7XG5pbXBvcnQgeyBJQ29uZmlnLCB3aXRob3V0VmFsaWRhdGlvbiB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IEN1c3RvbUtleWJvYXJkRXZlbnQgfSBmcm9tICcuL2N1c3RvbS1rZXlib2FyZC1ldmVudCc7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW21hc2tdJyxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICAgICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXNrRGlyZWN0aXZlKSxcbiAgICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWFza0RpcmVjdGl2ZSksXG4gICAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgTWFza1NlcnZpY2UsXG4gICAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWFza0RpcmVjdGl2ZSBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkNoYW5nZXMge1xuICAgIEBJbnB1dCgnbWFzaycpIHB1YmxpYyBtYXNrRXhwcmVzc2lvbjogc3RyaW5nID0gJyc7XG4gICAgQElucHV0KCkgcHVibGljIHNwZWNpYWxDaGFyYWN0ZXJzOiBJQ29uZmlnWydzcGVjaWFsQ2hhcmFjdGVycyddID0gW107XG4gICAgQElucHV0KCkgcHVibGljIHBhdHRlcm5zOiBJQ29uZmlnWydwYXR0ZXJucyddID0ge307XG4gICAgQElucHV0KCkgcHVibGljIHByZWZpeDogSUNvbmZpZ1sncHJlZml4J10gPSAnJztcbiAgICBASW5wdXQoKSBwdWJsaWMgc3VmaXg6IElDb25maWdbJ3N1Zml4J10gPSAnJztcbiAgICBASW5wdXQoKSBwdWJsaWMgZHJvcFNwZWNpYWxDaGFyYWN0ZXJzOiBJQ29uZmlnWydkcm9wU3BlY2lhbENoYXJhY3RlcnMnXSB8IG51bGwgPSBudWxsO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBoaWRkZW5JbnB1dDogSUNvbmZpZ1snaGlkZGVuSW5wdXQnXSB8IG51bGwgPSBudWxsO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBzaG93TWFza1R5cGVkOiBJQ29uZmlnWydzaG93TWFza1R5cGVkJ10gfCBudWxsID0gbnVsbDtcbiAgICBASW5wdXQoKSBwdWJsaWMgc2hvd25NYXNrRXhwcmVzc2lvbjogSUNvbmZpZ1snc2hvd25NYXNrRXhwcmVzc2lvbiddIHwgbnVsbCA9IG51bGw7XG4gICAgQElucHV0KCkgcHVibGljIHNob3dUZW1wbGF0ZTogSUNvbmZpZ1snc2hvd1RlbXBsYXRlJ10gfCBudWxsID0gbnVsbDtcbiAgICBASW5wdXQoKSBwdWJsaWMgY2xlYXJJZk5vdE1hdGNoOiBJQ29uZmlnWydjbGVhcklmTm90TWF0Y2gnXSB8IG51bGwgPSBudWxsO1xuICAgIEBJbnB1dCgpIHB1YmxpYyB2YWxpZGF0aW9uOiBJQ29uZmlnWyd2YWxpZGF0aW9uJ10gfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIF9tYXNrVmFsdWUhOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfaW5wdXRWYWx1ZSE6IHN0cmluZztcbiAgICBwcml2YXRlIF9wb3NpdGlvbjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgcHJpdmF0ZSBfc3RhcnQhOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfZW5kITogbnVtYmVyO1xuICAgIHByaXZhdGUgX2NvZGUhOiBzdHJpbmc7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgcHVibGljIG9uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG4gICAgcHVibGljIG9uVG91Y2ggPSAoKSA9PiB7fTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgcHJpdmF0ZSBfbWFza1NlcnZpY2U6IE1hc2tTZXJ2aWNlXG4gICAgKSB7fVxuXG4gICAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBtYXNrRXhwcmVzc2lvbixcbiAgICAgICAgICAgIHNwZWNpYWxDaGFyYWN0ZXJzLFxuICAgICAgICAgICAgcGF0dGVybnMsXG4gICAgICAgICAgICBwcmVmaXgsXG4gICAgICAgICAgICBzdWZpeCxcbiAgICAgICAgICAgIGRyb3BTcGVjaWFsQ2hhcmFjdGVycyxcbiAgICAgICAgICAgIGhpZGRlbklucHV0LFxuICAgICAgICAgICAgc2hvd01hc2tUeXBlZCxcbiAgICAgICAgICAgIHNob3duTWFza0V4cHJlc3Npb24sXG4gICAgICAgICAgICBzaG93VGVtcGxhdGUsXG4gICAgICAgICAgICBjbGVhcklmTm90TWF0Y2gsXG4gICAgICAgICAgICB2YWxpZGF0aW9uLFxuICAgICAgICB9ID0gY2hhbmdlcztcbiAgICAgICAgaWYgKG1hc2tFeHByZXNzaW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXNrVmFsdWUgPSBjaGFuZ2VzLm1hc2tFeHByZXNzaW9uLmN1cnJlbnRWYWx1ZSB8fCAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3BlY2lhbENoYXJhY3RlcnMpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhc3BlY2lhbENoYXJhY3RlcnMuY3VycmVudFZhbHVlIHx8XG4gICAgICAgICAgICAgICAgIUFycmF5LmlzQXJyYXkoc3BlY2lhbENoYXJhY3RlcnMuY3VycmVudFZhbHVlKSB8fFxuICAgICAgICAgICAgICAgIChBcnJheS5pc0FycmF5KHNwZWNpYWxDaGFyYWN0ZXJzLmN1cnJlbnRWYWx1ZSkgJiYgIXNwZWNpYWxDaGFyYWN0ZXJzLmN1cnJlbnRWYWx1ZS5sZW5ndGgpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5tYXNrU3BlY2lhbENoYXJhY3RlcnMgPSBjaGFuZ2VzLnNwZWNpYWxDaGFyYWN0ZXJzLmN1cnJlbnRWYWx1ZSB8fCAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAocGF0dGVybnMpIHtcbiAgICAgICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLm1hc2tBdmFpbGFibGVQYXR0ZXJucyA9IHBhdHRlcm5zLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJlZml4KSB7XG4gICAgICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5wcmVmaXggPSBwcmVmaXguY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdWZpeCkge1xuICAgICAgICAgICAgdGhpcy5fbWFza1NlcnZpY2Uuc3VmaXggPSBzdWZpeC5jdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRyb3BTcGVjaWFsQ2hhcmFjdGVycykge1xuICAgICAgICAgICAgdGhpcy5fbWFza1NlcnZpY2UuZHJvcFNwZWNpYWxDaGFyYWN0ZXJzID0gZHJvcFNwZWNpYWxDaGFyYWN0ZXJzLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGlkZGVuSW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLmhpZGRlbklucHV0ID0gaGlkZGVuSW5wdXQuY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaG93TWFza1R5cGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5zaG93TWFza1R5cGVkID0gc2hvd01hc2tUeXBlZC5jdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNob3duTWFza0V4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLnNob3duTWFza0V4cHJlc3Npb24gPSBzaG93bk1hc2tFeHByZXNzaW9uLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2hvd1RlbXBsYXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5zaG93VGVtcGxhdGUgPSBzaG93VGVtcGxhdGUuY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGVhcklmTm90TWF0Y2gpIHtcbiAgICAgICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLmNsZWFySWZOb3RNYXRjaCA9IGNsZWFySWZOb3RNYXRjaC5jdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbGlkYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLnZhbGlkYXRpb24gPSB2YWxpZGF0aW9uLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hcHBseU1hc2soKTtcbiAgICB9XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGN5Y2xvbWF0aWMtY29tcGxleGl0eVxuICAgIHB1YmxpYyB2YWxpZGF0ZSh7IHZhbHVlIH06IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwge1xuICAgICAgICBpZiAoIXRoaXMuX21hc2tTZXJ2aWNlLnZhbGlkYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9tYXNrU2VydmljZS5pcEVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIHsgJ01hc2sgZXJyb3InOiB0cnVlIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX21hc2tWYWx1ZS5zdGFydHNXaXRoKCdkb3Rfc2VwYXJhdG9yJykgfHwgdGhpcy5fbWFza1ZhbHVlLnN0YXJ0c1dpdGgoJ2NvbW1hX3NlcGFyYXRvcicpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAod2l0aG91dFZhbGlkYXRpb24uaW5jbHVkZXModGhpcy5fbWFza1ZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX21hc2tTZXJ2aWNlLmNsZWFySWZOb3RNYXRjaCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLnRvU3RyaW5nKCkubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgIGxldCBjb3VudGVyT2ZPcHQ6IG51bWJlciA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLl9tYXNrU2VydmljZS5tYXNrQXZhaWxhYmxlUGF0dGVybnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLm1hc2tBdmFpbGFibGVQYXR0ZXJuc1trZXldLm9wdGlvbmFsICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLm1hc2tBdmFpbGFibGVQYXR0ZXJuc1trZXldLm9wdGlvbmFsID09PSB0cnVlXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tYXNrVmFsdWUuaW5kZXhPZihrZXkpICE9PSB0aGlzLl9tYXNrVmFsdWUubGFzdEluZGV4T2Yoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3B0OiBzdHJpbmcgPSB0aGlzLl9tYXNrVmFsdWUuc3BsaXQoJycpLmZpbHRlcigoaTogc3RyaW5nKSA9PiBpID09PSBrZXkpLmpvaW4oJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRlck9mT3B0ICs9IG9wdC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fbWFza1ZhbHVlLmluZGV4T2Yoa2V5KSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ZXJPZk9wdCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21hc2tWYWx1ZS5pbmRleE9mKGtleSkgIT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS50b1N0cmluZygpLmxlbmd0aCA+PSB0aGlzLl9tYXNrVmFsdWUuaW5kZXhPZihrZXkpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50ZXJPZk9wdCA9PT0gdGhpcy5fbWFza1ZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFza1ZhbHVlLmluZGV4T2YoJyonKSA9PT0gMSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuX21hc2tWYWx1ZS5pbmRleE9mKCc/JykgPT09IDEgfHxcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXNrVmFsdWUuaW5kZXhPZigneycpID09PSAxXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgKHRoaXMuX21hc2tWYWx1ZS5pbmRleE9mKCcqJykgPiAxICYmIHZhbHVlLnRvU3RyaW5nKCkubGVuZ3RoIDwgdGhpcy5fbWFza1ZhbHVlLmluZGV4T2YoJyonKSkgfHxcbiAgICAgICAgICAgICAgICAodGhpcy5fbWFza1ZhbHVlLmluZGV4T2YoJz8nKSA+IDEgJiYgdmFsdWUudG9TdHJpbmcoKS5sZW5ndGggPCB0aGlzLl9tYXNrVmFsdWUuaW5kZXhPZignPycpKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgJ01hc2sgZXJyb3InOiB0cnVlIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fbWFza1ZhbHVlLmluZGV4T2YoJyonKSA9PT0gLTEgfHwgdGhpcy5fbWFza1ZhbHVlLmluZGV4T2YoJz8nKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsZW5ndGg6IG51bWJlciA9IHRoaXMuX21hc2tTZXJ2aWNlLmRyb3BTcGVjaWFsQ2hhcmFjdGVyc1xuICAgICAgICAgICAgICAgICAgICA/IHRoaXMuX21hc2tWYWx1ZS5sZW5ndGggLSB0aGlzLl9tYXNrU2VydmljZS5jaGVja1NwZWNpYWxDaGFyQW1vdW50KHRoaXMuX21hc2tWYWx1ZSkgLSBjb3VudGVyT2ZPcHRcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLl9tYXNrVmFsdWUubGVuZ3RoIC0gY291bnRlck9mT3B0O1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS50b1N0cmluZygpLmxlbmd0aCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyAnTWFzayBlcnJvcic6IHRydWUgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignaW5wdXQnLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvbklucHV0KGU6IEN1c3RvbUtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZWw6IEhUTUxJbnB1dEVsZW1lbnQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICB0aGlzLl9pbnB1dFZhbHVlID0gZWwudmFsdWU7XG4gICAgICAgIGlmICghdGhpcy5fbWFza1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKGVsLnZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb3NpdGlvbjogbnVtYmVyID1cbiAgICAgICAgICAgIGVsLnNlbGVjdGlvblN0YXJ0ID09PSAxXG4gICAgICAgICAgICAgICAgPyAoZWwuc2VsZWN0aW9uU3RhcnQgYXMgbnVtYmVyKSArIHRoaXMuX21hc2tTZXJ2aWNlLnByZWZpeC5sZW5ndGhcbiAgICAgICAgICAgICAgICA6IChlbC5zZWxlY3Rpb25TdGFydCBhcyBudW1iZXIpO1xuICAgICAgICBsZXQgY2FyZXRTaGlmdDogbnVtYmVyID0gMDtcbiAgICAgICAgbGV0IGJhY2tzcGFjZVNoaWZ0OiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLmFwcGx5VmFsdWVDaGFuZ2VzKHBvc2l0aW9uLCAoc2hpZnQ6IG51bWJlciwgX2JhY2tzcGFjZVNoaWZ0OiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICBjYXJldFNoaWZ0ID0gc2hpZnQ7XG4gICAgICAgICAgICBiYWNrc3BhY2VTaGlmdCA9IF9iYWNrc3BhY2VTaGlmdDtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIG9ubHkgc2V0IHRoZSBzZWxlY3Rpb24gaWYgdGhlIGVsZW1lbnQgaXMgYWN0aXZlXG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSB0aGlzLl9wb3NpdGlvbiA9PT0gMSAmJiB0aGlzLl9pbnB1dFZhbHVlLmxlbmd0aCA9PT0gMSA/IG51bGwgOiB0aGlzLl9wb3NpdGlvbjtcbiAgICAgICAgZWwuc2VsZWN0aW9uU3RhcnQgPSBlbC5zZWxlY3Rpb25FbmQgPVxuICAgICAgICAgICAgdGhpcy5fcG9zaXRpb24gIT09IG51bGxcbiAgICAgICAgICAgICAgICA/IHRoaXMuX3Bvc2l0aW9uXG4gICAgICAgICAgICAgICAgOiBwb3NpdGlvbiArXG4gICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgICAgICAgICAgICh0aGlzLl9jb2RlID09PSAnQmFja3NwYWNlJyAmJiAhYmFja3NwYWNlU2hpZnQgPyAwIDogY2FyZXRTaGlmdCk7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gbnVsbDtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdibHVyJylcbiAgICBwdWJsaWMgb25CbHVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5jbGVhcklmTm90TWF0Y2hGbigpO1xuICAgICAgICB0aGlzLm9uVG91Y2goKTtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIG9uRm9jdXMoZTogTW91c2VFdmVudCB8IEN1c3RvbUtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZWw6IEhUTUxJbnB1dEVsZW1lbnQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBjb25zdCBwb3NTdGFydDogbnVtYmVyID0gMDtcbiAgICAgICAgY29uc3QgcG9zRW5kOiBudW1iZXIgPSAwO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBlbCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgZWwuc2VsZWN0aW9uU3RhcnQgIT09IG51bGwgJiZcbiAgICAgICAgICAgIGVsLnNlbGVjdGlvblN0YXJ0ID09PSBlbC5zZWxlY3Rpb25FbmQgJiZcbiAgICAgICAgICAgIGVsLnNlbGVjdGlvblN0YXJ0ID4gdGhpcy5fbWFza1NlcnZpY2UucHJlZml4Lmxlbmd0aCAmJlxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgICAgICAoZSBhcyBhbnkpLmtleUNvZGUgIT09IDM4XG4gICAgICAgIClcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXNrU2VydmljZS5zaG93TWFza1R5cGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFza1NlcnZpY2UubWFza0lzU2hvd24gPSB0aGlzLl9tYXNrU2VydmljZS5zaG93TWFza0luSW5wdXQoKTtcbiAgICAgICAgICAgICAgICBpZiAoZWwuc2V0U2VsZWN0aW9uUmFuZ2UgJiYgdGhpcy5fbWFza1NlcnZpY2UucHJlZml4ICsgdGhpcy5fbWFza1NlcnZpY2UubWFza0lzU2hvd24gPT09IGVsLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGVsLnNldFNlbGVjdGlvblJhbmdlKHBvc1N0YXJ0LCBwb3NFbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWwuc2V0U2VsZWN0aW9uUmFuZ2UgJiYgdGhpcy5fbWFza1NlcnZpY2UubWFza0lzU2hvd24gIT09IGVsLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGVsLnNldFNlbGVjdGlvblJhbmdlKHBvc1N0YXJ0LCBwb3NFbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faW5wdXRWYWx1ZS5tYXRjaCgnW3fQsC3Rj9CQLdCvXScpIHx8IHRoaXMuX2lucHV0VmFsdWUubWF0Y2goJ1thLXpdfFtBLVpdJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zU3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIGVsLnZhbHVlID1cbiAgICAgICAgICAgICFlbC52YWx1ZSB8fCBlbC52YWx1ZSA9PT0gdGhpcy5fbWFza1NlcnZpY2UucHJlZml4XG4gICAgICAgICAgICAgICAgPyB0aGlzLl9tYXNrU2VydmljZS5wcmVmaXggKyB0aGlzLl9tYXNrU2VydmljZS5tYXNrSXNTaG93blxuICAgICAgICAgICAgICAgIDogZWwudmFsdWU7XG4gICAgICAgIC8qKiBmaXggb2YgY3Vyc29yIHBvc2l0aW9uIHdpdGggcHJlZml4IHdoZW4gbW91c2UgY2xpY2sgb2NjdXIgKi9cbiAgICAgICAgaWYgKCgoZWwuc2VsZWN0aW9uU3RhcnQgYXMgbnVtYmVyKSB8fCAoZWwuc2VsZWN0aW9uRW5kIGFzIG51bWJlcikpIDw9IHRoaXMuX21hc2tTZXJ2aWNlLnByZWZpeC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGVsLnNlbGVjdGlvblN0YXJ0ID0gdGhpcy5fbWFza1NlcnZpY2UucHJlZml4Lmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBhKGU6IEN1c3RvbUtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fY29kZSA9IGUuY29kZSA/IGUuY29kZSA6IGUua2V5O1xuICAgICAgICBjb25zdCBlbDogSFRNTElucHV0RWxlbWVudCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLnNlbFN0YXJ0ID0gZWwuc2VsZWN0aW9uU3RhcnQ7XG4gICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLnNlbEVuZCA9IGVsLnNlbGVjdGlvbkVuZDtcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMzgpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAzNyB8fCBlLmtleUNvZGUgPT09IDgpIHtcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDM3KSB7XG4gICAgICAgICAgICAgICAgZWwuc2VsZWN0aW9uU3RhcnQgPSAoZWwuc2VsZWN0aW9uRW5kIGFzIG51bWJlcikgLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gOCAmJiBlbC52YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBlbC5zZWxlY3Rpb25TdGFydCA9IGVsLnNlbGVjdGlvbkVuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAoZWwuc2VsZWN0aW9uU3RhcnQgYXMgbnVtYmVyKSA8PSB0aGlzLl9tYXNrU2VydmljZS5wcmVmaXgubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgKGVsLnNlbGVjdGlvbkVuZCBhcyBudW1iZXIpIDw9IHRoaXMuX21hc2tTZXJ2aWNlLnByZWZpeC5sZW5ndGhcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGN1cnNvclN0YXJ0OiBudW1iZXIgfCBudWxsID0gZWwuc2VsZWN0aW9uU3RhcnQ7XG4gICAgICAgICAgICAvLyB0aGlzLm9uRm9jdXMoZSk7XG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSA4ICYmIGN1cnNvclN0YXJ0ID09PSAwICYmIGVsLnNlbGVjdGlvbkVuZCA9PT0gZWwudmFsdWUubGVuZ3RoICYmIGVsLnZhbHVlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdGhpcy5fbWFza1NlcnZpY2UucHJlZml4ID8gdGhpcy5fbWFza1NlcnZpY2UucHJlZml4Lmxlbmd0aCA6IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFza1NlcnZpY2UuYXBwbHlNYXNrKHRoaXMuX21hc2tTZXJ2aWNlLnByZWZpeCwgdGhpcy5fbWFza1NlcnZpY2UubWFza0V4cHJlc3Npb24sIHRoaXMuX3Bvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ3Bhc3RlJylcbiAgICBwdWJsaWMgb25QYXN0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICB9XG5cbiAgICAvKiogSXQgd3JpdGVzIHRoZSB2YWx1ZSBpbiB0aGUgaW5wdXQgKi9cbiAgICBwdWJsaWMgYXN5bmMgd3JpdGVWYWx1ZShpbnB1dFZhbHVlOiBzdHJpbmcgfCBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGlucHV0VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaW5wdXRWYWx1ZSA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXRWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlucHV0VmFsdWUgPSBTdHJpbmcoaW5wdXRWYWx1ZSk7XG4gICAgICAgICAgICBpbnB1dFZhbHVlID0gdGhpcy5fbWFza1ZhbHVlLnN0YXJ0c1dpdGgoJ2RvdF9zZXBhcmF0b3InKSA/IGlucHV0VmFsdWUucmVwbGFjZSgnLicsICcsJykgOiBpbnB1dFZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fbWFza1NlcnZpY2UuaXNOdW1iZXJWYWx1ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgKGlucHV0VmFsdWUgJiYgdGhpcy5fbWFza1NlcnZpY2UubWFza0V4cHJlc3Npb24pIHx8XG4gICAgICAgICh0aGlzLl9tYXNrU2VydmljZS5tYXNrRXhwcmVzc2lvbiAmJiAodGhpcy5fbWFza1NlcnZpY2UucHJlZml4IHx8IHRoaXMuX21hc2tTZXJ2aWNlLnNob3dNYXNrVHlwZWQpKVxuICAgICAgICAgICAgPyAodGhpcy5fbWFza1NlcnZpY2UuZm9ybUVsZW1lbnRQcm9wZXJ0eSA9IFtcbiAgICAgICAgICAgICAgICAgICd2YWx1ZScsXG4gICAgICAgICAgICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5hcHBseU1hc2soaW5wdXRWYWx1ZSwgdGhpcy5fbWFza1NlcnZpY2UubWFza0V4cHJlc3Npb24pLFxuICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgOiAodGhpcy5fbWFza1NlcnZpY2UuZm9ybUVsZW1lbnRQcm9wZXJ0eSA9IFsndmFsdWUnLCBpbnB1dFZhbHVlXSk7XG4gICAgICAgIHRoaXMuX2lucHV0VmFsdWUgPSBpbnB1dFZhbHVlO1xuICAgIH1cblxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICAgIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5vbkNoYW5nZSA9IHRoaXMub25DaGFuZ2U7XG4gICAgfVxuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vblRvdWNoID0gZm47XG4gICAgfVxuXG4gICAgLyoqIEl0IGRpc2FibGVzIHRoZSBpbnB1dCBlbGVtZW50ICovXG4gICAgcHVibGljIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5mb3JtRWxlbWVudFByb3BlcnR5ID0gWydkaXNhYmxlZCcsIGlzRGlzYWJsZWRdO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3JlcGVhdFBhdHRlcm5TeW1ib2xzKG1hc2tFeHA6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAobWFza0V4cC5tYXRjaCgve1swLTldK30vKSAmJlxuICAgICAgICAgICAgICAgIG1hc2tFeHAuc3BsaXQoJycpLnJlZHVjZSgoYWNjdW06IHN0cmluZywgY3VycnZhbDogc3RyaW5nLCBpbmRleDogbnVtYmVyKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhcnQgPSBjdXJydmFsID09PSAneycgPyBpbmRleCA6IHRoaXMuX3N0YXJ0O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJydmFsICE9PSAnfScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXNrU2VydmljZS5fZmluZFNwZWNpYWxDaGFyKGN1cnJ2YWwpID8gYWNjdW0gKyBjdXJydmFsIDogYWNjdW07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZW5kID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcGVhdE51bWJlcjogbnVtYmVyID0gTnVtYmVyKG1hc2tFeHAuc2xpY2UodGhpcy5fc3RhcnQgKyAxLCB0aGlzLl9lbmQpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVwYWNlV2l0aDogc3RyaW5nID0gbmV3IEFycmF5KHJlcGVhdE51bWJlciArIDEpLmpvaW4obWFza0V4cFt0aGlzLl9zdGFydCAtIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtICsgcmVwYWNlV2l0aDtcbiAgICAgICAgICAgICAgICB9LCAnJykpIHx8XG4gICAgICAgICAgICBtYXNrRXhwXG4gICAgICAgICk7XG4gICAgfVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBwcml2YXRlIF9hcHBseU1hc2soKTogYW55IHtcbiAgICAgICAgdGhpcy5fbWFza1NlcnZpY2UubWFza0V4cHJlc3Npb24gPSB0aGlzLl9yZXBlYXRQYXR0ZXJuU3ltYm9scyh0aGlzLl9tYXNrVmFsdWUgfHwgJycpO1xuICAgICAgICB0aGlzLl9tYXNrU2VydmljZS5mb3JtRWxlbWVudFByb3BlcnR5ID0gW1xuICAgICAgICAgICAgJ3ZhbHVlJyxcbiAgICAgICAgICAgIHRoaXMuX21hc2tTZXJ2aWNlLmFwcGx5TWFzayh0aGlzLl9pbnB1dFZhbHVlLCB0aGlzLl9tYXNrU2VydmljZS5tYXNrRXhwcmVzc2lvbiksXG4gICAgICAgIF07XG4gICAgfVxufVxuIl19