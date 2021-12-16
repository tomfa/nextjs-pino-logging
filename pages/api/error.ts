import Logger from "../../logger";
import requestHandler from "../../middlewares/requestHandler";

const handler = requestHandler().get((req, res) => {
  const user = { id: "123", name: "John Doe" };
  Logger.info("I will try to add new user...", {
    action: "USER_LOGIN",
    domain: "AUTH",
    customerId: user.id,
  });

  // This will fail, triggering error handling
  // @ts-ignore
  const willError = user.address.zipCode;

  res.status(200).json(user);
});

export default handler;
