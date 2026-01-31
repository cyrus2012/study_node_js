import repository from "./repository.js";



function serviceA(req, res){
    
    return res.send(`Hi, ${req.user.name}. This is service A`);
}


function serviceB(req, res){
    return res.send(`Hi, ${req.user.name}. This is service B`);
}

function serviceC(req, res){
    return res.send(`Hi, ${req.user.name}. This is service C`);
}

function serviceD(req, res){
    return res.send(`Hi, ${req.user.name}. This is service D`);
}


async function checkPermission(actionName){
    const service = await repository.getServiceIdByName(actionName);

    return async function(req, res, next){
        const user = await repository.getUserInfoById(req.user.id);
        if(!user)
            return res.send("cannot find user data");

        //get the permitted service of a particular role
        const permitServices = await repository.getPermitServiceByRole(user.role_id);
        if(!permitServices)
            return res.send(`no services available to user ${user.name}`);

        const serviceIds = permitServices.split(",");
        
        let isPermit = false;
        for(const id of serviceIds){
            if(id == service.id){
                isPermit = true;
                break;
            }
        }

        if(!isPermit)
            return res.send(`user ${user.name} is not authorized to have service ${actionName}`);

        next();
    }
}



async function isServicePermit(actionName, userId){
    const service = await repository.getServiceIdByName(actionName);

    const user = await repository.getUserInfoById(userId);
    if(!user)
        return false;

    //get the permitted service of a particular role
    const permitServices = await repository.getPermitServiceByRole(user.role_id);
    if(!permitServices)
        return false;

    const serviceIds = permitServices.split(",");
    
    //console.log(serviceIds);

    let isPermit = false;
    for(const id of serviceIds){
        if(id == service.id){
            isPermit = true;
            break;
        }
    }

    return isPermit;
}

async function permissionCheck(actionName, serviceFunction){

    //get service id from actionName
    const service = await repository.getServiceIdByName(actionName);

    return async function(req, res){

        const user = await repository.getUserInfoById(req.user.id);
        if(!user)
            return res.send("cannot find user data");

        //get the permitted service of a particular role
        const permitServices = await repository.getPermitServiceByRole(user.role_id);
        //console.log(user);
        //console.log(permitServices);
        if(!permitServices)
            return res.send(`no services available to user ${user.name}`);

        const serviceIds = permitServices.split(",");
        
        let isPermit = false;
        for(const id of serviceIds){
            if(id == service.id){
                isPermit = true;
                break;
            }
        }

        //console.log(`${actionName} has service id ${service.id}`);
        //console.log(`Role id ${user.roleId} has permit service ${permitServices}`);

        if(!isPermit)
            return res.send(`user ${user.name} is not authorized to have service ${actionName}`);

        return serviceFunction(req,res);
    }
}



const authorizedServices = {};

authorizedServices["serviceA"] = await permissionCheck("serviceA" , serviceA);
authorizedServices["serviceB"] = await permissionCheck("serviceB" , serviceB);
authorizedServices["serviceC"] = await permissionCheck("serviceC" , serviceC);
authorizedServices["serviceD"] = await permissionCheck("serviceD" , serviceD);

export default authorizedServices;
export { checkPermission, isServicePermit, serviceA, serviceB, serviceC, serviceD }