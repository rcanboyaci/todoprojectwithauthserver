import config_dev from "./config_dev";
import config_prod from "./config_prod";

const config = process.env.REACT_APP_ENV === "prod" ? config_prod : config_dev;

export default config;
