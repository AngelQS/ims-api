// Third
import express, { Application, Request, Response } from "express";

// Initializations
const app: Application = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Word");
});

app.listen(PORT, () => {
  console.log(`>> Server running on port ${PORT}`);
});
