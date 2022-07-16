import { app } from "./app.js";
import colors from 'colors';

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.cyan.underline));