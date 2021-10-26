const express = require("express")
const sql = require("mssql")
const bodyParser = require('body-parser');
const { query } = require("express");
const PORT = 3000;

const app = express();

const sqlconfig = {
    user:"sa",
    password:process.env.PASSWORD,
    server:"localhost",
    database:"emp",
    port: process.env.PORT,
    options: {
        encrypt: true,
        trustServerCertificate: true
      },
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/employee", function(req , res){
	getEmployees(res,'select * from emp');
});
async function getEmployees(res,query) {
    try {
        let pool = await sql.connect(sqlconfig)
        let result = await pool.request()
            .query(query)
             let resData = result.recordsets[0];
            // let amanData = resData.map((items,index)=>{
            //     return 'hello aman'+' '+ items.id +index

            // })
        res.send(resData);
        sql.close();
    } catch (err) {
        console.log(err);
    }
}

app.get("/api/employee/:id", function(req , res){
    let value = req.params.id;
	getEmployeeInfo(res,`select * from emp where id = ${value}`);
});
async function getEmployeeInfo(res,query) {
    try {
        let pool = await sql.connect(sqlconfig)
        let result = await pool.request()
            .query(query)
             let resData = result.recordsets[0];
            // let amanData = resData.map((items,index)=>{
            //     return 'hello aman'+' '+ items.id +index

            // })
        res.send(resData);
        sql.close();
    } catch (err) {
        console.log(err);
    }
}

app.get('/api/emp_join_events/:emp/:events',(req, res)=>{
    let empSql = req.params.emp;
    let Sqlevents = req.params.events;
    getJoins(res,`select * from emp left join events on emp.${empSql}=events.${Sqlevents}`);
})
async function getJoins(res,sqlquery) {
    try{
        const pool = await sql.connect(sqlconfig)
        const result = await pool.request().query(sqlquery)
        res.send(result.recordsets[0]);
        sql.close();
    } catch(err){
        console.log(`no joins`)
    }
}
app.post('/api/addemp',(req,res)=>{
    addEmp(req,res);
})

async function addEmp(req,res){
    try{
        if(req.body.id != null && req.body.ename != null && req.body.esal != null && req.body.eaddress!= null && req.body.email!= null && req.body.mobile_no != null){
            const pool = await sql.connect(sqlconfig)
            const result = await pool.request()
            .input('id',sql.Int , req.body.id)
            .input('ename',sql.VarChar, req.body.ename)
            .input('esal', sql.VarChar, req.body.esal)
            .input('eaddress', sql.VarChar, req.body.eaddress)
            .input('email', sql.VarChar, req.body.email)
            .input('mobile_no', sql.VarChar, req.body.mobile_no)
            .query('insert into emp(id, ename, esal, eaddress, email, mobile_no) values  (@id, @ename, @esal, @email, @mobile_no)')
            res.send(result)
        } else {
            res.send('fill all info')
        }
    } catch(err){
        res.send(err.message)
    }
}

app.put('/api/updateEmp/',(req,res)=>{
    updateEmp(req,res);
})

async function updateEmp(req,res){
    try{
        if(req.body.id != null && req.body.ename != null && req.body.esal != null && req.body.eaddress!= null && req.body.email!= null && req.body.mobile_no != null){
            const pool = await new sql.connect(sqlconfig)
            const result = await pool.request()
            .input('id',sql.Int , req.body.id)
            .input('ename',sql.VarChar, req.body.ename)
            .input('esal', sql.VarChar, req.body.esal)
            .input('eaddress', sql.VarChar, req.body.eaddress)
            .input('email', sql.VarChar, req.body.email)
            .input('mobile_no', sql.VarChar, req.body.mobile_no)
            .query(`update [dbo].[emp] set id =@id, ename=@ename, esal=@esal, eaddress=@eaddress, email=@email, mobile_no=@mobile_no where id=@id`)
            res.send(result)
            res.redirect('/api/employee')
        } else {
            res.send('Fill Recodes')
        }
    } catch(err){
        res.send(err.message)
    }
}


app.delete('/api/deleteEmp/:id',(req,res)=>{
    deleteEmp(req,res);
})

async function deleteEmp(req,res){
    try{
        if(req.body.id != null && req.body.ename != null && req.body.esal != null && req.body.eaddress!= null && req.body.email!= null && req.body.mobile_no != null){
            const pool = await new sql.connect(sqlconfig)
            const result = await pool.request()
            .input('id',sql.Int , req.params.id)
            .query(`delete from emp where id =${req.params.id}`)
            res.send(result)
        } else {
            res.send('Fill Recodes')
        }
    } catch(err){
        res.send(err.message)
    }
}


app.listen(PORT,()=>{
    console.log(`server started on ${PORT}`);
});
