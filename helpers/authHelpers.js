import bcrypt from 'bcrypt';

// generate hash
export const hashPassword = async(password) => {
    try{
        const saltRounds = 10 ;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }
    catch(error){
        console.log(error);
    }
}

// decrypt hash
export const comparePassword = async(password , hashedPassword) =>{
    return bcrypt.compare(password,hashedPassword)
}