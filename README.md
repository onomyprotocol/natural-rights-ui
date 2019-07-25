# React Client

## Installation

You must have an up-to-date Node runtime installed (e.g. v10.0 and above).

In order to get the project running, use the following commmand:

```bash
npm install && npm run development
```

From there, navigate to http://localhost:3000/

## Testing

In order to run tests, run the following:

```bash
npm test
```

In order to have your tests watched, run the following:

```bash
npm run watch
```

## Building

If you want to make sure what you have will be ran on the production
environment, have Docker installed and run the following:

```bash
npm run build
docker build -t haven-fe . && docker run -d 3000:80 haven-fe
```
