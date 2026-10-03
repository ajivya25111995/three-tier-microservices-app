IF DB_ID('MicroservicesUsersDb') IS NULL
BEGIN
    CREATE DATABASE MicroservicesUsersDb;
END
GO

IF DB_ID('MicroservicesOrdersDb') IS NULL
BEGIN
    CREATE DATABASE MicroservicesOrdersDb;
END
GO
