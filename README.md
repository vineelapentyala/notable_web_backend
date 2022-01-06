# notable_web_backend
Take Home Project for Notable Health
# Web API using NodeJS, TypeScript, TypeORM and a Postgres DB(running on Docker)

Steps to run this project:

1. Make sure Node.js, npm and docker-compose are installed
To check if you have installed Node.js, run:
```
node -v
```
To check if you have installed npm, run:
```
npm -v
```
To check if you have installed docker-compose, run:
```
docker-compose --version
```
2. clone the repository to your computer
3. Install dependencies
In the root folder, Run `npm i` command
4. If you don't have a local instance of postgres running, run `docker compose up -d` to run an instance of postgres on a docker container
5. If you do, Setup database settings inside `ormconfig.json` file 
    or 
   stop the local instance to free port 5432  and run `docker compose up -d`
6. Run `npm start` command

The app runs on "http://localhost:3000/" by default

## Using The Api
### Get a list of all the doctors (GET)
Send a **GET** request to the URI, "http://localhost:3000/doctors" to get a list of all doctors

### Get information about a specific doctor (GET)
Send a **GET** request to the URI, "http://localhost:3000/doctors/:id" where :id is a valid id for a doctor. The database initially has 2 doctors in the corresponding table. You can use an id 1 or 2 to test initially

##### Example Request 
```
"http://localhost:3000/doctors/1"
```
##### Example Response
```
{
    "id": 1,
    "firstName": "Timber",
    "lastName": "Saw"
}
```
### Create a new appointment for a doctor (GET)
Send a **POST** request to the URI, "http://localhost:3000/doctors/:id/appointments", to add a new appointment, where :id is a valid ID for a doctor

##### Body
|          Name | Required |   Type  | Description |
| -------------:|:--------:|:-------:| ----------- |
| `patientFirstName`      | required | string  | first name of the patient |
| `patientLastName`      | required | string  | last name of the patient |
| `date`      | required | string  | date of appointment, format YYYY-MM-DD|
| `time`      | required | string  | time of appointment, format HH:MM:SS in a 24hr format, must be in 15 minute intervals, MM can be 00, 15, 30 or 45|
| `type`      | not required | enum  | should be of type 'New Patient'(default) or 'Follow Up' |

##### Example Request 
```
http://localhost:3000/doctors/2/appointments

body 
{
    "patientFirstName" : "Sai K",
    "patientLastName" : "Kasiraju",
    "appointmentDate" : "2020-02-25",
    "appointmentTime" : "09:00:00",
    "appointmentType" : "New Patient"
}
```
If the request is successful, a record will be added to the **apointments** table. The response will be a JSON representation of this appointment.
##### Example Response
```
{
    "patientFirstName": "Sai K",
    "patientLastName": "Kasiraju",
    "appointmentDate": "2020-02-25",
    "appointmentTime": "09:00:00",
    "appointmentType": "New Patient",
    "doctor": {
        "id": 2,
        "firstName": "John",
        "lastName": "Smith"
    },
    "id": 5
}
```
### Get a list of all appointments associated with a doctor (GET)
Send a **GET** request to the URI, "http://localhost:3000/doctors/:id/appointments" where :id is a valid id for a doctor. 

##### Example Request 
```
"http://localhost:3000/doctors/1/appointments"
```
##### Example Response
```
{
    "id": 1,
    "firstName": "Vineela",
    "lastName": "Pentyala",
    "appointments": [
        {
            "id": 1,
            "patientFirstName": "Sai",
            "patientLastName": "Kasiraju",
            "appointmentDate": "2022-02-10",
            "appointmentTime": "10:00:00",
            "appointmentType": "New Patient"
        },
        {
            "id": 2,
            "patientFirstName": "Sai",
            "patientLastName": "Kasiraju",
            "appointmentDate": "2022-02-28",
            "appointmentTime": "13:30:00",
            "appointmentType": "Follow Up"
        },
        {
            "id": 3,
            "patientFirstName": "Jane",
            "patientLastName": "Doe",
            "appointmentDate": "2022-02-10",
            "appointmentTime": "14:00:00",
            "appointmentType": "New Patient"
        }
    ]
}
```

### Get a list of all appointments associated with a doctor, on a given date (GET)
Send a **GET** request to the URI, "http://localhost:3000/doctors/:id/appointments?date=YYYY-MM-DD" where :id is a valid id for a doctor. Please enter the date in the `YYYY-MM-DD` format. 

##### Example Request 
```
"http://localhost:3000/doctors/1/appointments?date=2022-02-10"
```
##### Example Response
```
{
    "id": 1,
    "firstName": "Vineela",
    "lastName": "Pentyala",
    "appointments": [
        {
            "id": 1,
            "patientFirstName": "Sai",
            "patientLastName": "Kasiraju",
            "appointmentDate": "2022-02-10",
            "appointmentTime": "10:00:00",
            "appointmentType": "New Patient"
        },
        {
            "id": 3,
            "patientFirstName": "Jane",
            "patientLastName": "Doe",
            "appointmentDate": "2022-02-10",
            "appointmentTime": "14:00:00",
            "appointmentType": "New Patient"
        }
    ]
}
```


### Delete an appointment associated with a doctor (GET)
Send a **DEL** request to the URI, "http://localhost:3000/doctors/:id/appointments/:appointmentId" where :id is a valid id for a doctor and :appointmentId is a valid id of an appointment. Please create a few appointments using the post request above before trying to delete the appointments. The id should be a valid doctor id and appointmentid should be of an appointment associated with the doctor
##### Example Request 
```
http://localhost:3000/doctors/1/appointments/2
```
##### Example Response
```
{
    "raw": [],
    "affected": 1
}
```

You can check for this deletion by sending the request 
```
http://localhost:3000/doctors/1/appointments/2
```
which will now not include the deleted appointment
