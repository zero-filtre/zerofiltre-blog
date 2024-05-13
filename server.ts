import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import axios from 'axios';
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import rateLimit from 'express-rate-limit';
import slugify from "slugify";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (request, response) => String(request.headers['x-forwarded-for'])
})

import { createMiddleware, getContentType, getSummary, signalIsUp } from '@promster/express';


// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/zerofiltre-blog/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    inlineCriticalCss: false,
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.use(createMiddleware({
    app: server,
    options: {
      metricPrefix: 'front_'
    }
  }));

  server.get('/metrics', async (req, res) => {
    req.statusCode = 200;

    res.setHeader('Content-Type', getContentType());
    res.end(await getSummary());
  });

 
  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('/sitemaps.xml', async (req, res) => {

    let courseBaseURL = 'https://zerofiltre.tech/cours/';

    let article_data = await axios.get('https://blog-api.zerofiltre.tech/article?pageNumber=0&pageSize=10000&status=published')

    let articles = article_data.data.content;

    const articles_urls = articles.map(article => {

      let slug = slugify(article.title, {
        lower: true,
        remove: /[*+~.()'"!:@]/g
      });

      let url = `https://zerofiltre.tech/articles/${article.id}-${slug}`;

      let xml = `
      <url>
      <loc>${url}</loc>
      <lastmod>${article.lastSavedAt}</lastmod>
      <priority>0.80</priority>
      </url>
      `

      return xml;
    });

    let courses_data = await axios.get('https://blog-api.zerofiltre.tech/course?pageNumber=0&pageSize=10000&status=published')

    const courses_url = await courses_data.data.content.map(async course => {

      let courseXml="";

      let courseUrl = `${courseBaseURL}${course.id}-${slugify(course.title, { lower: true })}`;

      xml += `

      <url>
      <loc>${courseUrl}</loc>
      <lastmod>${course.lastSavedAt}</lastmod>
      <priority>0.80</priority>
      </url>

      `;

      courseXml += xml

      // let chapters = await axios.get(`https://blog-api.zerofiltre.tech/chapter/course/${course.id}`)

      // chapters.data.forEach(chapter => {

      //   chapter.lessons.forEach(lesson => {

      //     let lessonUrl = `${courseUrl}/${lesson.id}-${slugify(lesson.title, { lower: true })}`;

      //     let lessonXml = `

      //     <url>
      //     <loc>${lessonUrl}</loc>
      //     <lastmod>${course.lastSavedAt}</lastmod>
      //     <priority>0.80</priority>
      //     </url>

      //   `;

      //   courseXml += lessonXml

      //   });

      // });

      return courseXml;

    });

    let xml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    
    <url>
    <loc>https://zerofiltre.tech/</loc>
    <lastmod>2023-04-22T01:14:27+00:00</lastmod>
    <priority>1.00</priority>
  </url>

  <!-- ARTICLES ROUTES -->

  <url>
    <loc>https://zerofiltre.tech/articles</loc>
    <lastmod>2023-04-22T01:14:27+00:00</lastmod>
    <priority>0.80</priority>
  </url>

  
  <!-- RANDOM ROUTES -->

  <url>
    <loc>https://zerofiltre.tech/wachatgpt</loc>
    <lastmod>2023-04-22T01:14:27+00:00</lastmod>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://zerofiltre.tech/login</loc>
    <lastmod>2023-04-22T01:14:27+00:00</lastmod>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://zerofiltre.tech/register</loc>
    <lastmod>2023-04-22T01:14:27+00:00</lastmod>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://zerofiltre.tech/resetPassword</loc>
    <lastmod>2023-04-22T01:14:27+00:00</lastmod>
    <priority>0.64</priority>
  </url>

  <!-- END RANDOM ROUTES -->


  <!-- COURSES ROUTES -->

  <url>
    <loc>https://zerofiltre.tech/cours</loc>
    <lastmod>2023-04-22T01:14:27+00:00</lastmod>
    <priority>0.90</priority>
  </url>

    
    \n\n`;

    articles_urls.forEach(url => {
      xml += url;
    });

    courses_url.forEach(course => {
      xml += course;
    });
    
    xml += '</urlset>';
    
    res.setHeader('Content-Type', 'text/xml');
    res.end(xml);

  });

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    console.log('IP: ', req.headers['x-forwarded-for'])
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });


  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
    signalIsUp()
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
