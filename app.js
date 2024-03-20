const express = require('express'); 
const app = express();
const config = require('./config');
const sql = require('mssql');
app.use(express.json());

console.log(config);
async function connectToDatabase()
{
    try {
        await sql.connect(config);
        console.log('Connected to MSSQL database');
    } catch (error) {
        console.error('Error connecting to MSSQL database:', error);
    }
}
connectToDatabase();

app.listen(9000, function(req,res){ 
    console.log("running in server successfully"); 
});

app.get('/customer', function(req,res){
    async function gettingData() {
        try {
            const result = await sql.query`SELECT * FROM Employee`;
            console.log('Query result:', result.recordset);
            res.json("getting the data successfully");

        } catch (err) {
            console.error('Error in getting the data:', err);
        }
    }
    gettingData();
});

app.post('/customer/add',function(req,res){
    async function addingdata(obj)
    {
        try{
            console.log(obj);
            const data= `INSERT INTO Employee (employee_id,
                first_name, second_name, department,contact_num, working_location,
                email_id,date_of_joining) VALUES
                (@val1,@val2,@val3,@val4,@val5,@val6,@val7,@val8)`;
             const request = new sql.Request();
                
            request.input('val1', sql.Int, obj.employee_id);
            request.input('val2', sql.VarChar, obj.first_name);
            request.input('val3', sql.VarChar,obj.second_name);
            request.input('val4', sql.VarChar, obj.department);
            request.input('val5', sql.Int, obj.contact_num);
            request.input('val6', sql.VarChar, obj.working_location);
            request.input('val7', sql.VarChar, obj.email_id);
            request.input('val8', sql.Date, obj.date_of_joining);
            const resu= await request.query(data);
            res.json("posted data successfully");
            console.log("posted query\n",resu.recordset);
            }
            catch(error)
            {
                console.error("error in posting the query: ",error);
                res.json("record already exist");
            }
    }
    addingdata(req.body);
});

app.put('/customer/update', function(req,res){
    async function updatingData(obj) {
        try 
        {
            const result= `update  Employee set first_name= @name 
            where employee_id= @id`
           const request = new sql.Request();
            request.input('id', sql.Int, obj.employee_id);
            request.input('name', sql.VarChar, obj.first_name);
            const resu= await request.query(result);
            console.log(resu);
            res.json("updated succcessfull");
        } 
        catch (err) {
            console.error('Error upating the query:', err);
        }
    }
   updatingData(req.body);
});

app.delete('/customer/delete', function(req,res){
    async function deletingData(obj) {
        try {
            const result= `delete from Employee where employee_id= @val`
            const request = new sql.Request();
            request.input('val', sql.Int, obj.employee_id);
            const resu= await request.query(result);
            res.json("deleted succesfully");
            console.log(resu);
        } 
        catch (err) {
            console.error('Error in deleting query:', err);
        }
    }
   deletingData(req.body);
});


app.get('/customer/get', function(req,res){
    async function gettingData(obj) {
        try 
        {
            console.log(obj);
            const result =`SELECT * FROM Employee where employee_id= @id`;
            const request = new sql.Request();
            request.input('id', sql.Int, obj.employee_id);
            const resu=await request.query(result);
            if(resu.recordset.length>0)
            {
                console.log('Query result:', resu.recordset);
                res.json(resu.recordset);
            }
            else{
                res.status(400).json("error code 400: the id is not present in the db");
            }
        }
        catch (err) {
            console.error('Error in getting the data:', err);
        }
    }
    gettingData(req.body);
});