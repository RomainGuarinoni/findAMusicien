import pg from '../postgres';
import sql from 'sql-template-strings';
import express from 'express';
import jwt from 'jsonwebtoken';
import type { operations } from '@schema';
import { Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getRequestBody, getResponsesBody } from '@typing';

type PostToken = operations['postRefreshToken'];

const router = express.Router();

router.post(
  '/',
  async (
    req: Request<
      Pick<string, never>,
      Pick<string, never>,
      getRequestBody<PostToken>,
      Pick<string, never>
    >,
    res: core.Response<
      getResponsesBody<PostToken>,
      Pick<string, never>,
      getHTTPCode<PostToken>
    >,
  ) => {
    try {
      const { rows } = await pg.query(sql`
        SELECT * FROM tokens
        WHERE token=${req.body.refreshToken}
    `);
      if (rows.length === 0) {
        res.status(401).json({ msg: 'E_INVALID_REFRESH_TOKEN' });
      }

      jwt.verify(
        req.body.refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, result) => {
          if (err) {
            res.status(401).json({ msg: 'E_INVALID_REFRESH_TOKEN' });
          }
          const accessToken = jwt.sign(
            { userId: result.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' },
          );

          res.status(200).json({ accessToken });
        },
      );
    } catch (err) {
      res.status(500).json({ msg: 'E_SQL_ERROR', stack: err });
    }
  },
);

export default router;
