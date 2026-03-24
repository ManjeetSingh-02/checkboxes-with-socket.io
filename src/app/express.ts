// internal-imports
import { checkBoxState } from '../core/index.js';

// external-imports
import express from 'express';

// type-imports
import type { Application, Request, Response } from 'express';

// function to create application
export default function createApp(): Application {
  // create express application
  const application = express();

  // attach middlewares
  application
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.static('public'));

  // @route GET /checkbox-state
  application.get('/checkbox-state', (_request: Request, response: Response) => {
    return response.status(200).json({ checkBoxState });
  });

  // return the application
  return application;
}
