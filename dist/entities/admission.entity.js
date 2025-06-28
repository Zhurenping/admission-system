"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admission = void 0;
const typeorm_1 = require("typeorm");
let Admission = class Admission {
};
exports.Admission = Admission;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ length: 30 }),
    __metadata("design:type", String)
], Admission.prototype, "ksh", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "zkzh", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "sfzh", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "xm", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "xb", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "lqzt", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "ssmc", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "pcmc", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "klmc", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "jhxz", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "tdcj", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "yxmc", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "lqzymc", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "xymc", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "xqmc", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "tzsbh", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 4, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "sfyzm", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "jtdz", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "yzbm", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "sjr", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "bdsj", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "bz", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Admission.prototype, "cxcs", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Admission.prototype, "last_update_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 36, nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "import_batch_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Admission.prototype, "import_time", void 0);
exports.Admission = Admission = __decorate([
    (0, typeorm_1.Entity)()
], Admission);
