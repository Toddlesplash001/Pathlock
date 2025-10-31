export interface Project {
    id: number;
    name: string;
    description?: string;
    tasks?: Task[];
  }
  
  export interface Task {
    id: number;
    title: string;
    completed: boolean;
    projectId: number;
  }
  