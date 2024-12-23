import { Routes } from '@angular/router';

import { RegisterComponent } from './app/auth/register/register.component';
import { LoginComponent } from './app/auth/login/login.component';
import { ExamListComponent } from './app/admin/Exam/exam-list/exam-list.component';
import { AddExamComponent } from './app/admin/Exam/add-exam/add-exam.component';
import { EditExamComponent } from './app/admin/Exam/edit-exam/edit-exam.component';
import { DashboardComponent } from './app/admin/dashboard/dashboard.component';
import { StudentDashboardComponent } from './app/Student/dashboard/dashboard.component';
import { StartExamComponent } from './app/Student/dashboard/start-exam/start-exam.component';
import { ExamHistoryComponent } from './app/Student/dashboard/exam-history/exam-history.component';
import { SubjectsComponent } from './app/admin/subjects/subject-list/subjects.component';
import { AddSubjectComponent } from './app/admin/subjects/add-subject/add-subject.component';
import { EditSubjectComponent } from './app/admin/subjects/edit-subjects/edit-subjects.component';
import { QuestionsComponent } from './app/admin/questions/question-list/questions.component';
import { EditQuestionComponent } from './app/admin/questions/edit-question/edit-question.component';
import { AddQuestionComponent } from './app/admin/questions/add-question/add-question.component';
import { StudentsComponent } from './app/admin/students/students.component';
import { StudentExamHistoryComponent } from './app/admin/students/exam-history/exam-history.component';
import { UnauthorizedComponent } from './app/unauthorized/unauthorized.component';
import { SubjectExamHistoryComponent } from './app/admin/subjects/exam-history/subject-exam-history.component';
import { NotfoundComponent } from './app/notfound/notfound.component';

// Guards
import { AdminGuard } from './app/services/Guards/admin.guard';
import { StudentGuard } from './app/services/Guards/student.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'notfound', component: NotfoundComponent},
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'exams', component: ExamListComponent },
      { path: 'subjects', component: SubjectsComponent },
      { path: 'subjects/add', component: AddSubjectComponent },
      { path: 'subjects/edit/:id', component: EditSubjectComponent },
      {
        path: 'subjects/examhistory/:subjectId',
        component: SubjectExamHistoryComponent,
      },
      { path: 'exams/add-exam', component: AddExamComponent },
      { path: 'exams/edit-exam/:id', component: EditExamComponent },
      { path: 'questions', component: QuestionsComponent },
      { path: 'questions/edit/:id', component: EditQuestionComponent },
      { path: 'questions/add', component: AddQuestionComponent },
      { path: 'students', component: StudentsComponent },
      {
        path: 'students/exam-history/:id',
        component: StudentExamHistoryComponent,
      },
    ],
  },
  {
    path: 'student',
    canActivate: [StudentGuard],
    children: [
      { path: 'dashboard', component: StudentDashboardComponent },
      { path: 'exams/start-exam/:examId', component: StartExamComponent },
      { path: 'exams/exam-history', component: ExamHistoryComponent },
    ],
  },
  { path: '**', redirectTo: 'notfound' },
];
