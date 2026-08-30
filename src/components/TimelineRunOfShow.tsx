import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  ChevronRight,
  ListTodo
} from 'lucide-react';
import { PartyPlan, TimelineStep } from '../types';

interface TimelineRunOfShowProps {
  plan: PartyPlan;
  onUpdatePlan: (updated: PartyPlan) => void;
}

export const TimelineRunOfShow: React.FC<TimelineRunOfShowProps> = ({
  plan,
  onUpdatePlan,
}) => {
  const [newStepTimeframe, setNewStepTimeframe] = useState('Day-Of Afternoon');
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [activeStepIdForTask, setActiveStepIdForTask] = useState<string | null>(null);

  const toggleTaskCompleted = (stepId: string, taskIndex: number) => {
    // We can store completed state in timeline
    const updated = plan.timeline.map((step) => {
      if (step.id === stepId) {
        // Toggle step completion if all tasks or mark step
        return { ...step, completed: !step.completed };
      }
      return step;
    });

    onUpdatePlan({ ...plan, timeline: updated });
  };

  const handleAddTaskToStep = (stepId: string) => {
    if (!newTaskText.trim()) return;

    const updated = plan.timeline.map((step) => {
      if (step.id === stepId) {
        return {
          ...step,
          tasks: [...step.tasks, newTaskText.trim()],
        };
      }
      return step;
    });

    onUpdatePlan({ ...plan, timeline: updated });
    setNewTaskText('');
    setActiveStepIdForTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Host Run-of-Show & Shopping Timeline
              </h3>
              <p className="text-xs text-slate-500">
                Stress-free step-by-step schedule from 1 week out to the moment guests ring the doorbell.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
        {plan.timeline.map((step, idx) => {
          return (
            <div
              key={step.id || `t-${idx}`}
              className="relative pl-12 sm:pl-14 group"
            >
              {/* Step indicator dot */}
              <button
                onClick={() => toggleTaskCompleted(step.id, 0)}
                className={`absolute left-4 -translate-x-1/2 top-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                  step.completed
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs'
                    : 'bg-white border-amber-500 text-amber-600 hover:bg-amber-50'
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="text-[11px] font-extrabold">{idx + 1}</span>
                )}
              </button>

              {/* Step Card */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  step.completed
                    ? 'bg-slate-50 border-slate-200 opacity-75'
                    : 'bg-white border-slate-200 hover:border-amber-300 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      {step.timeframe}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                  </div>
                  <button
                    onClick={() => toggleTaskCompleted(step.id, 0)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                  >
                    {step.completed ? 'Mark Incomplete' : 'Mark Stage Done'}
                  </button>
                </div>

                {/* Tasks */}
                <div className="space-y-2">
                  {step.tasks.map((task, tIdx) => (
                    <div
                      key={tIdx}
                      className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span className={step.completed ? 'line-through text-slate-400' : ''}>
                        {task}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add task inline */}
                {activeStepIdForTask === step.id ? (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add another preparation task..."
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddTaskToStep(step.id);
                      }}
                      className="grow px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => handleAddTaskToStep(step.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setActiveStepIdForTask(null)}
                      className="text-xs text-slate-400 hover:text-slate-600 px-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveStepIdForTask(step.id)}
                    className="mt-3 text-xs font-medium text-amber-700 hover:text-amber-900 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add custom task
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
