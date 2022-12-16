const User = require("../Models/User");
const Settings = require("../Models/Settings");

const addUser = async (req, res) => {
    try{
        let { name, role, password, flag } = req.body;
        let SettingsObj = await Settings.findOne();

        let userData = await new User({
          name: name,
          role: "Admin",
          password: String(password),
          flag: true,
        });
        console.log("🚀 ~ file: User.js:13 ~ addUser ~ userData", userData._id)
        let SettingData = await new Settings({
            adminId : userData._id,
            priceDetails: SettingsObj.priceDetails,
        })
        console.log("🚀 ~ file: User.js:16 ~ addUser ~ SettingData", SettingData)
        userData.save();
        SettingData.save();
        res.json({ data: "added" });
    }catch{
        res.json({ error: "error" });
    }
};

const getUsers = async (req,res) => {
    try{
        const Users = await User.find();
        console.log("🚀 ~ file: User.js:23 ~ getUsers ~ Users", Users)
        res.json({ data: Users });
    }catch{
        res.json({ error: "error" });
    }
}

const deleteUser = async (req,res) => {
    console.log("🚀 ~ file: User.js:31 ~ deleteUser ~ deleteUser")
    try{
        const { id } = req.query
        console.log("🚀 ~ file: User.js:34 ~ deleteUser ~ id", id)
        await User.findByIdAndRemove({ _id : id })
        res.json({ data: "User Deleted Successfully" });
    }catch{
        res.json({ error: "error" });
    }
}

const updateUserStatus = async (req,res) => {
    try{
        const { id,status } = req.body
        console.log("🚀 ~ file: User.js:34 ~ deleteUser ~ id", id,status)
        await User.updateOne(
            { _id: id },
            {
                $set: {
                    flag: status
                },
            }
        );

        res.json({ data: "User Updated Successfully" });
    }catch{
        res.json({ error: "error" });
    }
}

const checkLogin = async (req,res) => {
    const { name,password } = req.body
    const data = await User.findOne({ name : name, password : password })
    if(data){
        console.log("🚀 ~ file: User.js:65 ~ checkLogin ~ data", data.flag === false)
        if(data.flag === false){
            return res.json({ error: "You are Not Able to Login" });
        }
        res.json({ success: "Login Successfully",data : data});
    }else{
        res.json({ error: "Login Failed" });
    }

}

module.exports = {
  addUser,
  getUsers,
  deleteUser,
  checkLogin,
  updateUserStatus
};
