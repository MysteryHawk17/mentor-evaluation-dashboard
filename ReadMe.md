# Evaluation Dashboard App - Mentor View

The project aims to provide a solution for the assignment for Scaler Intern 2024.

## Requirements

1. **Adding Students for Evaluation:**
   - Mentors can add students they wish to evaluate, adhering to the following conditions:
     - A mentor can only accommodate a minimum of 3 and a maximum of 4 students at a time.The checks have been done on backend as well as frontend assuring that it doesnot violate the criterion.
     - At first a mentor has not been assigned any students and so he cannot acccess the dashboard. Only after successful assigning of 3 students is the dashboard accessible.
     - No two mentors can assign the same student during the evaluation period.Once the student is assigned to a mentor. Unless the mentor edits its student panel no other mentor can see the student in the available section. 

2. **Assigning Marks:**
   - Mentors can assign marks to each student based on various parameters such as ideation, execution, viva and Team Work.
   - Total marks should be visible to the mentor.

3. **Editing/Removing Students and Marks:**
   - Mentors can edit or remove assigned students, adhering to the same conditions as adding new students.
   - Mentors can also edit assigned marks to students.
   - Once the marks of a student is locked by a mentor the mentor cannot unassign the student.

4. **Final Submission:**
   - Mentors can submit the final marks, after which they are locked and cannot be edited.
   - Methods have been implemented such that the mentors gets the feature to lock for all as well as one student at a time.
   - If some students have unassigned marks, mentors cannot submit/lock the marks.However the mentor is still able to lock marks for the selected students.

5. **Viewing:**
   - The landing page consists of a list of mentors which is a depiction of different accounts which are present on the portal.
   - After entering the portal, the mentors have two options to either assign/ unassign the students or view the marks.

## Assumptions

- Since no login/signup has been asked , I have created a landing page which would serve as a gateway to different mentors account.
- Student and mentor accounts are created directly in the database.

## Additionals

1. **Email Notification:**
   - Email notifications have been implemented using amazon SES service using aws-sdk.

2. **Marksheet Generation:**
   - A download button has been provided for the mentor to download the data of all the students into a csv file.

3. **Responsive Design:**
   - The website have been made responsive to most extent for all kinds of mobile, tablets and computers.

## Project Structure

- **Backend:**
  - The backend is implemented using nodejs and typescript . For emailing AWS-SDK is used. Zod is also used to validate inputs to ensure that the inputs are correctly stored in the database.I have tried to  properly mention in comments all the required informations for a controller to enable easy code reviews.
- **Frontend:**
  - Frontend is implemented using NextJs ,Typescript and is styled using tailwind css and shadCn UI components along with some
  custom colors
- **Database Schema:**
  - Mongodb is used with mongoose as the ODM to enable easy access to the database.

## Future Improvements

- I have tried to implement every feature that has been asked for.However there are a few improvements which could have been do
  done in the project if the time would have allowed.
- The backend contains two documents for both student and mentors for simplicity. The required implementations could have also  been done with single document with role based access and other features.
- As the application is a small application with no much complexity it is implememted without using any state management tools.
  When the complexity increases the implementation of redux or recoil for state management would prove effective for the state management as well as improve performance of the website.

