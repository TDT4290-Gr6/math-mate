export type AnalyticsEventMap = {
    page_view: { page: string };
    submit_country: { countryId: number };
    failed_country_submit: { countryId?: number; error?: string };
    chat_open: { page?: string };
    chat_close: { page?: string };
    chat_message_sent: {
        page?: string;
        chatSessionId: string;
        message: string;
        current_step: number;
    };
    chat_message_received: {
        page?: string;
        chatSessionId: string;
        reply: string;
        current_step: number;
    };
    next_step: { page?: string; total_steps: number; current_step: number };
    go_to_answer: { page?: string; total_steps: number; current_step: number };
    reveal_answer: { page?: string };
    answer_evaluation: { page?: string; correct: boolean };
    rate_difficulty: { page?: string; rating: number };
    open_answer_popup: { page?: string };
    close_answer_popup: { page?: string };
    save_selected_subjects: { page?: string; subjects: Array<string> };
    cancel_selected_subjects: {
        page?: string;
        initial_subjects: Array<string>;
    };
    next_problem: { page?: string; next_problemId: number };
    previous_problem: { page?: string; previous_problemId?: number };
    start_solving: { page?: string };
    choose_method: { page?: string };
    solve_yourself: { page?: string };
    use_step_by_step: { page?: string };
    start_practicing: { page?: string };
    toggle_subject: {
        page?: string;
        subject: string;
        selected: boolean;
        current_selection: Array<string>;
    };
    open_subject_popup: { page?: string };
    close_subject_popup: { page?: string };
    open_sidebar: { page?: string };
    close_sidebar: { page?: string };
    sign_out: { page?: string };
    sign_in: { page?: string };
    toggle_theme: { page?: string; theme: string };
    navigate_previous_solve: { page?: string };
};
