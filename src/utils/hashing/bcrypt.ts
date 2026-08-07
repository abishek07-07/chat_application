import bcrypt from "bcryptjs"

export  class Hashing{

    private static readonly  salt = 12 ; 


    static hashData(data: string  ) {
        return bcrypt.hashSync(data, this.salt); 
    }

    static compareData( data : string, hashedData :string): boolean {
        return bcrypt.compareSync(data, hashedData); 
    }
}