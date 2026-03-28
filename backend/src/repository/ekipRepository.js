import Ekip from '../models/ekip/ekip.js'


class EkipRepository{
    async createEkip(ekipData){
        const newEkip=new Ekip(ekipData)
        return await newEkip.save()
    }
    async findEkipByName(ekipName){
        return await Ekip.findOne({ekipName})
    }
    async deleteEkip(ekipName){
        return await Ekip.deleteOne({ekipName})
    }
    async updateEkipName(ekipName){
        return await Ekip.updateOne({ekipName})
    }
}