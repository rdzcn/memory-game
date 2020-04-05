import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.send({ response: "checking incoming connections" }).status(200);
});

export default router;