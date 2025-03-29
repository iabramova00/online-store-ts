import express from "express";
const router = express.Router();

router.post("/test", (req, res) => {
  res.send("working");
});

export default router;
