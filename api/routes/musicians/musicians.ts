import express from 'express';
import type { operations } from '@schema';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type {
  getHTTPCode,
  getPathParams,
  getRequestBody,
  getResponsesBody,
  getRequestQuery,
} from '@typing';
import { getRepository, ILike, FindOneOptions, Any } from 'typeorm';
import { Musician, MusicianGroup } from '../../entity';

type GetMusician = operations['getMusicians'];
type GetMusicianById = operations['getMusicianById'];
const router = express.Router();

router.get(
  '/',
  async (
    req: Request<
      {},
      getResponsesBody<GetMusician>,
      {},
      getRequestQuery<GetMusician>
    >,
    res: core.Response<
      getResponsesBody<GetMusician>,
      {},
      getHTTPCode<GetMusician>
    >,
  ) => {
    try {
      const nameFilter = req.query.name ? `%${req.query.name}%` : null;
      const genresFilter = req.query.genres;
      const instrumentsFilter = req.query.instruments;
      const locationFilter = req.query.location;
      const promotionFilter = req.query.promotion;

      const commonFilter: FindOneOptions<Musician>['where'] = {};
      const queryFilter: FindOneOptions<Musician>['where'] = [];

      if (locationFilter) commonFilter.location = Any(locationFilter);
      if (promotionFilter) commonFilter.promotion = Any(promotionFilter);

      if (nameFilter) {
        // see https://github.com/typeorm/typeorm/issues/2929
        queryFilter.push(
          {
            givenName: ILike(nameFilter),
            ...commonFilter,
          },
          {
            familyName: ILike(nameFilter),
            ...commonFilter,
          },
        );
      } else {
        queryFilter.push(commonFilter);
      }

      // The where clause for the where of the join tables : genres and instruments
      let joinQuery = '';
      let joinValue = {};
      if (instrumentsFilter && genresFilter) {
        joinQuery =
          'instruments.name = ANY(:instruments) AND genres.name = ANY(:genres)';
        joinValue = { instruments: instrumentsFilter, genres: genresFilter };
      } else if (instrumentsFilter) {
        joinQuery = 'instruments.name = ANY(:instruments)';
        joinValue = { instruments: instrumentsFilter };
      } else if (genresFilter) {
        joinQuery = 'genres.name = ANY(:genres)';
        joinValue = { genres: genresFilter };
      }

      // This is a work around to make where clause on relation, see : https://github.com/typeorm/typeorm/issues/4396
      const musicians = await getRepository(Musician).find({
        join: {
          alias: 'musician',
          innerJoin: {
            instruments: 'musician.instruments',
            genres: 'musician.genres',
          },
        },
        where: (qb) => {
          if (joinQuery == '') {
            qb.where(queryFilter);
          } else {
            qb.where(queryFilter).andWhere(joinQuery, joinValue);
          }
        },
        relations: ['instruments', 'genres'],
      });

      return res.status(200).json(musicians);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

router.get(
  '/:musicianId',
  async (
    req: Request<
      getPathParams<GetMusicianById>,
      getResponsesBody<GetMusicianById>,
      getRequestBody<GetMusicianById>,
      {}
    >,
    res: core.Response<
      getResponsesBody<GetMusicianById>,
      {},
      getHTTPCode<GetMusicianById>
    >,
  ) => {
    try {
      const musician = await getRepository(Musician).findOne({
        where: { id: req.params.musicianId },
        relations: ['instruments', 'genres'],
      });

      if (!musician) {
        return res.status(404).json({ msg: 'E_UNFOUND_USER' });
      }

      const musicianGroups = await getRepository(MusicianGroup).find({
        where: [
          {
            musician,
            membership: 'admin',
          },
          {
            musician,
            membership: 'member',
          },
        ],
        relations: ['group', 'group.genres'],
      });

      const groups = musicianGroups.map(({ group }) => group);

      return res.status(200).json({ ...musician, groups });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

export default router;
