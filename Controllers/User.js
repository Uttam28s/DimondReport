const User = require("../Models/User");
const Settings = require("../Models/Settings");
const Report = require("../Models/Report");
const Salary = require("../Models/Salary");

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
        let SettingData = await new Settings({
            adminId : userData._id,
            priceDetails: SettingsObj?.priceDetails,
        })
        userData.save();
        SettingData.save();
        res.json({ data: "added" });
    }catch(e){
        res.json({ error: "error" });
    }
};

const getUsers = async (req,res) => {
    try{
        const Users = await User.find();
        res.json({ data: Users });
    }catch{
        res.json({ error: "error" });
    }
}

const deleteUser = async (req,res) => {
    try{
        const { id } = req.query
        await User.findByIdAndRemove({ _id : id })
        await Report.deleteMany({ adminId : id})
        await Settings.deleteOne({ adminId : id })
        await Salary.deleteMany({ adminId : id })

        res.json({ data: "User Deleted Successfully" });
    }catch(e){
        res.json({ error: "error" });
    }
}

const updateUserStatus = async (req,res) => {
    try{
        const { id,status } = req.body
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
        console.log("🚀 ~ file: User.js:73 ~ checkLogin ~ data", data)
        if(data?.flag === false){
            res.status(400).json({ message: "You Are not able to login" });
        }
        res.status(200).json({ message: "Login Successfully",data : data });
    }else{
        res.status(400).json({ message: "Login Failed" });
    }

}


const addType = async (req,res) => {
    try{
        const { adminId, type } = req.body
        if(type){
            const data = await User.findOne({ _id : adminId })
            console.log("🚀 ~ file: User.js:90 ~ addType ~ data", data)
            if((data.diamondType).includes(type)){
                res.status(400).json({ message: "Already Exist" });
            }
            data.diamondType.push(type.toLowerCase())
            data.save()
        }
        const setting = await Settings.findOne({adminId : adminId})
        let typePrice = type.toLowerCase() +"Price" 
        const method = ['taliya','mathala','russian','pel','table']
        method.map((ele) => {
            setting.priceDetails[ele].push({ [typePrice] : 0})
        })  
        setting.save()
        res.json({ success: "Successfully"});
    }catch(e){
        res.json({ error: e });
    }
}


const getdiamondTypeList = async (req,res) => {
    try{
        const { adminId } = req.query
        const user = await User.findOne({ _id : adminId })
        res.json({ data: user?.diamondType});

    }catch(e){
        res.json({ error: e });
    }
}
module.exports = {
  addUser,
  getUsers,
  deleteUser,
  checkLogin,
  updateUserStatus,
  addType,
  getdiamondTypeList
};
