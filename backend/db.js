import mysql from 'mysql2/promise';

let pool = null;

export const getPool = () => {
    return pool;
};

export const createPool = (username, password) => {
    // Close the existing pool if it exists
    if (pool) {
        pool.end();
    }

    // Create a new pool with the logged-in user's credentials
    pool = mysql.createPool({
        host: '127.0.0.1',
        user: username,
        password: password,
        database: 'DBMS_PROJECT_MAIN',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    return pool;
};
