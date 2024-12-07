import express from "express";
import {router} from "./src/routes/utilRoute.js";
import { routerAuth } from "./src/routes/authRoute.js";
import { routerv } from "./src/routes/vehiculeRoute.js";
import { routeri } from "./src/routes/incidentRoute.js";
import { routere } from "./src/routes/entretienRoute.js";
import { routert } from "./src/routes/typeEntretienRoute.js";
import cors from "cors";
import routerd from "./src/routes/docRoute.js";

const app = express();
const port = 3005;

const corsOptions = {
    origin: (origin, callback) => {
      if (["http://localhost:5173"].includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };

app.use(cors(corsOptions));

app.use(express.json());
app.use(router)
app.use(routerAuth)
app.use(routerv)
app.use(routerd)
app.use(routeri)
app.use(routere)
app.use(routert)

app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
});
