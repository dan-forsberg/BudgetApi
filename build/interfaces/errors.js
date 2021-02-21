"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterError = exports.NoCategoryError = void 0;
var NoCategoryError = /** @class */ (function (_super) {
    __extends(NoCategoryError, _super);
    function NoCategoryError(msg) {
        var _this = _super.call(this, msg) || this;
        _this.name = "NoCategoryError";
        Object.setPrototypeOf(_this, NoCategoryError.prototype);
        return _this;
    }
    return NoCategoryError;
}(Error));
exports.NoCategoryError = NoCategoryError;
var ParameterError = /** @class */ (function (_super) {
    __extends(ParameterError, _super);
    function ParameterError(msg) {
        var _this = _super.call(this, msg) || this;
        _this.name = "ParameterError";
        Object.setPrototypeOf(_this, ParameterError.prototype);
        return _this;
    }
    return ParameterError;
}(Error));
exports.ParameterError = ParameterError;
