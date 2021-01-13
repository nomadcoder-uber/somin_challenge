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
exports.User = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const podcast_entity_1 = require("../../podcast/entities/podcast.entity");
var UserRole;
(function (UserRole) {
    UserRole[UserRole["Host"] = 0] = "Host";
    UserRole[UserRole["Listener"] = 1] = "Listener";
})(UserRole || (UserRole = {}));
graphql_1.registerEnumType(UserRole, { name: 'UserRole' });
let User = class User {
    async hashPassword() {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        }
        catch (e) {
            console.log(e);
            throw new common_1.InternalServerErrorException();
        }
    }
    async checkPassword(aPassword) {
        try {
            const ok = await bcrypt.compare(aPassword, this.password);
            return ok;
        }
        catch (e) {
            console.log(e);
            throw new common_1.InternalServerErrorException();
        }
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    graphql_1.Field(type => Number),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    graphql_1.Field(type => String),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    graphql_1.Field(type => String),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column(),
    graphql_1.Field(type => UserRole),
    class_validator_1.IsEnum(UserRole),
    __metadata("design:type", Number)
], User.prototype, "role", void 0);
__decorate([
    graphql_1.Field(type => [podcast_entity_1.Podcast]),
    typeorm_1.OneToMany(type => podcast_entity_1.Podcast, podcast => podcast.host),
    __metadata("design:type", Array)
], User.prototype, "podcast", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
User = __decorate([
    graphql_1.InputType({ isAbstract: true }),
    graphql_1.ObjectType(),
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map