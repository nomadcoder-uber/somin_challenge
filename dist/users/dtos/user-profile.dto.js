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
exports.SeeProfileOutput = exports.SeeProfileInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const output_dto_1 = require("../../podcast/dtos/output.dto");
const user_entity_1 = require("../entities/user.entity");
let SeeProfileInput = class SeeProfileInput {
};
__decorate([
    graphql_1.Field(type => Number),
    __metadata("design:type", Number)
], SeeProfileInput.prototype, "userId", void 0);
SeeProfileInput = __decorate([
    graphql_1.ArgsType()
], SeeProfileInput);
exports.SeeProfileInput = SeeProfileInput;
let SeeProfileOutput = class SeeProfileOutput extends output_dto_1.CoreOutput {
};
__decorate([
    graphql_1.Field(type => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], SeeProfileOutput.prototype, "user", void 0);
SeeProfileOutput = __decorate([
    graphql_1.ObjectType()
], SeeProfileOutput);
exports.SeeProfileOutput = SeeProfileOutput;
//# sourceMappingURL=user-profile.dto.js.map