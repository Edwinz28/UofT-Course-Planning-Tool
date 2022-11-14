# Education Pathways Plus (EP+)

This code builds on the existing project **Education Pathways**, the repository for the previous project can be found [here](https://github.com/ECE444-2022Fall/Assignment_1_starter_template).

While this project broadly serves as a proof of concept rather than a finished product, the app is deployed on Heroku ([up untill November 28th](https://thenewstack.io/where-can-heroku-free-tier-users-go/#:~:text=Wise%20added%20that%20starting%20Oct,free%20dynos%20and%20data%20services.)) and can be accessed at https://education-pathways-plus.herokuapp.com/. More information on the changes to Heroku can be found [here]( https://blog.heroku.com/next-chapter).

Any feedback is welcomed and can be sent to rickyjr.yang@mail.utoronto.ca.

## Running Locally

The project is split into a frontend `reactjs` and a backend `flask` server.

### Setup and Activate the Backend Server

- Enter the root directory
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
"proxy": "http://host.docker.internal:5050/",
# Under the root directory
docker compose up --build
```

## Deployment to Heroku

The webapp can be deployed to heroku (before November 28th) via the following commands. An important note that one should make sure to run `npm build` to update the build folder before pushing to heroku. Pushing without doing so will result in an outdated or broken deployed app.

Refer to the official [Heroku documentation for deployment](https://devcenter.heroku.com/articles/git#deploy-your-code) for further support.

```bash
heroku login
heroku create your-unique-name
heroku git:remote -a your-unique-name
git push heroku main
```

