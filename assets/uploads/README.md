# Virtual Classroom

Virtual Classroom is a simple stateless microservice with few API endpoints

0. Authentication Endpoint
1. Create/Update/Delete an assignment as a tutor
2. Adding a submission for an assignment as a student
3. Get the details of an assignment
    3.1 	**student** : only the student’s submission will be returned
	3.2	    **tutor** 	: all the submissions added for the assignment by the assigned students will be returned
4. Assignment Feed
    4.1	**tutor**    : return all the assignments created by the tutor
	4.2	**students** : return all the assignments assigned to the student
	4.3	**filters**	 : publishedAt, status


## Features (Enhancements)

- Data Model
- API Documentation
- Send notification (Not yet completed)
- Server URL
- GraphQL Endpoints

## Tech

Virtual Classroom uses a number of open source projects to work properly:

- [Express] - fast node.js network app framework
- [node.js] - evented I/O for the backend

## Installation

Virtual Classroom requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and devDependencies and start the server.

```sh
cd virtual-classroom
npm i
npm run start
```