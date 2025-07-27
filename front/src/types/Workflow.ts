export interface WorkflowStep {
  id: string;
  type: 'enhance' | 'generate' | 'export' | 'share';
  config: unknown;
  order: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  isActive: boolean;
  schedule?: string; // cron expression
  lastRun?: string;
  automationLevel: 'manual' | 'semi' | 'full';
  triggers: WorkflowTrigger[];
}

export interface WorkflowTrigger {
  type: 'time' | 'event' | 'condition';
  config: unknown;
}