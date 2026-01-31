import { Pool } from 'pg'
 
 
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '123456',
  port: 5432,
  database: 'nodetest'
});


async function query(text, params){
  return await pool.query(text, params);
}


const usersTable = [
    {id:1, name: "Tom", password:"123456", roleId:1},
    {id:2, name: "Sam", password:"abc123", roleId:2},
    {id:3, name: "Cherry", password:"qwert", roleId: 3}
];


async function getUserInfoByName(username){

    try{
        const result = await pool.query("SELECT * FROM users WHERE name=$1", [username]);

        if(result.rows.length == 0)
            return null;

        return result.rows[0];
    }catch(err){
        console.error(err);
        return null;
    }
}

async function getUserInfoById(userId){

    try{
        const result = await pool.query("SELECT * FROM users WHERE id=$1", [userId]);

        if(result.rows.length == 0)
            return null;

        return result.rows[0];
    }catch(err){
        console.error(err);
        return null;
    }
}


const servicesTable = [
    {id:101, name: "serviceA"},
    {id:102, name: "serviceB"},
    {id:103, name: "serviceC"},
    {id:104, name: "serviceD"},
];

async function getServiceIdByName(name){

    try{
        const result = await pool.query("SELECT * FROM services WHERE name=$1", [name]);

        if(result.rows.length == 0)
            return null;

        return result.rows[0];
    }catch(err){
        console.error(err);
        return null;
    }

}

const rolePermissionTable = [
    {roleId: 1, permitService: "101,102"},
    {roleId: 2, permitService: "101,103"},
    {roleId: 3, permitService: "101,102,104"},
]

async function getPermitServiceByRole(roleId){
    
    try{
        const result = await pool.query("SELECT * FROM role_permission WHERE role_id=$1", [roleId]);

        if(result.rows.length == 0)
            return null;

        return result.rows[0].permitService;
        
    }catch(err){
        console.error(err);
        return null;
    }
    
}




export default { getUserInfoByName, getUserInfoById, getServiceIdByName, getPermitServiceByRole };