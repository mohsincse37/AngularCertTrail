import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CertificationTopic, CertificationScheme } from '../Models/certification';

@Injectable({
    providedIn: 'root'
})
export class CertificationService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiBaseUrl;

    getTopicsWithSchemes(accessType: number = 1, duration: number = 3) {
        return this.http.get<CertificationTopic[]>(`${this.apiUrl}/CertificationScheme/GetCertificationTopicsWithSchemes/${accessType}/${duration}`);
    }

    getTopicsByUserId() {
        return this.http.get<CertificationTopic[]>(`${this.apiUrl}/CertificationTopic/GetActiveCertificationTopicsByUserID`);
    }

    getQuestionsByTopicId(topicId: number) {
        return this.http.get<any[]>(`${this.apiUrl}/QuestionOption/GetQuestionWithOptionByTopicID/${topicId}`);
    }

    getAccessTypes(topicId: number) {
        return this.http.get<any[]>(`${this.apiUrl}/CertificationScheme/GetAccessTypes/${topicId}`);
    }

    getDurationTypes(topicId: number) {
        return this.http.get<any[]>(`${this.apiUrl}/CertificationScheme/GetDurationtypes/${topicId}`);
    }

    getSchemeAmount(topicId: number, accessType: number, duration: number) {
        return this.http.get<any[]>(`${this.apiUrl}/CertificationScheme/GetSchemeAmount/${topicId}/${accessType}/${duration}`);
    }

    getTopics() {
        return this.http.get<CertificationTopic[]>(`${this.apiUrl}/CertificationTopic/GetCertificationTopics`);
    }

    addTopic(formData: FormData) {
        return this.http.post(`${this.apiUrl}/CertificationTopic/AddCertificationTopic`, formData);
    }

    updateTopic(id: number, formData: FormData) {
        return this.http.put(`${this.apiUrl}/CertificationTopic/UpdateCertificationTopic/${id}`, formData);
    }

    deleteTopic(id: number) {
        return this.http.delete(`${this.apiUrl}/CertificationTopic/DeleteCertificationTopic/${id}`);
    }

    getSchemes() {
        return this.http.get<CertificationScheme[]>(`${this.apiUrl}/CertificationScheme/GetCertificationSchemes`);
    }

    addScheme(scheme: any) {
        return this.http.post(`${this.apiUrl}/CertificationScheme/AddCertificationScheme`, scheme);
    }

    updateScheme(id: number, scheme: any) {
        return this.http.put(`${this.apiUrl}/CertificationScheme/UpdateCertificationScheme/${id}`, scheme);
    }

    deleteScheme(id: number) {
        return this.http.delete(`${this.apiUrl}/CertificationScheme/DeleteCertificationScheme/${id}`);
    }

    getQuestions() {
        return this.http.get<any[]>(`${this.apiUrl}/CertificationQuestion/GetCertificationQuestion`);
    }

    addQuestion(formData: FormData) {
        return this.http.post(`${this.apiUrl}/CertificationQuestion/AddCertificationQuestion`, formData);
    }

    updateQuestion(id: number, formData: FormData) {
        return this.http.put(`${this.apiUrl}/CertificationQuestion/UpdateCertificationQuestion/${id}`, formData);
    }

    deleteQuestion(id: number) {
        return this.http.delete(`${this.apiUrl}/CertificationQuestion/DeleteCertificationQuestion/${id}`);
    }

    getQuestionNo(topicId: number) {
        return this.http.get<any>(`${this.apiUrl}/CertificationQuestion/GetMaxQuestionNo/${topicId}`);
    }

    getOptions() {
        return this.http.get<any[]>(`${this.apiUrl}/QuestionOption/GetQuestionOption`);
    }

    addOption(formData: FormData) {
        return this.http.post(`${this.apiUrl}/QuestionOption/AddQuestionOption`, formData);
    }

    updateOption(id: number, formData: FormData) {
        return this.http.put(`${this.apiUrl}/QuestionOption/UpdateQuestionOption/${id}`, formData);
    }

    deleteOption(id: number) {
        return this.http.delete(`${this.apiUrl}/QuestionOption/DeleteQuestionOption/${id}`);
    }

    setCorrectOption(data: any) {
        return this.http.post(`${this.apiUrl}/QuestionCorrectOptions/CreateQuestionCorrectOptions`, data);
    }

    getQuestionsByTopic(topicId: number) {
        return this.http.get<any[]>(`${this.apiUrl}/CertificationQuestion/GetQuestionDataByTopicID/${topicId}`);
    }

    getOptionsByQuestion(questionId: number) {
        return this.http.get<any[]>(`${this.apiUrl}/QuestionOption/GetOptionDataByQuestionID/${questionId}`);
    }
}
