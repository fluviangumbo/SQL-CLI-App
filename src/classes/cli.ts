//imports
import pg, { QueryResult } from 'pg';
import dotenv from 'dotenv';
import inquirer from 'inquirer';

dotenv.config();

// class definitiion
class Cli {
    pool: pg.Pool;
    exit: boolean;

    constructor(pool: pg.Pool, exit: boolean) {
        this.pool = pool;
        this.exit = exit;
    }

    /**
     * view data in tables
     */
    viewDepartments() {
        const sql = `SELECT name AS Departments FROM departments`;

        this.pool.query(sql, (err: Error, result: pg.QueryResult) => {
            if (err) {
                console.error(err);
            } else {
                console.clear();
                console.table(result.rows);

                setTimeout(() => {
                    console.log('\n\n');
                    this.startCli();
                }, 500);
            }
        });
    }

    viewRoles() {
        const sql = `SELECT title, salary, department_id FROM roles`;

        this.pool.query(sql, (err: Error, result: pg.QueryResult) => {
            if (err) {
                console.error(err);
            } else {
                console.clear();
                console.table(result.rows);

                setTimeout(() => {
                    console.log('\n\n');
                    this.startCli();
                }, 500);
            }
        });
    }

    viewEmployees() {
        const sql = `SELECT e.id, e.first_name || ' ' || e.last_name AS Name, roles.title, roles.salary, m.first_name || ' ' || m.last_name AS Manager FROM employees e JOIN roles ON e.role_id = roles.id LEFT JOIN employees m ON m.id = e.manager_id`;

        this.pool.query(sql, (err: Error, result: pg.QueryResult) => {
            if (err) {
                console.error(err);
            } else {
                console.clear();
                console.table(result.rows);

                setTimeout(() => {
                    console.log('\n\n');
                    this.startCli();
                }, 500);
            }
        });
    }

    /**
     * update db info
     */
    addDepartment(): void {
        inquirer
        .prompt([
            {
                type: 'input',
                message: 'What department would you like to add?',
                name: 'dept',
            }
        ])
        .then((ans) => {
            const sql = `INSERT INTO departments (name) VALUES ($1)`;
            const values = [ans.dept];

            this.pool.query(sql, values, (err: Error, _res: pg.QueryResult) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Successfully added department.');

                    setTimeout(() => {
                        console.log('\n\n');
                        this.startCli();
                    }, 500);
                }
            })
        })
    }

    addRole(): void {
        let depts: Object[] | undefined;

        this.pool.query(`SELECT id AS value, name AS name FROM departments`, (err: Error, res: QueryResult) => {
            if (err) {
                console.error(err);
            } else {
                depts = res.rows;

                inquirer
                .prompt([
                    {
                        type: 'input',
                        message: 'What is the title of the role?',
                        name: 'title',
                    },
                    {
                        type: 'input',
                        message: 'What is the salary for this role?',
                        name: 'salary',
                    },
                    {
                        type: 'list',
                        message: 'Which department oversees this role?',
                        name: 'dept',
                        choices: depts,
                    }
                ])
                .then((ans) => {
                    const values = [ans.title, Number(ans.salary), ans.dept];

                    const sql = `INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)`;
        
                    this.pool.query(sql, values, (err: Error, _res: pg.QueryResult) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log('Successfully added role.');
        
                            setTimeout(() => {
                                console.log('\n\n');
                                this.startCli();
                            }, 500);
                        }
                    })
                })
            }
        })
    }

    addEmployee(): void {
        let empRole: Object[] | undefined;
        let empMngr: Object[] | undefined;

        this.pool.query(`SELECT id AS value, title AS name FROM roles`,  (err: Error, res: QueryResult) => {
            if (err) {
                console.error(err);
            } else {
                empRole = res.rows;

                this.pool.query(`SELECT id AS value, first_name || ' ' || last_name AS name FROM employees`, (err: Error, res: QueryResult) => {
                    if (err) {
                        console.error(err);
                    } else {
                        empMngr = res.rows;
                        empMngr.push({ value: null, name: 'No Manager'});

                        inquirer
                        .prompt([
                            {
                                type: 'input',
                                message: 'What is the first name of the employee?',
                                name: 'firstName',
                            },
                            {
                                type: 'input',
                                message: 'What is the last name of the employee?',
                                name: 'lastName',
                            },
                            {
                                type: 'list',
                                message: 'What is the title of the employee?',
                                name: 'role_id',
                                choices: empRole,
                            },
                            {
                                type: 'list',
                                message: 'Who will be their manager, if any?',
                                name: 'manager_id',
                                choices: empMngr,
                            }
                        ])
                        .then((ans) => {
                            if (err) {
                                console.error(err);
                            } else{
                                const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`; // need '' around ${} in template literal for SQL syntax
                                const values = [ans.firstName, ans.lastName, ans.role_id, ans.manager_id];

                                this.pool.query(sql, values, (err: Error, _res: QueryResult) => {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        console.log('Successfully added employee.');
                                    }

                                    setTimeout(() => {
                                        console.log('\n\n');
                                        this.startCli();
                                    }, 500);
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    updateEmployeeRole(): void {
        let emps: Object[] | undefined;
        let roles: Object[] | undefined;

        this.pool.query(`SELECT id AS value, first_name || ' ' || last_name AS name FROM employees`, (err: Error, res: QueryResult) => {
            if (err) {
                console.error(err);
                return;
            }
            
            emps = res.rows;

            this.pool.query(`SELECT id AS value, title AS name FROM roles`, (err: Error, res: QueryResult) => {
                if (err) {
                    console.error(err);
                }

                roles = res.rows;

                
                inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'Select the employee to update.',
                        name: 'emp',
                        choices: emps,
                    },
                    {
                        type: 'list',
                        message: 'What is the employees new role?',
                        name: 'role',
                        choices: roles,
                    }
                ])
                .then((ans) => {
                    if (err) {
                        console.error(err);
                    }

                    const sql = `UPDATE employees SET role_id = $1 WHERE id = $2`;
                    const values = [ans.role, ans.emp];

                    this.pool.query(sql, values, (err: Error, _res: QueryResult) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log('Successfully updated employee role.')
                        }

                        setTimeout(() => {
                            console.log('\n\n');
                            this.startCli();
                        }, 500);
                    })
                })
            })
        })
    }

    updateEmployeeManager(): void {
        let emps: Object[] | undefined;
        let managers: Object[] | undefined;

        this.pool.query(`SELECT id AS value, first_name || ' ' || last_name AS name FROM employees`, (err: Error, res: QueryResult) => {
            if (err) {
                console.error(err);
                return;
            }
            
            emps = res.rows;
            managers = [...res.rows];
            managers.push({ value: null, name: 'No Manager'});

            inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Select the employee to update.',
                    name: 'emp',
                    choices: emps,
                },
                {
                    type: 'list',
                    message: 'Who is the new manager for this employee?',
                    name: 'manager',
                    choices: managers,
                }
            ])
            .then((ans) => {
                if (err) {
                    console.error(err);
                }

                const sql = `UPDATE employees SET manager_id = $1 WHERE id = $2`;
                const values = [ans.manager, ans.emp];

                this.pool.query(sql, values, (err: Error, _res: QueryResult) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('Successfully updated employee manager.')
                    }

                    setTimeout(() => {
                        console.log('\n\n');
                        this.startCli();
                    }, 500);
                })
            })
        })
    }

    startCli(): void {
        // console.clear();
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'Menu',
                    message: 'Please select the desired action.',
                    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Update an employee manager', 'Quit'],
                }
            ])
            .then((answers) => {
                switch (answers.Menu) {
                    case 'View all departments':
                        this.viewDepartments();
                        break;
                    case 'View all roles':
                        this.viewRoles();
                        break;
                    case 'View all employees':
                        this.viewEmployees();
                        break;
                    case 'Add a department':
                        this.addDepartment();
                        break;
                    case 'Add a role':
                        this.addRole();
                        break;
                    case 'Add an employee':
                        this.addEmployee();
                        break;
                    case 'Update an employee role':
                        this.updateEmployeeRole();
                        break;
                    case 'Update an employee manager':
                        this.updateEmployeeManager();
                        break;
                    case 'Quit':
                        process.exit();
                    default:
                        console.error('An error occurred.');
                        return;
                }
            })
    }
}

export default Cli;