import jwtConfig from "@config/jwt.config";
import {Global, Module} from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JsonWebTokenService } from "./jwt.service";


@Global()
@Module({
    imports:[ConfigModule.forFeature(jwtConfig), 
        JwtModule.registerAsync({
            imports:[ConfigModule], 
            inject:[ConfigService], 
            useFactory: (config : ConfigService)=>({
                global: true, 
                signOptions:{
                    expiresIn: config.get("jwt.expiresIn"), 
                    issuer : config.get("jwt.issuer"), 
                    audience : config.get("jwt.audience"), 
                    algorithm : config.get("jwt.algorithm")
                },
                verifyOptions :{
                    ignoreExpiration :false, 
                    audience : config.get<string>("jwt.audience"), 
                } , 
                secret : config.get<string>("jwt.secret"), 
                
            })
        }), 
    ], 
    providers:[JsonWebTokenService], 
    exports : [JsonWebTokenService]

})
export class JsonWebTokenModule{}