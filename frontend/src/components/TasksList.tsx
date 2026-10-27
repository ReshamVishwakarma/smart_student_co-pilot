import React, { useState } from 'react';
import { StudentTask } from '../types';
import { CheckSquare, Clock, AlertCircle, CheckCircle2, Tag } from 'lucide-react';

interface TasksListProps {
  tasks: StudentTask[];
  onToggleTask: (id: string) => void;
}

export const TasksList: React.FC<TasksListProps> = ({ tasks, onToggleTask }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const getPriorityStyle = (priority: StudentTask['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'high':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'medium':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-blue-50 text-blue-600">
            <CheckSquare className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">
            Tasks & Academic Deadlines
          </h2>
          <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
            Sample Data
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          {(['all', 'pending', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                filter === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Task List items */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <p className="text-center py-6 text-xs text-slate-400">
            No tasks match the selected filter.
          </p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`flex items-start justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                task.completed
                  ? 'bg-slate-50/60 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 hover:text-brand-600 focus:outline-hidden transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-brand-500" />
                  )}
                </button>
                <div className="space-y-1">
                  <h4
                    className={`text-xs font-semibold ${
                      task.completed
                        ? 'line-through text-slate-500'
                        : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-medium text-slate-700">
                      {task.course}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{task.estimatedMinutes}m est.</span>
                    </span>
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px]"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Due Date & Urgency Tag */}
              <div className="text-right shrink-0 ml-3 space-y-1">
                <div
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block ${getPriorityStyle(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </div>
                <div className="flex items-center justify-end space-x-1 text-[11px] text-slate-500 font-medium">
                  <AlertCircle className="w-3 h-3 text-slate-400" />
                  <span>{task.dueDate}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
