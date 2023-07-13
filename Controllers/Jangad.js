
const Jangad = require("../Models/Jangad");

const addJangadData = async (req, res) => {
  try{
    const {data} = req.body
    let jangad = new Jangad(data)
    jangad.save()
    res.status(200).json({ message: "Added SuccessFully" });
  }catch(e){
    res.status(400).json({ message: e?.message });

  }
}

const getJangadData = async (req, res) => {
  try{
    let data = await Jangad.find()
    res.status(200).json({ data: data, message: "Fetched SuccessFully" });
  }catch(e){
    res.status(400).json({ message: e?.message });

  }
}

const deleteJangadData = async (req, res) => {
  try{
    const { id } = req.query
    await Jangad.deleteOne({ _id : id })
    res.status(200).json({ message: "Deleted SuccessFully" });
  }catch(e){
    res.status(400).json({ message: e?.message });
  }
}

const updateJangadData = async (req,res) => {
  try{
    const { id } = req.query
    const { data } = req.body
    let updatedData = await Jangad.updateOne({ _id : id },  data )
    res.status(200).json({ message: "Updated SuccessFully" });

  }catch(e){
    res.status(400).json({ message: e?.message });
  }
}
module.exports = {
    addJangadData,
    getJangadData,
    deleteJangadData,
    updateJangadData
};
  