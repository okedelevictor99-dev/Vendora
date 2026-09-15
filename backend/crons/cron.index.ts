import { stockExpiryCron } from "./cron.order";
// import { paymentVerificationCron } from "./cron.payment";

export const initCrons = () => {
  stockExpiryCron();
  // paymentVerificationCron();
};