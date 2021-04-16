//TODO: delete all usages of FileSystem - use DataBase instead
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

//TODO: delete all usages of myConsole
const myConsole = new console.Console(fs.createWriteStream('./logs/results.json'));
//TODO: delete all usages of WORKFOLDER
const WORKFOLDER = 'classroomapi/';
//TODO: think about can this be configured in the database, for different platforms
//TODO: create a Table with Platform authorizations: "Platform", "Url?", "Token", "Credentials?"
const SCOPES = ['https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.student-submissions.me.readonly https://www.googleapis.com/auth/classroom.student-submissions.students.readonly'];

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // TODO: Check in Database
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // TODO: Store the token to DataBase
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Lists the first 10 courses the user has access to.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listCourses(auth) {
    const classroom = google.classroom({ version: 'v1', auth });
    classroom.courses.list({
    }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        const courses = res.data.courses;
        if (courses && courses.length) {
            courses.forEach((course) => {
                course_id = course.id;
            });
            grades = [];
            user_names = [];
            assignment_names = [];
            extract = [];
            classroom.courses.courseWork.studentSubmissions.list({ "courseId": course_id, "courseWorkId": "-" }, (err, res) => {
                res.data.studentSubmissions.forEach((submission) => { if (submission.assignedGrade) { grades.push({ "assignmentId": submission.courseWorkId, "userId": submission.userId, "grade": submission.assignedGrade }) } });
                grades.sort((a, b) => b.assignmentId - a.assignmentId || b.userId - a.userId);
                classroom.courses.students.list({ "courseId": course_id }, (err, res) => {
                    res.data.students.forEach((user) => { user_names.push({ "userId": user.userId, "fullName": user.profile.name.fullName }) });
                    classroom.courses.courseWork.list({ "courseId": course_id }, (err, res) => {
                        res.data.courseWork.forEach((task) => { assignment_names.push({ "assignmentId": task.id, "title": task.title }) });
                        grades.forEach((el) => { extract.push({"assignmentName": assignment_names.find(element => element["assignmentId"] == el.assignmentId).title , "studentName": user_names.find(element => element["userId"] == el.userId).fullName , "studentGrade": el.grade}) });
                        myConsole.log(JSON.stringify(extract));
                    });
                });
            });
        } else {
            console.log('No courses found.');
        }
    });
}


// TODO: will accept user id and get user email
// TODO: will return a total number of marks for this user for all courses
const handleGetTotalMarks = (db) => (req, res) => {
    const { id } = req.params;
    db.select('Email').from('Users').where('Id', id)
    .then(email => {
        if (email) {
            res.json(email)
            //TODO: call Google api for user with this Email
        }
        else {
            res.status(400).json('User with such id not found')
        }
    })
    .catch(err => res.status(400).json('error getting user'))

    // TODO: load client credentials from the database
    // Load client secrets from a local file.
    // fs.readFile(WORKFOLDER+'credentials.json', (err, content) => {
    //     if (err) return console.log('Error loading client secret file:', err);
    //     // Authorize a client with credentials, then call the Google Classroom API.
    //     authorize(JSON.parse(content), listCourses);
    // });

}

module.exports = { handleGetTotalMarks} 