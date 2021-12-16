import type { NextApiRequest, NextApiResponse } from "next";
import { withMiddlewares } from "../../middlewares/withMiddlewares";
import Logger from "../../logger";

function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    name: string;
  }>
) {
  // const user = createNewUser();
  const user = { id: '123', name: 'John Doe '}

  Logger.info('info', {
    action: 'USER_LOGIN',
    domain: 'AUTH',
    customerId: user.id,
  })
  res.status(200).json(user);
}

export default withMiddlewares(handler);
