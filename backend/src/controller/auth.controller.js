export const signup= async (req,res)=>{
    const{fullname,email,password}=req.body
    try {
        if(!fullname || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length<6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const user=await User.findOne({email})

        if (user) return res.status(400).json({message: "Email already exists"});

        const salt=await bcrypt.genSalt(10)
        const hashedpassword=await bcrypt.hash(password,salt);

        const newuser=new User({
            fullname:fullname,
            email:email,
            password:hashedpassword
        })

        if(newuser){
            await newuser.save();
            generatetoken(newuser._id,res)

            res.status(201).json({
                _id:newuser._id,
                fullname:newuser.fullname,
                email:newuser.email,
                profilePic:newuser.profilePic,
            });
        }else{
            res.staus(400).json({message: "Invalid user data"});
            res.status(500).json({message:"Internal Server Error"});
        }

    } catch (error) {
        console.log("Error in signup controller ",error.message);
    }
};
export const login=()=>{

}
export const logout=()=>{

}