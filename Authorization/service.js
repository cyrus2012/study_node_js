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


function checkPermission(actionName){
    const service = repository.getServiceIdByName(actionName);

    return function(req, res, next){
        const user = repository.getUserInfoById(req.user.id);
        if(!user)
            return res.send("cannot find user data");

        //get the permitted service of a particular role
        const permitServices = repository.getPermitServiceByRole(user.roleId);
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



function isServicePermit(actionName, userId){
    const service = repository.getServiceIdByName(actionName);

    const user = repository.getUserInfoById(userId);
    if(!user)
        return false;

    //get the permitted service of a particular role
    const permitServices = repository.getPermitServiceByRole(user.roleId);
    if(!permitServices)
        return false;

    const serviceIds = permitServices.split(",");
    
    let isPermit = false;
    for(const id of serviceIds){
        if(id == service.id){
            isPermit = true;
            break;
        }
    }

    return isPermit;
}

function permissionCheck(actionName, serviceFunction){

    //get service id from actionName
    const service = repository.getServiceIdByName(actionName);

    return function(req, res){
        const user = repository.getUserInfoById(req.user.id);
        if(!user)
            return res.send("cannot find user data");

        //get the permitted service of a particular role
        const permitServices = repository.getPermitServiceByRole(user.roleId);
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

authorizedServices["serviceA"] = permissionCheck("serviceA" , serviceA);
authorizedServices["serviceB"] = permissionCheck("serviceB" , serviceB);
authorizedServices["serviceC"] = permissionCheck("serviceC" , serviceC);
authorizedServices["serviceD"] = permissionCheck("serviceD" , serviceD);

export default authorizedServices;
export { checkPermission, isServicePermit, serviceA, serviceB, serviceC, serviceD }