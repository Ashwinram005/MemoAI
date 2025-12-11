import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Calendar, ListTodo, ChevronDown } from 'lucide-react';

export default function TaskForm({ onSubmit, onCancel, isLoading }) {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('todo');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, dueDate, status });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <ListTodo size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white leading-tight">Create Task</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Add a new item to your board</p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm hover:shadow border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-8 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Task Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="What needs to be done?"
                            autoFocus
                            className="text-lg font-medium"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Input
                                label="Due Date"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                                icon={Calendar}
                            />

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 ml-1">Status</label>
                                <div className="relative group">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="appearance-none block w-full rounded-xl border transition-all duration-200 ease-out h-[52px] px-4 py-3 bg-gray-50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 focus:bg-white dark:focus:bg-gray-900 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-500/20 focus:outline-none text-[15px] font-medium cursor-pointer"
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400 dark:text-gray-500 group-hover:text-primary-500 transition-colors">
                                        <ChevronDown size={18} strokeWidth={2.5} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions inside the form for semantics, but visually separated */}
                        <div className="flex justify-end gap-3 pt-6 mt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onCancel}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="px-8 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                            >
                                Create Task
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
