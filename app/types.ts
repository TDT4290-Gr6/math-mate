export interface Step {
  id: number;
  stepNumber: number;
  content: string;
}

export interface Method {
  id: number;
  title: string;
  description: string;
  steps: Step[];
}

export interface Problem {
  id: number;
  problem: string;
  solution: string;
  subject: string;
  title?: string;
  methods: Method[];
}