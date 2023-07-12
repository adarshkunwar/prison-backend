import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import * as morgan from 'morgan';
import * as swaggerJsDoc from 'swagger-jsdoc';
import * as swaggerUiExpress from 'swagger-ui-express';
import AppError from './Utils/AppError';
import { port } from './config';
import { AppDataSource } from './data-source';

// routes import
import BlockRoutes from './Routes/Block.routes';
import CellRoutes from './Routes/Cell.routes';
import PrisonRoutes from './Routes/Prison.routes';
import PrisonerRoutes from './Routes/Prisoner.routes';
import StaffRoutes from './Routes/Staff.routes';
import VisitorRoutes from './Routes/Visitor.routes';

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cors({ credentials: true, origin: '*' }));
    app.use('/public', express.static('src/Public'));
    app.use(morgan('dev'));

    // swagger options
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Prison Management API',
          version: '1.0.0',
          description: 'Prison Management API',
          contact: {
            name: 'Adarsh Kunwar',
          },
          servers: [4002],
        },
      },
      apis: [
        './routes/*.ts',
        './Routes/*.ts',
        './**/*.ts',
        `${__dirname}/Routes/*.routes.ts`,
        `${__dirname}/Routes/*.routes.ts`,
      ],
    };

    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use(
      '/api-docs',
      swaggerUiExpress.serve,
      swaggerUiExpress.setup(swaggerDocs)
    );

    // routes here
    app.get('/', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'success',
        message: 'Welcome to Prison Management API',
      });
    });

    // custom routes
    app.use('/block', BlockRoutes);
    app.use('/cell', CellRoutes);
    app.use('/prison', PrisonRoutes);
    app.use('/prisoner', PrisonerRoutes);
    app.use('/staff', StaffRoutes);
    app.use('/visitor', VisitorRoutes);

    // unhandled routes
    app.all('*', (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
    });

    // global error handler
    app.use(
      (err: AppError, req: Request, res: Response, next: NextFunction) => {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';

        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      }
    );

    // start express server
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
