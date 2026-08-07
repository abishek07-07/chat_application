import { registerAs } from "@nestjs/config";


export default registerAs('cookie', ()=>({

    httpOnly : process.env.NODE_ENV =="production"? true : false, 
    secure :   process.env.NODE_ENV =="production"? true : false, 
    maxAge  :  Number(process.env.COOKIE_MAX_AGE ) 
}))