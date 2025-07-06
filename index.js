const express = require('express');
const cors = require('cors');
const authRouter = require('./routers/authRouter');
const childrenRouter = require('./routers/childrenRouter');
const thoiGianBieuRouter = require('./routers/thoiGianBieuRouter');
const scheduleRouter = require('./routers/scheduleRouter');
const evaluationRouter = require("./routers/evaluationRouter");
const adminRouter = require('./routers/adminRouter');
const payosRouter = require('./routers/payosRouter');

const connectDB = require('./configs/connectDB');
const errorMiddleHandle = require('./middlewares/errorMiddleWare');

const dotenv = require('dotenv');
const app = express();

dotenv.config();

// app.use(cors({ origin: '*' })); // Cho phép tất cả các nguồn truy cập
app.use(cors());
app.use(express.json());
connectDB();

const PORT = process.env.PORT || 3000;

app.use('/auth', authRouter);
app.use('/api/children', childrenRouter);
app.use('/api/thoigianbieu', thoiGianBieuRouter);
app.use('/api/schedule', scheduleRouter);
app.use("/api/evaluation", evaluationRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payos', payosRouter);

app.use(errorMiddleHandle);

app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is running at : http://0.0.0.0:${PORT}`);
});