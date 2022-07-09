const Settings = require('../Models/Settings')

const findSettings = async(subObj)=>{
  
    let settings = await Settings.findOne();
    return (settings[subObj]||settings)
}

exports.exports={
  findSettings
}