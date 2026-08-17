import database from "@/database/database";
import migrator from "@/models/migrator";

const mailHttpUrl = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

async function deleteAllEmails() {
  await fetch(`${mailHttpUrl}/messages`, {
    method: "DELETE",
  });
}

async function getLastEmail() {
  return await fetch(`${mailHttpUrl}/messages`);
}

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

const orchestrator = {
  deleteAllEmails,
  getLastEmail,
  cleanDatabase,
  runPendingMigrations,
};

export default orchestrator;
