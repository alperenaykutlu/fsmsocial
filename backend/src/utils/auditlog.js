import logger from "./logger.js";

export const auditLog=({user,action,resource,resourceID,ip,meta={}})=>{
logger.info("AUDIT",{
    userId:user?._id??"ananymous",
    username:user?.username??"ananymous",
    action,
    resource,
    resourceID,
    ip,meta,
    timestamp:new Date().toISOString()
})
}