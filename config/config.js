const config = {
    "port" : 4500,
    "locals" : {
        "name" : "Node js express template",
        "title" : "Template"
    },
    "setupDb" : {
        "host": "localhost",
        "user": "root",
        "password": "",
    },
    "db" : {
        "host": "localhost",
        "user": "root",
        "password": "",
        "database": "template"
    },
    "sessionPass" : 'SampleSecretForEduOnly!!!!',
    "banTimer": 10 * 1000, 
}

module.exports = config;