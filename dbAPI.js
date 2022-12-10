import express from "express";
import {
    mdbAddUser,
    mdbCheckUserName,
    mdbGetUserSaltHash,
} from "./src/mongoDB.js";
import { API_FIND_USER, API_REGISTER_USER } from "./constants/api.js";
const dbAPI = express.Router();

// middleware that is specific to this router
dbAPI.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
});

dbAPI.use(async (req, res, next) => {
    console.log(req.url);
    switch (req.url) {
    case API_REGISTER_USER: {
        // res.writeHead(200, { "Content-Type": "application/json" });
        console.log("Adding New User");
        console.log(req.body);
        await mdbAddUser(
            req.body.username,
            req.body.email,
            req.body.salt_hash,
            req.body.name
        );
        // res.end(JSON.stringify(true));
        res.send("true");
        break;
    }
    case API_FIND_USER: {
        res.writeHead(200, { "Content-Type": "application/json" });
        const exists = await mdbCheckUserName(req.body.username);
        console.log("first done");
        console.log(req.body);
        const salt_hash = await mdbGetUserSaltHash(req.body.username);
        console.log("Exists and salt_hash are obtained");
        const result = { exists, salt_hash };
        console.log(result);
        res.end(JSON.stringify(result));
        break;
    }
    default:
        next();
    }
});

export default dbAPI;