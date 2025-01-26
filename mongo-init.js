// Fetch environment variables
const dbName = process.env.MONGO_INITDB_DATABASE || 'default_database';
const dbUser = process.env.MONGO_INITDB_ROOT_USERNAME || 'default_user';
const dbPassword = process.env.MONGO_INITDB_ROOT_PASSWORD || 'default_password';

db.createUser({
    user: dbUser,
    pwd: dbPassword,
    roles: [
      {
        role: "readWrite",
        db: dbName,
      },
    ],
  });
  
db = db.getSiblingDB(dbName);

print(`Initialized database '${dbName}' with user '${dbUser}'.`);