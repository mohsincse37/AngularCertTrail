export interface CertificationTopic {
    topicID: number;
    topicImgPath: string;
    topicTitle: string;
    topicDetail: string;
    accessType?: number;
    accessTypeText?: string;
    accessDuration?: number;
    durationUnitText?: string;
    amount?: number;
    amountUnit?: string;
    id?: number; // The Scheme ID
}

export interface CertificationScheme {
    id: number;
    topicID: number;
    accessType: number;
    accessDuration: number;
    durationUnit: number;
    amount: number;
    amountUnit: string;
    topicTitle?: string;
    accessTypeText?: string;
    durationUnitText?: string;
}

export interface Question {
    questionID: number;
    questionNo: number;
    questionTitle: string;
    questionImgPath?: string;
    optionType: number; // 1 for radio, 2 for checkbox
    correctOptionID: string;
    correctOptionTitle: string;
    ansDescription: string;
    qOption: QuestionOption[];
}

export interface QuestionOption {
    id: number;
    optionTitle: string;
    optionImgPath?: string;
}
