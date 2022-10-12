import mongoose, { Document, Schema } from "mongoose";



export interface ITask {
    id?: string;
    date?: string;
    comment?: string;
    manualTime?: number;
}
export interface IPrincipal {
    id?: string;
    name?: string;
    projectId?: string;
    projectName?: string;
    taskTimes?: Array<ITask>;
    totalTime?: number;

}
export interface IWeek {
    id?: string;
    from?: string;
    to?: string;
}
export interface IRecentTask {
    id?: string;
    projects?: Array<string>;
    type?: string;
    name?: string;
}

export interface ITaskInput {
    comment?: string;
    date?: string;
    time?: string;
    user?: string;


}
export interface IWeeklyTasks {
    id?: string;
    week?: IWeek;
    tasks?: Array<IPrincipal>;
}



