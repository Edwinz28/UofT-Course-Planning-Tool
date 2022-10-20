# Education Pathways Plus (EP+)

This code builds on the existing project **Education Pathways**, the repository for the previous project can be found [here](https://github.com/ECE444-2022Fall/Assignment_1_starter_template).

Currently the project is still under development. EP+ will be deployed onto Heroku at a later date upon which the link will be added to this README.

## Running Locally

The project is split into a frontend and backend server. Activate the backend first, followed by the frontend.

### Setup and Activate the Backend Server

- Enter the repo directory
- Create a virtual environment if you have yet to do so and activate it via the following:

```bash
# Windows
py -3 -m venv venv
venv\Scripts\activate

# For Mac and Linux, please check the link: python3 
-m venv venv
python3 -m venv venv
```

- Install the dependencies (if you haven't done this before).

```bash
pip install -r requirements.txt
```

- Enter the `Education_Pathways/` directory and start the flask backend at port 5050

```bash
flask --app index --debug run --port 5050
```

### Activate the Frontend Server

- Enter the `Education_Pathways/frontend/` directory

- Currently for development purposes the backend is locally hosted, thus the following changes are in place

  - the `baseURL` is set as `localhost:5000` in `Education_Pathways\frontend\package.json`

  - The proxy link in package.json is set as `http://localhost:5000/`

- Build and run the frontend:

```bash
npm run build
npm start
```

- Then you will see the application at `localhost:3000`

## Build and run with Docker

Change the proxy link in `package.json` and run `docker compose up` to build, (re)create, start, and attach to the docker container.

```bash
// Part of Education_Pathways/frontend/package.json
"private": true,
"proxy": "http://host.docker.internal:5000/",
# Under the root directory
docker compose up --build
```

## 