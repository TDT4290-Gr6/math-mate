export interface Problem {
    title: string;
    solution: string;
    difficulty: number;
    description: string;
    problemID: string;
    topic: string;
    methods: Method[];
}

export interface Method {
    methodID: string;
    title: string;
    description: string;
    steps: Step[];
}

export interface Step {
    stepID: string;
    content: string;
}
