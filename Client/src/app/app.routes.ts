import { Routes } from '@angular/router';
import { UserComponent } from './Components/user/user.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { DumpsPracticeComponent } from './Components/home/dumps-practice.component';
import { authGuard } from './Guards/auth.guard';
import { TopicMgtComponent } from './Components/management/topic-mgt.component';
import { SchemeMgtComponent } from './Components/management/scheme-mgt.component';
import { QuestionMgtComponent } from './Components/management/question-mgt.component';
import { OptionMgtComponent } from './Components/management/option-mgt.component';
import { CorrectOptionComponent } from './Components/management/correct-option.component';
import { CartComponent } from './Components/home/cart.component';
import { UserMgtComponent } from './Components/management/user-mgt.component';
import { SubscriptionReportComponent } from './Components/management/subscription-report.component';
import { ChangePasswordComponent } from './Components/user/change-password.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'dumps-practice', component: DumpsPracticeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'cart', component: CartComponent },
    { path: 'user', component: UserComponent, canActivate: [authGuard] },
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },
    { path: 'topic-mgt', component: TopicMgtComponent, canActivate: [authGuard] },
    { path: 'scheme-mgt', component: SchemeMgtComponent, canActivate: [authGuard] },
    { path: 'question-mgt', component: QuestionMgtComponent, canActivate: [authGuard] },
    { path: 'option-mgt', component: OptionMgtComponent, canActivate: [authGuard] },
    { path: 'correct-option', component: CorrectOptionComponent, canActivate: [authGuard] },
    { path: 'user-mgt', component: UserMgtComponent, canActivate: [authGuard] },
    { path: 'subscription-report', component: SubscriptionReportComponent, canActivate: [authGuard] },

    // Legacy Aliases for backend menu compatibility (Lowercased to match HTML template logic)
    { path: 'signup', redirectTo: 'register', pathMatch: 'full' },
    { path: 'certificationtopic', redirectTo: 'topic-mgt', pathMatch: 'full' },
    { path: 'certificationscheme', redirectTo: 'scheme-mgt', pathMatch: 'full' },
    { path: 'certificationquestion', redirectTo: 'question-mgt', pathMatch: 'full' },
    { path: 'questionoption', redirectTo: 'option-mgt', pathMatch: 'full' },
    { path: 'rightoptionsetting', redirectTo: 'correct-option', pathMatch: 'full' },
    { path: 'changepassword', redirectTo: 'change-password', pathMatch: 'full' },
    { path: 'userwisetopic', redirectTo: 'subscription-report', pathMatch: 'full' },
    { path: 'usersubscription', component: HomeComponent },
];
