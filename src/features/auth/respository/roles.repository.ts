import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Roles } from "../entity/roles.entity";
import { Repository } from "typeorm";

@Injectable()
export class RolesRepository  {


    constructor(@InjectRepository(Roles)
private readonly repo : Repository<Roles>){}



    async findRoleByID(id : number) : Promise<Roles| null >{
        return await this.repo.findOne({
            where:{
                id
            }
        })
    }

    async findRoleByAbbr(abbr: string) {
        return await this.repo.findOne({
            where:{
                abbrevation : abbr.toLocaleUpperCase()
            }
        })
    }

}