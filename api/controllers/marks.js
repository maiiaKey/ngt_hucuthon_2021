const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
let sum = 0;
const WORKFOLDER = 'controllers/';
const SCOPES = ['https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.student-submissions.me.readonly https://www.googleapis.com/auth/classroom.student-submissions.students.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(email, credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client, email);
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

function listCourses(auth, studentEmail) {
    const classroom = google.classroom({ version: 'v1', auth });
    classroom.courses.list({
    }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        const courses = res.data.courses;
        if (courses && courses.length) {
            const course_id = courses[0].id;
            grades = [];
            user_names = [];
            assignment_names = [];
            extract = [];
            classroom.courses.courseWork.studentSubmissions.list({ "courseId": course_id, "courseWorkId": "-" }, (err, res) => {
                res.data.studentSubmissions.forEach((submission) => { if (submission.assignedGrade) { grades.push({ "assignmentId": submission.courseWorkId, "userId": submission.userId, "grade": submission.assignedGrade }) } });
                grades.sort((a, b) => b.assignmentId - a.assignmentId || b.userId - a.userId);
                classroom.courses.students.list({ "courseId": course_id }, (err, res) => {
                    res.data.students.forEach((user) => { user_names.push({ "userId": user.userId, "emailAddress": user.profile.emailAddress }) });
                    classroom.courses.courseWork.list({ "courseId": course_id }, (err, res) => {
                        res.data.courseWork.forEach((task) => { assignment_names.push({ "assignmentId": task.id, "title": task.title }) });
                        grades.forEach((el) => { extract.push({ "assignmentName": assignment_names.find(element => element["assignmentId"] == el.assignmentId).title, "emailAddress": user_names.find(element => element["userId"] == el.userId).emailAddress, "studentGrade": el.grade }) });
                        extract.forEach((combo) => {
                            if (studentEmail == combo.emailAddress) { sum += combo.studentGrade }
                        });
                    });
                });
            });
        } else {
            console.log('No courses found.');
        }
    });
}

const handleGetTotalMarks = (db) => (req, res) => {
    const { id } = req.params;
    db.select('Email').from('Users').where('Id', id)
        .then(email => {
            if (email) {
                email = email[0].Email;
                sum = 0;
                fs.readFile(WORKFOLDER + 'credentials.json', (err, content) => {
                    if (err) return console.log('Error loading client secret file:', err);
                    // Authorize a client with credentials, then call the Google Classroom API.
                    return authorize(email, JSON.parse(content), listCourses);
                })
                setTimeout(function () {
                    res.json(sum)
                }, 10000)
            }
            else {
                res.status(400).json('User with such id not found')
            }
        })
        .catch(err => res.status(400).json("error when trying to find user by email"))

}

module.exports = { handleGetTotalMarks }