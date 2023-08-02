const mysql = require('mysql2/promise');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;

const db = mysql.createPool(
    {
        host: 'localhost',
        user: 'root',
        password: '123password',
        database: 'employee_db'
    },
    console.log('Connected to the employee_db database')
    );
module.exports = db;

function returnToMenu() {
    inquirer
      .prompt([
        {
          type: "confirm",
          message: "Return to the main menu?",
          name: "returnToMenu",
        },
      ])
      .then((answer) => {
        if (answer.returnToMenu) {
          chooseOption();
        } else {
          process.exit(0);
        }
      });
  }

const viewDepartment = async ()  => {
    try {
        const [getDepartments] = await db.query('SELECT * FROM department');
        console.table(getDepartments);
        returnToMenu();
        return getDepartments;
    } catch (err) {
        console.log('Unable to perform that function', err);
    }
}

const viewRole = async ()  => {
    try {
        const [getRoles] = await db.query('SELECT * FROM role');
        console.table(getRoles);
        returnToMenu();
        return getRoles;
    } catch (err) {
        console.log('Unable to perform that function', err);
    }
}

const viewEmployee = async ()  => {
    try {
        const [getEmployees] = await db.query('SELECT * FROM employee');
        console.table(getEmployees);
        returnToMenu();
        return getEmployees;
    } catch (err) {
        console.log('Unable to perform that function', err);
    }
}

const addDepartment = async() => {
    inquirer
    .prompt([
        {type: 'input',
         message:'Choose a department to add',
         name: 'department'
        },  
    ])  
    .then(async (answer) => {
        try {
            const [department] = await db.query(`INSERT INTO department (name) VALUES ('${answer.department}')`);
            viewDepartment();
            returnToMenu();
        } catch (error) {
            console.log('Unable to perform that function', error);
            return false;
        }
    }) 
}
const addRole = async() => {
    try {
        const [departments] = await db.query(`SELECT * FROM department`)
        inquirer
    .prompt([
        {type: 'input',
         message:'Input a role to add',
         name: 'role'
        },  
        {type: 'input',
        message:'What is the salary?',
        name: 'salary'
        },
        {type: 'list',
         message:'Select a department',
         name: 'department',
         choices: departments.map((department) => department.name)
        }
    ])  
    .then(async (answer) => {
        try {
            const selectedDepartments = departments.find((department) => department.name === answer.department)
            await db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.role}','${answer.salary}','${selectedDepartments.id}')`)
            console.log('role was added successfully')
            returnToMenu();
        } catch (error) {
            console.log('Unable to perform that function', error);
        }
    }) 
    } catch (error) {
        console.log('Unable to perform that function', error);
    }   
}

const addEmployee = async () => {
    try {
      const [roles] = await db.query("SELECT * FROM role"); 
      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "Add employee first name.",
          },
          {
            name: "lastName",
            type: "input",
            message: "Add employee last name.",
          },
          {
            name: "roleId",
            message: "What is the employee's role?",
            type: "list",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then(async (answers) => {
            try {
              const selectedRole = roles.find((role) => role.id === answers.roleId);
              if (!selectedRole) {
                console.log("Invalid role selected. Please try again.");
              }
              await db.query(
                `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`,
                [answers.firstName, answers.lastName, selectedRole.id]
              );
              console.log("Employee added successfully.");
              returnToMenu();
            } catch (error) {
              console.log("An error occurred when trying to add an employee: ", error);
            }
          });
    } catch (error) {
      console.log("An error occurred while fetching roles: ", error);
    }
};



const updateEmployee = async () => {
    inquirer
    .prompt([   
        {type: 'input',
         message:'Input a first and last name',
         name: 'name'
        },  
    ])   
}


function chooseOption() {
    inquirer
    .prompt([
    {type: 'list',
    message:'Choose a function',
    name: 'choice',
    choices: ['View departments', 'View roles', 'View employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee']
    }
    ])
    .then((answer) => {
        switch(answer.choice) {
            case 'View departments':
                viewDepartment()
                break;
            case 'View roles':
                viewRole()
                break;  
            case 'View employees':
                viewEmployee()
                break; 
            case 'Add a department':
                addDepartment()
                break;   
            case 'Add a role':
                addRole()
                break;
            case 'Add an employee':
                addEmployee()
                break;
            case 'Update an employee':
                updateEmployee()
                break;  
            default:
                process.exit(0)         
        }
     } )
    
}


chooseOption()