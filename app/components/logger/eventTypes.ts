export type AnalyticsEventMap = {
    page_view: { path: string };
    submit_country: { countryId: number };
    failed_country_submit: { countryId?: number; error?: string };
    chat_open: { page: string };
    chat_close: { page: string };
    chat_message_sent: {
        page?: string;
        chatSessionId: string;
        message: string;
    };
    chat_message_received: {
        page?: string;
        chatSessionId: string;
        reply: string;
    };
    next_step: { page?: string; total_steps: number };
    go_to_answer: { page?: string; current_step: number };
    reveal_answer: { page?: string };
    answer_evaluation: { page?: string; correct: boolean };
    rate_difficulty: { page?: string; rating: number };
    select_subject: { page?: string; subjects: Array<string> };
};
