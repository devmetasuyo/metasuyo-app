import bcrypt from "bcryptjs";

const password = "Elnegromk123*";
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log("Password Hash:", hash);

