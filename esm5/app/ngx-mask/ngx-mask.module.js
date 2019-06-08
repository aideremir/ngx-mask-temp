import * as tslib_1 from "tslib";
import { config, INITIAL_CONFIG, initialConfig, NEW_CONFIG } from './config';
import { MaskApplierService } from './mask-applier.service';
import { MaskDirective } from './mask.directive';
import { MaskPipe } from './mask.pipe';
import { NgModule } from '@angular/core';
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
    NgxMaskModule = NgxMaskModule_1 = tslib_1.__decorate([
        NgModule({
            exports: [MaskDirective, MaskPipe],
            declarations: [MaskDirective, MaskPipe],
        })
    ], NgxMaskModule);
    return NgxMaskModule;
}());
export { NgxMaskModule };
/**
 * @internal
 */
export function _configFactory(initConfig, configValue) {
    return configValue instanceof Function ? tslib_1.__assign({}, initConfig, configValue()) : tslib_1.__assign({}, initConfig, configValue);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW1hc2subW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LW1hc2svIiwic291cmNlcyI6WyJhcHAvbmd4LW1hc2svbmd4LW1hc2subW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsTUFBTSxFQUNOLGNBQWMsRUFDZCxhQUFhLEVBQ2IsVUFBVSxFQUVULE1BQU0sVUFBVSxDQUFDO0FBQ3BCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3ZDLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTTlEO0lBQUE7SUEyQkEsQ0FBQztzQkEzQlksYUFBYTtJQUNSLHFCQUFPLEdBQXJCLFVBQXNCLFdBQW1EO1FBQ3JFLE9BQU87WUFDSCxRQUFRLEVBQUUsZUFBYTtZQUN2QixTQUFTLEVBQUU7Z0JBQ1A7b0JBQ0ksT0FBTyxFQUFFLFVBQVU7b0JBQ25CLFFBQVEsRUFBRSxXQUFXO2lCQUN4QjtnQkFDRDtvQkFDSSxPQUFPLEVBQUUsY0FBYztvQkFDdkIsUUFBUSxFQUFFLGFBQWE7aUJBQzFCO2dCQUNEO29CQUNJLE9BQU8sRUFBRSxNQUFNO29CQUNmLFVBQVUsRUFBRSxjQUFjO29CQUMxQixJQUFJLEVBQUUsQ0FBQyxjQUFjLEVBQUUsVUFBVSxDQUFDO2lCQUNyQztnQkFDRCxrQkFBa0I7YUFDckI7U0FDSixDQUFDO0lBQ04sQ0FBQztJQUNhLHNCQUFRLEdBQXRCLFVBQXVCLFlBQTRCO1FBQy9DLE9BQU87WUFDSCxRQUFRLEVBQUUsZUFBYTtTQUMxQixDQUFDO0lBQ04sQ0FBQzs7SUExQlEsYUFBYTtRQUp6QixRQUFRLENBQUM7WUFDTixPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDO1lBQ2xDLFlBQVksRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUM7U0FDMUMsQ0FBQztPQUNXLGFBQWEsQ0EyQnpCO0lBQUQsb0JBQUM7Q0FBQSxBQTNCRCxJQTJCQztTQTNCWSxhQUFhO0FBNkIxQjs7R0FFRztBQUNILE1BQU0sVUFBVSxjQUFjLENBQzFCLFVBQXlCLEVBQ3pCLFdBQWtEO0lBRWxELE9BQU8sV0FBVyxZQUFZLFFBQVEsQ0FBQyxDQUFDLHNCQUFNLFVBQVUsRUFBSyxXQUFXLEVBQUUsRUFBRyxDQUFDLHNCQUFNLFVBQVUsRUFBSyxXQUFXLENBQUUsQ0FBQztBQUNySCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgY29uZmlnLFxuICBJTklUSUFMX0NPTkZJRyxcbiAgaW5pdGlhbENvbmZpZyxcbiAgTkVXX0NPTkZJRyxcbiAgb3B0aW9uc0NvbmZpZ1xuICB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IE1hc2tBcHBsaWVyU2VydmljZSB9IGZyb20gJy4vbWFzay1hcHBsaWVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFza0RpcmVjdGl2ZSB9IGZyb20gJy4vbWFzay5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTWFza1BpcGUgfSBmcm9tICcuL21hc2sucGlwZSc7XG5pbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ATmdNb2R1bGUoe1xuICAgIGV4cG9ydHM6IFtNYXNrRGlyZWN0aXZlLCBNYXNrUGlwZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbTWFza0RpcmVjdGl2ZSwgTWFza1BpcGVdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hNYXNrTW9kdWxlIHtcbiAgICBwdWJsaWMgc3RhdGljIGZvclJvb3QoY29uZmlnVmFsdWU/OiBvcHRpb25zQ29uZmlnIHwgKCgpID0+IG9wdGlvbnNDb25maWcpKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuZ01vZHVsZTogTmd4TWFza01vZHVsZSxcbiAgICAgICAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZTogTkVXX0NPTkZJRyxcbiAgICAgICAgICAgICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZ1ZhbHVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwcm92aWRlOiBJTklUSUFMX0NPTkZJRyxcbiAgICAgICAgICAgICAgICAgICAgdXNlVmFsdWU6IGluaXRpYWxDb25maWcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGU6IGNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgdXNlRmFjdG9yeTogX2NvbmZpZ0ZhY3RvcnksXG4gICAgICAgICAgICAgICAgICAgIGRlcHM6IFtJTklUSUFMX0NPTkZJRywgTkVXX0NPTkZJR10sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBNYXNrQXBwbGllclNlcnZpY2UsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIGZvckNoaWxkKF9jb25maWdWYWx1ZT86IG9wdGlvbnNDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5nTW9kdWxlOiBOZ3hNYXNrTW9kdWxlLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9jb25maWdGYWN0b3J5KFxuICAgIGluaXRDb25maWc6IG9wdGlvbnNDb25maWcsXG4gICAgY29uZmlnVmFsdWU6IG9wdGlvbnNDb25maWcgfCAoKCkgPT4gb3B0aW9uc0NvbmZpZylcbik6IG9wdGlvbnNDb25maWcge1xuICAgIHJldHVybiBjb25maWdWYWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uID8geyAuLi5pbml0Q29uZmlnLCAuLi5jb25maWdWYWx1ZSgpIH0gOiB7IC4uLmluaXRDb25maWcsIC4uLmNvbmZpZ1ZhbHVlIH07XG59XG4iXX0=