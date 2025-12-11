import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createTask, getTaskSummary } from '../api/tasks';
import TaskForm from '../components/tasks/TaskForm';
import { Button } from '../components/ui/Button';
import { Plus, ChevronLeft, ChevronRight, CheckCircle2, Circle, Clock, Sparkles, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { cn } from '../utils';

export default function Tasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    const fetchTasks = async () => {
        setSummaryLoading(true);
        try {
            const start = format(currentWeekStart, 'yyyy-MM-dd');
            const end = format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');
            const data = await getTaskSummary(user.userId, start, end);
            setTasks(data.tasks || []);
            setSummary(data.summary);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load tasks');
        } finally {
            setSummaryLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user.userId, currentWeekStart]);

    const handleCreateTask = async (taskData) => {
        setLoading(true);
        try {
            await createTask({ ...taskData, userId: user.userId });
            toast.success('Task created');
            setShowForm(false);
            fetchTasks();
        } catch (error) {
            console.error(error);
            toast.error('Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    const handlePrevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    const handleNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));

    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'all') return true;
        return task.status === activeTab;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'todo': return 'border-gray-300 bg-gray-50 text-gray-600';
            case 'in_progress': return 'border-blue-500 bg-blue-50 text-blue-700';
            case 'done': return 'border-green-500 bg-green-50 text-green-700';
            default: return 'border-gray-300';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'todo': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">To Do</span>;
            case 'in_progress': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">In Progress</span>;
            case 'done': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Done</span>;
            default: return null;
        }
    };

    const tabs = [
        { id: 'all', label: 'All Tasks' },
        { id: 'todo', label: 'To Do' },
        { id: 'in_progress', label: 'In Progress' },
        { id: 'done', label: 'Completed' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-gray-100">Task Board</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your weekly priorities</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
                    <button onClick={handlePrevWeek} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"><ChevronLeft size={20} /></button>
                    <span className="font-medium text-gray-900 text-sm w-32 text-center tabular-nums">
                        {format(currentWeekStart, 'MMM d')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM d')}
                    </span>
                    <button onClick={handleNextWeek} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"><ChevronRight size={20} /></button>
                </div>
                <Button onClick={() => setShowForm(true)} className="shadow-lg shadow-primary-500/20">
                    <Plus size={18} className="mr-2" /> New Task
                </Button>
            </div>

            {/* AI Summary Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-2xl p-6 md:p-8 border border-indigo-100 dark:border-indigo-800/50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles size={120} className="text-indigo-500 dark:text-indigo-400" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-white dark:bg-gray-800 p-1.5 rounded-lg shadow-sm">
                            <Sparkles size={18} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wide">Weekly AI Summary</h2>
                    </div>

                    {summaryLoading ? (
                        <div className="h-16 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    ) : (
                        <p className="text-lg text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed font-medium max-w-3xl">
                            {summary || "No tasks recorded for this week yet. Start adding tasks to get an AI-generated summary of your progress and focus areas."}
                        </p>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200",
                                activeTab === tab.id
                                    ? "border-primary-500 text-primary-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            {tab.label}
                            {tab.id === 'all' && <span className="ml-2 py-0.5 px-2 bg-gray-100 text-gray-600 rounded-full text-xs">{tasks.length}</span>}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Task Grid */}
            <div className="grid gap-4">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <CheckSquare className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
                        <p className="text-gray-500 text-sm mt-1">Create a new task to get started</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className={cn(
                                "group bg-white dark:bg-gray-800 rounded-xl p-5 border-l-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between",
                                task.status === 'done' ? "border-l-green-500" : task.status === 'in_progress' ? "border-l-blue-500" : "border-l-gray-300 dark:border-l-gray-600"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    className={cn(
                                        "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                        task.status === 'done'
                                            ? "bg-green-500 border-green-500 text-white"
                                            : "border-gray-300 text-transparent hover:border-primary-500"
                                    )}
                                    onClick={() => { /* Toggle status logic would go here */ }}
                                >
                                    <CheckCircle2 size={14} fill="currentColor" />
                                </button>

                                <div>
                                    <h3 className={cn(
                                        "text-base font-medium text-gray-900 dark:text-gray-100 transition-all",
                                        task.status === 'done' && "line-through text-gray-400 dark:text-gray-500"
                                    )}>
                                        {task.title}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-1.5">
                                        <div className={cn(
                                            "flex items-center text-xs font-medium px-2 py-0.5 rounded",
                                            (task.dueDate && isSameDay(new Date(task.dueDate), new Date())) ? "text-orange-700 bg-orange-50" :
                                                (task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done') ? "text-red-700 bg-red-50" : "text-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                                        )}>
                                            {task.dueDate ? (
                                                <>
                                                    <Calendar size={12} className="mr-1.5" />
                                                    {(() => {
                                                        try {
                                                            return format(new Date(task.dueDate), 'MMM d, yyyy');
                                                        } catch (e) {
                                                            return 'No Date';
                                                        }
                                                    })()}
                                                </>
                                            ) : (
                                                <>
                                                    <Calendar size={12} className="mr-1.5" />
                                                    No Date
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {getStatusBadge(task.status)}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    {/* Add Edit/Delete buttons here */}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showForm && (
                <TaskForm
                    onSubmit={handleCreateTask}
                    onCancel={() => setShowForm(false)}
                    isLoading={loading}
                />
            )}
        </div>
    );
}

function CheckSquare({ size, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
    );
}
