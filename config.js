module.exports = {
    user: 'sa', // For SQL Server authentication
    password: 'Subh@sh22',
    server: 'MSI',    // Change this to your SQL Server's address
    database: 'employees',
    options: {                // For secure connections
        trustServerCertificate: true   // Trust self-signed certificate
    }
};
  