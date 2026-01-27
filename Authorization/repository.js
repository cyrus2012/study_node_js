const usersTable = [
    {id:1, name: "Tom", password:"123456", roleId:1},
    {id:2, name: "Sam", password:"abc123", roleId:2},
    {id:3, name: "Cherry", password:"qwert", roleId: 3}
];


function getUserInfoByName(username){
    for(const user of usersTable){
        if(user.name == username)
            return user;
    }

    return null;
}

function getUserInfoById(userId){
    for(const user of usersTable){
        if(user.id == userId)
            return user;
    }
    return null;
}


const servicesTable = [
    {id:101, name: "serviceA"},
    {id:102, name: "serviceB"},
    {id:103, name: "serviceC"},
    {id:104, name: "serviceD"},
];

function getServiceIdByName(name){
    for(const element of servicesTable){
        if(element.name == name)
            return element;
    }

    return null;
}

const rolePermissionTable = [
    {roleId: 1, permitService: "101,102"},
    {roleId: 2, permitService: "101,103"},
    {roleId: 3, permitService: "101,102,104"},
]

function getPermitServiceByRole(roleId){
    for(const element of rolePermissionTable){
        if(element.roleId == roleId)
            return element.permitService;
    }

    return null;
}




export default { getUserInfoByName, getUserInfoById, getServiceIdByName, getPermitServiceByRole };